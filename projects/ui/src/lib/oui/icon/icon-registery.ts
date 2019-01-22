import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, Optional, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  forkJoin,
  Observable,
  of as observableOf,
  throwError as observableThrow
} from 'rxjs';
import { catchError, finalize, map, share, tap } from 'rxjs/operators';

/**
 * Returns an exception to be thrown in the case when attempting to
 * load an icon with a name that cannot be found.
 * @docs-private
 */
export function getOuiIconNameNotFoundError(iconName: string): Error {
  return Error(`Unable to find icon with the name "${iconName}"`);
}

/**
 * Returns an exception to be thrown when the consumer attempts to use
 * `<oui-icon>` without including @angular/http.
 * @docs-private
 */
export function getOuiIconNoHttpProviderError(): Error {
  return Error(
    'Could not find HttpClient provider for use with OuiIcon. ' +
      'Please include the HttpClientModule from @angular/common/http in your ' +
      'app imports.'
  );
}

/**
 * Returns an exception to be thrown when a URL couldn't be sanitized.
 * @param url URL that was attempted to be sanitized.
 * @docs-private
 */
export function getOuiIconFailedToSanitizeUrlError(
  url: SafeResourceUrl
): Error {
  return Error(
    `The URL provided to OuiIconRegistry was not trusted as a resource URL ` +
      `via Angular's DomSanitizer. Attempted URL was "${url}".`
  );
}

/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 */
class SvgIconConfig {
  url: SafeResourceUrl | null;
  svgElement: SVGElement | null;
  constructor(url: SafeResourceUrl);
  constructor(data: SafeResourceUrl | SVGElement) {
    this.url = data as SafeResourceUrl;
  }
}

/**
 * Service to register and display icons used by the `<oui-icon>` component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
@Injectable({ providedIn: 'root' })
export class OuiIconRegistry {
  private _document: Document;

  /**
   * URLs and cached SVG elements for individual icons. Keys are of the format
   */
  private _svgIconConfigs = new Map<string, SvgIconConfig>();

  /**
   * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
   * Multiple icon sets can be registered under the same namespace.
   */
  private _iconSetConfigs = new Map<string, SvgIconConfig[]>();

  /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
  private _inProgressUrlFetches = new Map<string, Observable<string>>();

  constructor(
    @Optional() private _httpClient: HttpClient,
    private _sanitizer: DomSanitizer,
    @Optional()
    @Inject(DOCUMENT)
    document: any
  ) {
    this._document = document;
  }

  /**
   * Registers an icon by URL in the default namespace.
   * @param iconName Name under which the icon should be registered.
   * @param url
   */
  addSvgIcon(iconName: string, url: SafeResourceUrl): this {
    this._svgIconConfigs.set(iconKey('', iconName), new SvgIconConfig(url));
    return this;
  }

  /**
   * Registers an icon set by URL in the default namespace.
   * @param url
   */
  addSvgIconSet(url: SafeResourceUrl): this {
    const config = new SvgIconConfig(url);
    const configNamespace = this._iconSetConfigs.get('');

    if (configNamespace) {
      configNamespace.push(config);
    } else {
      this._iconSetConfigs.set('', [config]);
    }

    return this;
  }

  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
   * and namespace. The icon must have been previously registered with addIcon or addIconSet;
   * if not, the Observable will throw an error.
   * @param name
   * @param namespace
   */
  getNamedSvgIcon(name, namespace: string = ''): Observable<SVGElement> {
    // Return (copy of) cached icon if possible.
    const key = iconKey(namespace, name);
    const config = this._svgIconConfigs.get(key);
    if (config) {
      return this._getSvgFromConfig(config);
    }

    // See if we have any icon sets registered for the namespace.
    const iconSetConfigs = this._iconSetConfigs.get(namespace);

    if (iconSetConfigs) {
      return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
    }

    return observableThrow(getOuiIconNameNotFoundError(key));
  }

  /**
   * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
   */
  private _getSvgFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    if (config.svgElement) {
      // We already have the SVG element for this icon, return a copy.
      return observableOf(cloneSvg(config.svgElement));
    } else {
      // Fetch the icon from the config's URL, cache it, and return a copy.
      return this._loadSvgIconFromConfig(config).pipe(
        tap(svg => (config.svgElement = svg)),
        map(svg => cloneSvg(svg))
      );
    }
  }

  /**
   * Attempts to find an icon with the specified name in any of the SVG icon sets.
   * First searches the available cached icons for a nested element with a matching name, and
   * if found copies the element to a new `<svg>` element. If not found, fetches all icon sets
   * that have not been cached, and searches again after all fetches are completed.
   * The returned Observable produces the SVG element if possible, and throws
   * an error if no icon with the specified name can be found.
   */
  private _getSvgFromIconSetConfigs(
    name: string,
    iconSetConfigs: SvgIconConfig[]
  ): Observable<SVGElement> {
    // For all the icon set SVG elements we've fetched, see if any contain an icon with the
    // requested name.
    const namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);

    if (namedIcon) {
      // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
      // time anyway, there's probably not much advantage compared to just always extracting
      // it from the icon set.
      return observableOf(namedIcon);
    }

    // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
    // fetched, fetch them now and look for iconName in the results.
    const iconSetFetchRequests: Observable<SVGElement | null>[] = iconSetConfigs
      .filter(iconSetConfig => !iconSetConfig.svgElement)
      .map(iconSetConfig => {
        return this._loadSvgIconSetFromConfig(iconSetConfig).pipe(
          catchError(
            (err: HttpErrorResponse): Observable<SVGElement | null> => {
              const url = this._sanitizer.sanitize(
                SecurityContext.RESOURCE_URL,
                iconSetConfig.url
              );

              // Swallow errors fetching individual URLs so the
              // combined Observable won't necessarily fail.
              console.error(
                `Loading icon set URL: ${url} failed: ${err.message}`
              );
              return observableOf(null);
            }
          )
        );
      });

    // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
    // cached SVG element (unless the request failed), and we can check again for the icon.
    return forkJoin(iconSetFetchRequests).pipe(
      map(() => {
        const foundIcon = this._extractIconWithNameFromAnySet(
          name,
          iconSetConfigs
        );

        if (!foundIcon) {
          throw getOuiIconNameNotFoundError(name);
        }

        return foundIcon;
      })
    );
  }

  /**
   * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
   * tag matches the specified name. If found, copies the nested element to a new SVG element and
   * returns it. Returns null if no matching element is found.
   */
  private _extractIconWithNameFromAnySet(
    iconName: string,
    iconSetConfigs: SvgIconConfig[]
  ): SVGElement | null {
    // Iterate backwards, so icon sets added later have precedence.
    for (let i = iconSetConfigs.length - 1; i >= 0; i--) {
      const config = iconSetConfigs[i];
      if (config.svgElement) {
        const foundIcon = this._extractSvgIconFromSet(
          config.svgElement,
          iconName
        );
        if (foundIcon) {
          return foundIcon;
        }
      }
    }
    return null;
  }

  /**
   * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
   * from it.
   */
  private _loadSvgIconFromConfig(
    config: SvgIconConfig
  ): Observable<SVGElement> {
    return this._fetchUrl(config.url).pipe(
      map(svgText => this._createSvgElementForSingleIcon(svgText))
    );
  }

  /**
   * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
   * from it.
   */
  private _loadSvgIconSetFromConfig(
    config: SvgIconConfig
  ): Observable<SVGElement> {
    // If the SVG for this icon set has already been parsed, do nothing.
    if (config.svgElement) {
      return observableOf(config.svgElement);
    }

    return this._fetchUrl(config.url).pipe(
      map(svgText => {
        // It is possible that the icon set was parsed and cached by an earlier request, so parsing
        // only needs to occur if the cache is yet unset.
        if (!config.svgElement) {
          config.svgElement = this._svgElementFromString(svgText);
        }

        return config.svgElement;
      })
    );
  }

  /**
   * Creates a DOM element from the given SVG string, and adds default attributes.
   */
  private _createSvgElementForSingleIcon(responseText: string): SVGElement {
    const svg = this._svgElementFromString(responseText);
    this._setSvgAttributes(svg);
    return svg;
  }

  /**
   * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
   * tag matches the specified name. If found, copies the nested element to a new SVG element and
   * returns it. Returns null if no matching element is found.
   */
  private _extractSvgIconFromSet(
    iconSet: SVGElement,
    iconName: string
  ): SVGElement | null {
    const iconSource = iconSet.querySelector('#' + iconName);

    if (!iconSource) {
      return null;
    }

    // Clone the element and remove the ID to prevent multiple elements from being added
    // to the page with the same ID.
    const iconElement = iconSource.cloneNode(true) as Element;
    iconElement.removeAttribute('id');

    // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
    // the content of a new <svg> node.
    if (iconElement.nodeName.toLowerCase() === 'svg') {
      return this._setSvgAttributes(iconElement as SVGElement);
    }

    // If the node is a <symbol>, it won't be rendered so we have to convert it into <svg>. Note
    // that the same could be achieved by referring to it via <use href="#id">, however the <use>
    // tag is problematic on Firefox, because it needs to include the current page path.
    if (iconElement.nodeName.toLowerCase() === 'symbol') {
      return this._setSvgAttributes(this._toSvgElement(iconElement));
    }

    // createElement('SVG') doesn't work as expected; the DOM ends up with
    // the correct nodes, but the SVG content doesn't render. Instead we
    // have to create an empty SVG node using innerHTML and append its content.
    // Elements created using DOMParser.parseFromString have the same problem.
    // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
    const svg = this._svgElementFromString('<svg></svg>');
    // Clone the node so we don't remove it from the parent icon set element.
    svg.appendChild(iconElement);

    return this._setSvgAttributes(svg);
  }

  /**
   * Creates a DOM element from the given SVG string.
   */
  private _svgElementFromString(str: string): SVGElement {
    const div = this._document.createElement('DIV');
    div.innerHTML = str;
    const svg = div.querySelector('svg') as SVGElement;

    if (!svg) {
      throw Error('<svg> tag not found');
    }

    return svg;
  }

  /**
   * Converts an element into an SVG node by cloning all of its children.
   */
  private _toSvgElement(element: Element): SVGElement {
    const viewBox = element.getAttribute('viewBox').split(' ');
    const width = `${viewBox[2]}px`;
    const height = `${viewBox[3]}px`;
    const svgTag = `<svg height="${height}" width="${width}"></svg>`;

    const svg = this._svgElementFromString(svgTag);
    for (let i = 0; i < element.childNodes.length; i++) {
      if (element.childNodes[i].nodeType === this._document.ELEMENT_NODE) {
        svg.appendChild(element.childNodes[i].cloneNode(true));
      }
    }
    return svg;
  }

  /**
   * Sets the default attributes for an SVG element to be used as an icon.
   */
  private _setSvgAttributes(svg: SVGElement): SVGElement {
    svg.setAttribute('fit', '');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.

    return svg;
  }

  /**
   * Returns an Observable which produces the string contents of the given URL. Results may be
   * cached, so future calls with the same URL may not cause another HTTP request.
   */
  private _fetchUrl(safeUrl: SafeResourceUrl | null): Observable<string> {
    try {
      if (!this._httpClient) {
        throw getOuiIconNoHttpProviderError();
      }

      if (safeUrl == null) {
        throw Error(`Cannot fetch icon from URL "${safeUrl}".`);
      }

      const url = this._sanitizer.sanitize(
        SecurityContext.RESOURCE_URL,
        safeUrl
      );

      if (!url) {
        throw getOuiIconFailedToSanitizeUrlError(safeUrl);
      }

      // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
      // already a request in progress for that URL. It's necessary to call share() on the
      // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
      const inProgressFetch = this._inProgressUrlFetches.get(url);

      if (inProgressFetch) {
        return inProgressFetch;
      }
      // Observable. Figure out why and fix it.
      const req = this._httpClient.get(url, { responseType: 'text' }).pipe(
        finalize(() => this._inProgressUrlFetches.delete(url)),
        share()
      );

      this._inProgressUrlFetches.set(url, req);
      return req;
    } catch (e) {
      throw Error(`Cannot fetch icon from URL "${e.Message}".`);
    }
  }
}

/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg: SVGElement): SVGElement {
  return svg.cloneNode(true) as SVGElement;
}

/** Returns the cache key to use for an icon namespace and name. */
function iconKey(namespace: string, name: string) {
  return namespace + ':' + name;
}
