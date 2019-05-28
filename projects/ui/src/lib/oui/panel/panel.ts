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
  EventEmitter
} from '@angular/core';
import { PanelPositionX, PanelPositionY } from './panel-positions';
import {
  throwOuiPanelInvalidPositionX,
  throwOuiPanelInvalidPositionY
} from './panel-errors';
import { OuiPanelOverlay } from './panel-overlay';
import { OuiPanelContent } from './panel-content';
import { Subject, Observable } from 'rxjs';

/** Default `oui-panel` options that can be overridden. */
export interface OuiPanelDefaultOptions {
  /** The x-axis position of the menu. */
  xPosition: PanelPositionX;

  /** The y-axis position of the menu. */
  yPosition: PanelPositionY;
}

/** Injection token to be used to override the default options for `oui-menu`. */
export const OUI_PANEL_DEFAULT_OPTIONS = new InjectionToken<
  OuiPanelDefaultOptions
>('oui-panel-default-options', {
  providedIn: 'root',
  factory: OUI_PANEL_DEFAULT_OPTIONS_FACTORY
});

/** @docs-private */
export function OUI_PANEL_DEFAULT_OPTIONS_FACTORY(): OuiPanelDefaultOptions {
  return {
    xPosition: 'after',
    yPosition: 'below'
  };
}

@Component({
  selector: 'oui-panel',
  templateUrl: 'panel.html',
  styleUrls: ['panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiPanel'
})
export class OuiPanel implements OnInit, OuiPanelOverlay {
  private _xPosition: PanelPositionX = this._defaultOptions.xPosition;
  private _yPosition: PanelPositionY = this._defaultOptions.yPosition;
  private readonly _mouseLeave: Subject<MouseEvent> = new Subject<MouseEvent>();
  public mouseLeave: Observable<MouseEvent>;
  private readonly _mouseEnter: Subject<MouseEvent> = new Subject<MouseEvent>();
  public mouseEnter: Observable<MouseEvent>;

  @Input() width?: number;


  /** Config object to be passed into the menu's ngClass */
  _classList: { [key: string]: boolean } = {};

  @ViewChild(TemplateRef)
  templateRef: TemplateRef<any>;

  /**
   * Panel content that will be rendered lazily.
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
}

@Component({
  selector: 'oui-panel-icon',
  template: '<div class="oui-panel-icon"></div>',
  styleUrls: ['panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiPanelIcon'
})
export class OuiPanelIcon {}
