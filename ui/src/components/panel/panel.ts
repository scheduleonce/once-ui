import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Component,
  InjectionToken,
  input,
  model,
  ViewChild,
  TemplateRef,
  OnInit,
  ContentChild,
  output,
  NgZone,
  ElementRef,
  OnDestroy,
  inject,
  HostAttributeToken,
  ChangeDetectorRef,
  ErrorHandler,
  effect,
} from '@angular/core';
import { PanelPositionX, PanelPositionY } from './panel-positions';
import {
  throwOuiPanelInvalidPositionX,
  throwOuiPanelInvalidPositionY,
} from './panel-errors';
import { OuiPanelOverlay } from './panel-overlay';
import { OuiPanelContent } from './panel-content';
import { Subject, Observable, Subscription } from 'rxjs';
import { OuiIconRegistry } from '../icon/icon-registery';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from '../core/shared/icons';
import { FocusMonitor } from '@angular/cdk/a11y';

/** Default `oui-panel` options that can be overridden. */
export interface OuiPanelDefaultOptions {
  /** The x-axis position of the menu. */
  xPosition: PanelPositionX;

  /** The y-axis position of the menu. */
  yPosition: PanelPositionY;
}

/** Injection token to be used to override the default options for `oui-menu`. */
export const OUI_PANEL_DEFAULT_OPTIONS =
  new InjectionToken<OuiPanelDefaultOptions>('oui-panel-default-options', {
    providedIn: 'root',
    factory: OUI_PANEL_DEFAULT_OPTIONS_FACTORY,
  });

/** @docs-private */
export function OUI_PANEL_DEFAULT_OPTIONS_FACTORY(): OuiPanelDefaultOptions {
  return {
    xPosition: 'after',
    yPosition: 'below',
  };
}

@Component({
  selector: 'oui-panel',
  templateUrl: 'panel.html',
  styleUrls: ['panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiPanel',
  standalone: false,
})
export class OuiPanel implements OnInit, OnDestroy, OuiPanelOverlay {
  private _defaultOptions = inject<OuiPanelDefaultOptions>(
    OUI_PANEL_DEFAULT_OPTIONS
  );

  private readonly _mouseLeave: Subject<MouseEvent> = new Subject<MouseEvent>();
  public mouseLeave: Observable<MouseEvent>;
  private readonly _mouseEnter: Subject<MouseEvent> = new Subject<MouseEvent>();
  public mouseEnter: Observable<MouseEvent>;
  public escapeEvent: Subject<void> = new Subject<void>();

  readonly width = input<number>();

  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _classObserver: MutationObserver | null = null;

  /** Config object to be passed into the menu's ngClass */
  _classList: { [key: string]: boolean } = {};

  @ViewChild(TemplateRef)
  templateRef: TemplateRef<any>;

  /**
   * Panel content that will be rendered lazily.
   *
   * @docs-private
   */
  @ContentChild(OuiPanelContent)
  lazyContent: OuiPanelContent;

  /** Event emitted when the menu is closed. */
  readonly closed = output<void>();

  /** Position of the menu in the X axis. */
  readonly xPosition = model(this._defaultOptions.xPosition);

  /** Position of the menu in the Y axis. */
  readonly yPosition = model(this._defaultOptions.yPosition);

  constructor() {
    this.mouseLeave = this._mouseLeave.asObservable();
    this.mouseEnter = this._mouseEnter.asObservable();
    effect(() => {
      const xPosition = this.xPosition();
      const yPosition = this.yPosition();
      if (xPosition !== 'before' && xPosition !== 'after') {
        throwOuiPanelInvalidPositionX();
      }
      if (yPosition !== 'above' && yPosition !== 'below') {
        throwOuiPanelInvalidPositionY();
      }
      this.setPositionClasses(xPosition, yPosition);
    });
  }

  ngOnInit() {
    this.setPositionClasses();
    this._copyHostClasses();
    // Watch for dynamic class changes on the host element and mirror them
    // onto the panel's `_classList` so the overlay reflects host classes.
    try {
      this._classObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && m.attributeName === 'class') {
            this._copyHostClasses();
          }
        }
      });
      this._classObserver.observe(this._elementRef.nativeElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    } catch (e) {
      // MutationObserver may not be available in some environments; ignore.
    }
  }

  ngOnDestroy() {
    if (this._classObserver) {
      this._classObserver.disconnect();
      this._classObserver = null;
    }
  }

  /** Copies classes from the host `oui-panel` element onto `_classList`. */
  private _copyHostClasses() {
    try {
      const el = this._elementRef.nativeElement;
      if (!el) return;

      const hostClasses = Array.from(el.classList || []).filter(
        (c) =>
          c !== 'oui-panel' && !/^oui-panel-(before|after|above|below)$/.test(c)
      );
      const hostSet = new Set(hostClasses);

      // Remove any previously set classes that are not position classes and
      // are no longer present on the host element.
      for (const key of Object.keys(this._classList)) {
        if (/^oui-panel-(before|after|above|below)$/.test(key)) {
          continue;
        }
        if (!hostSet.has(key)) {
          delete this._classList[key];
        }
      }

      // Add host classes to the class list so the overlay mirrors them.
      for (const c of hostClasses) {
        this._classList[c] = true;
      }
      // Ensure OnPush templates are checked after we mutate the class map.
      try {
        this._changeDetectorRef.markForCheck();
      } catch (e) {
        // ignore in environments without change detector
      }
    } catch (e) {
      // Defensive: ignore errors reading host classes
    }
  }

  /**
   * Adds classes to the panel-overlay based on its position. Can be used by
   * consumers to add specific styling based on the position.
   *
   * @param posX Position of the panel along the x axis.
   * @param posY Position of the panel along the y axis.
   * @docs-private
   */
  setPositionClasses(
    posX: PanelPositionX = this.xPosition(),
    posY: PanelPositionY = this.yPosition()
  ) {
    const classes = this._classList;
    classes['oui-panel-before'] = posX === 'before';
    classes['oui-panel-after'] = posX === 'after';
    classes['oui-panel-above'] = posY === 'above';
    classes['oui-panel-below'] = posY === 'below';
    // Ensure OnPush templates are checked when position classes change.
    try {
      this._changeDetectorRef.markForCheck();
    } catch (e) {
      // ignore
    }
  }

  public _handleMouseLeave(event: MouseEvent) {
    this._mouseLeave.next(event);
  }

  public _handleMouseEnter(event: MouseEvent) {
    this._mouseEnter.next(event);
  }

  public _handleCloseIcon() {
    this.escapeEvent.next();
  }
}

@Component({
  selector: 'oui-panel-icon',
  template:
    '<oui-icon svgIcon="panel-icon" class="oui-panel-icon" [tabIndex]="-1"></oui-icon>',
  styleUrls: ['panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiPanelIcon',
  standalone: false,
})
export class OuiPanelIcon implements OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private ouiIconRegistry = inject(OuiIconRegistry);
  private domSanitizer = inject(DomSanitizer);
  private _focusMonitor = inject(FocusMonitor);
  private _ngZone = inject(NgZone);
  private _errorHandler = inject(ErrorHandler);

  private _monitorSubscription: Subscription = Subscription.EMPTY;
  tabIndex: any;

  constructor() {
    const tabIndex = inject(new HostAttributeToken('tabindex'), {
      optional: true,
    })!;

    this._elementRef.nativeElement.setAttribute('tabindex', '0');
    this.tabIndex = parseInt(tabIndex, 10) || 0;
    this._monitorSubscription = this._focusMonitor
      .monitor(this._elementRef, true)
      .subscribe({
        next: () => this._ngZone.run(() => {}),
        error: (err: Error) => this._errorHandler.handleError(err),
      });

    this.ouiIconRegistry.addSvgIconLiteral(
      `panel-icon`,
      this.domSanitizer.bypassSecurityTrustHtml(ICONS.PANEL_ICON)
    );
    this.ouiIconRegistry.addSvgIconLiteral(
      `close-icon_8X8`,
      this.domSanitizer.bypassSecurityTrustHtml(ICONS.CLOSE_ICON_8X8)
    );
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    this._monitorSubscription.unsubscribe();
  }
}
