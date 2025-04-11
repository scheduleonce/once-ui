import {
  Component,
  ViewEncapsulation,
  Input,
  OnInit,
  ElementRef,
  Attribute,
  ChangeDetectionStrategy,
  InjectionToken,
  inject,
} from '@angular/core';
import { CanColor, CanColorCtor, mixinColor } from '../core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OuiIconRegistry } from './icon-registery';
import { take } from 'rxjs/operators';
import { TitleCasePipe } from '@angular/common';
import { DOCUMENT } from '@angular/common';

// Boilerplate for applying mixins to OuiButton.
/** @docs-private */
export class OuiIconBase {
  constructor(public _elementRef: ElementRef) {}
}

export const OuiIconMixinBase: CanColorCtor & typeof OuiIconBase =
  mixinColor(OuiIconBase);

/**
 * Injection token used to provide the current location to `OuiIcon`.
 * Used to handle server-side rendering and to stub out during unit tests.
 *
 * @docs-private
 */
export const OUI_ICON_LOCATION = new InjectionToken<OuiIconLocation>(
  'oui-icon-location',
  {
    providedIn: 'root',
    factory: OUI_ICON_LOCATION_FACTORY,
  }
);

/**
 * Stubbed out location for `OuiIcon`.
 *
 * @docs-private
 */
export interface OuiIconLocation {
  getPathname: () => string;
}

/** @docs-private */
export function OUI_ICON_LOCATION_FACTORY(): OuiIconLocation {
  const _document = inject(DOCUMENT);
  const _location = _document ? _document.location : null;

  return {
    // Note that this needs to be a function, rather than a property, because Angular
    // will only resolve it once, but we want the current path on each call.
    getPathname: () => (_location ? _location.pathname + _location.search : ''),
  };
}

/**
 * oui-icon makes it easier to use vector-based icons in your app. This directive supports only SVG icons.
 * To associate a name with an icon URL, use the addSvgIcon. The methods of OuiIconRegistry. After registering an icon, it
 * can be displayed by setting the svgIcon input. For an icon in the default namespace, use the name directly.
 * Component to display an icon. It can be used in the following ways:
 * -  Specify the svgIcon input to load an SVG icon from a URL previously registered with the addSvgIcon, addSvgIconSet.
 *    Examples:
 *    <oui-icon svgIcon="[name]"></oui-icon>
 * -  Use a font ligature as an icon by putting the ligature text in the content of the <oui-icon> component.
 *    Example: <oui-icon>home</oui-icon> <oui-icon>sun</oui-icon>
 */
@Component({
  template: '<ng-content></ng-content>',
  selector: 'oui-icon',
  exportAs: 'ouiIcon',
  styleUrls: ['icon.scss'],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color'],
  host: {
    role: 'img',
    class: 'oui-icon',
    '[class.oui-icon-inline]': 'inline',
    '[attr.aria-label]': 'this.titleCasePipe.transform(this.svgIcon)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class Icon extends OuiIconMixinBase implements OnInit, CanColor {
  /**
   * Whether the icon should be inlined, automatically sizing the icon to match the font size of
   * the element the icon is contained in.
   */
  @Input()
  get inline(): boolean {
    return this._inline;
  }
  set inline(inline: boolean) {
    this._inline = coerceBooleanProperty(inline);
  }
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private _inline: boolean = false;

  /**
   * Implemented as part of CanColor.
   */
  color: any;

  /** Name of the icon in the SVG icon set. */
  @Input()
  svgIcon: string;
  /** User will be able to supply a size property for overriding the size. */
  @Input()
  size: number;

  constructor(
    private _iconRegistry: OuiIconRegistry,
    public _elementRef: ElementRef,
    public titleCasePipe: TitleCasePipe,
    @Attribute('aria-hidden') ariaHidden: string
  ) {
    super(_elementRef);
    // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
    // the right thing to do for the majority of icon use-cases.
    if (!ariaHidden) {
      _elementRef.nativeElement.setAttribute('aria-hidden', 'true');
    }
  }

  ngOnInit() {
    if (this.svgIcon) {
      this._iconRegistry
        .getNamedSvgIcon(this.svgIcon)
        .pipe(take(1))
        .subscribe(
          (svg) => this._setSvgElement(svg),
          (err: Error) => console.log(`Error retrieving icon: ${err.message}`)
        );
    }
  }

  private _setSvgElement(svg: SVGElement) {
    this._clearSvgElement();
    this._elementRef.nativeElement.appendChild(svg);
    let svgSize = svg.getAttribute('height');
    if (this.size) {
      //noinspection TypeScriptUnresolvedFunction
      const { x, y, width, height } = (<any>svg).getBBox();
      svg.setAttribute('height', '100%');
      svg.setAttribute('width', '100%');
      svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
      svgSize = `${this.size}px`;
    }
    this._elementRef.nativeElement.style.height = svgSize;
    this._elementRef.nativeElement.style.width = svgSize;
  }

  private _clearSvgElement() {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    let childCount = layoutElement.childNodes.length;

    // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
    // we can't use innerHTML, because IE will throw if the element has a data binding.
    while (childCount--) {
      const child = layoutElement.childNodes[childCount];

      // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes in order to get rid
      // of any loose text nodes, as well as any SVG elements in order to remove any old icons.
      if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
        layoutElement.removeChild(child);
      }
    }
  }
}
