import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Component,
  InjectionToken,
  Inject,
  Input,
  ViewChild,
  TemplateRef,
  OnInit,
  ContentChild,
  Output,
  EventEmitter,
  Attribute,
  NgZone,
  ElementRef,
  OnDestroy,
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
})
export class OuiPanel implements OnInit, OuiPanelOverlay {
  private _xPosition: PanelPositionX = this._defaultOptions.xPosition;
  private _yPosition: PanelPositionY = this._defaultOptions.yPosition;
  private readonly _mouseLeave: Subject<MouseEvent> = new Subject<MouseEvent>();
  public mouseLeave: Observable<MouseEvent>;
  private readonly _mouseEnter: Subject<MouseEvent> = new Subject<MouseEvent>();
  public mouseEnter: Observable<MouseEvent>;
  public escapeEvent: Subject<void> = new Subject<void>();

  @Input() width?: number;

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
  @Output()
  readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /** Position of the menu in the X axis. */
  @Input()
  get xPosition(): PanelPositionX {
    return this._xPosition;
  }
  set xPosition(value: PanelPositionX) {
    if (value !== 'before' && value !== 'after') {
      throwOuiPanelInvalidPositionX();
    }
    this._xPosition = value;
    this.setPositionClasses();
  }

  /** Position of the menu in the Y axis. */
  @Input()
  get yPosition(): PanelPositionY {
    return this._yPosition;
  }
  set yPosition(value: PanelPositionY) {
    if (value !== 'above' && value !== 'below') {
      throwOuiPanelInvalidPositionY();
    }
    this._yPosition = value;
    this.setPositionClasses();
  }
  constructor(
    @Inject(OUI_PANEL_DEFAULT_OPTIONS)
    private _defaultOptions: OuiPanelDefaultOptions
  ) {
    this.mouseLeave = this._mouseLeave.asObservable();
    this.mouseEnter = this._mouseEnter.asObservable();
  }

  ngOnInit() {
    this.setPositionClasses();
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
    posX: PanelPositionX = this.xPosition,
    posY: PanelPositionY = this.yPosition
  ) {
    const classes = this._classList;
    classes['oui-panel-before'] = posX === 'before';
    classes['oui-panel-after'] = posX === 'after';
    classes['oui-panel-above'] = posY === 'above';
    classes['oui-panel-below'] = posY === 'below';
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
})
export class OuiPanelIcon implements OnDestroy {
  private _monitorSubscription: Subscription = Subscription.EMPTY;
  tabIndex: any;
  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer,
    private _focusMonitor: FocusMonitor,
    private _ngZone: NgZone,
    @Attribute('tabindex') tabIndex: string
  ) {
    this._elementRef.nativeElement.setAttribute('tabindex', '0');
    this.tabIndex = parseInt(tabIndex, 10) || 0;
    this._monitorSubscription = this._focusMonitor
      .monitor(this._elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));

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
