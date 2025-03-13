import {
  InjectionToken,
  Directive,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewContainerRef,
  Inject,
} from '@angular/core';
import {
  ScrollStrategy,
  Overlay,
  OverlayRef,
  FlexibleConnectedPositionStrategy,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { Subscription, Observable, Subject } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { OuiPanelOverlay } from './panel-overlay';
import {
  PanelPositionY,
  PanelPositionX,
  PanelFlexiblePosition,
} from './panel-positions';
import { merge } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { SPACE } from '@angular/cdk/keycodes';
import { FocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';

/** Injection token that determines the scroll handling while the panel-overlay is open. */
export const OUI_PANEL_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>('oui-panel-scroll-strategy');

/** @docs-private */
export function OUI_PANEL_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.close();
}

/** @docs-private */
export const OUI_PANEL_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: OUI_PANEL_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: OUI_PANEL_SCROLL_STRATEGY_FACTORY,
};

/**
 * This directive is intended to be used in conjunction with an oui-panel tag.  It is
 * responsible for toggling the display of the provided panel instance.
 */
@Directive({
    selector: `[oui-panel-trigger-for], [ouiPanelTriggerFor]`,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        'aria-haspopup': 'true',
        '[attr.aria-expanded]': 'panelOpen || null',
        '(mouseenter)': '_handleMouseEnter($event)',
        '(mouseleave)': '_handelMouseLeave($event)',
        '(keydown)': '_handleKeydown($event)',
    },
    exportAs: 'ouiPanelTrigger',
    standalone: false
})
export class OuiPanelTrigger implements OnDestroy {
  private _portal: TemplatePortal;
  private _overlayRef: OverlayRef | null = null;
  private _panelOpen = false;
  private _closeSubscription = Subscription.EMPTY;
  private _hoverSubscription = Subscription.EMPTY;
  private _keyboardEventSubscription: Subscription = Subscription.EMPTY;
  private _escapeEventSubscription: Subscription = Subscription.EMPTY;
  private _panelCloseSubscription = Subscription.EMPTY;
  private _mouseLeave: Subject<MouseEvent> = new Subject<MouseEvent>();
  private _mouseEnter: Subject<MouseEvent> = new Subject<MouseEvent>();
  private _scrollStrategy: () => ScrollStrategy;

  /** The class that traps and manages focus within the panel. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the panel was opened. Save this to restore upon close. */
  private _currentFocusElement: HTMLElement = null;

  /** References the panel instance that the trigger is associated with. */
  @Input('ouiPanelTriggerFor')
  get panel() {
    return this._panel;
  }
  set panel(panel: OuiPanelOverlay) {
    if (panel === this._panel) {
      return;
    }
    this._panel = panel;
    this._panelCloseSubscription.unsubscribe();

    if (panel) {
      this._panelCloseSubscription = panel.closed
        .asObservable()
        .subscribe(() => {
          this._destroyPanel();
        });
      this._escapeEventSubscription = this.panel.escapeEvent.subscribe(() => {
        this.closePanel();
      });
    }
  }
  private _panel: OuiPanelOverlay;

  /** Event emitted when the associated panel is opened. */
  @Output()
  readonly panelOpened: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the associated panel is closed. */
  @Output()
  readonly panelClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private _overlay: Overlay,
    private _element: ElementRef<HTMLElement>,
    private _viewContainerRef: ViewContainerRef,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    @Inject(OUI_PANEL_SCROLL_STRATEGY) scrollStrategy: any
  ) {
    this._scrollStrategy = scrollStrategy;
  }

  /** Whether the panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }

  /** Toggles the panel between the open and closed states. */
  togglePanel(): void {
    return this._panelOpen ? this.closePanel() : this.openPanel();
  }

  /** Ensures the option is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if (keyCode === SPACE) {
      this.openPanel();
      this._trapFocus();
      event.preventDefault();
      // On tab it will focus on the element itself
      this._currentFocusElement = event.target as HTMLElement;
    }
  }

  /** Opens The Panel */
  openPanel(): void {
    if (this._panelOpen) {
      return;
    }
    const overlayRef = this._createOverlay();
    const overlayConfig = overlayRef.getConfig();

    this._setPosition(
      overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy
    );
    // overlayConfig.hasBackdrop = true;
    overlayRef.attach(this._getPortal());
    this._setLargeWidth();
    this._closeSubscription = this._panelClosingActions().subscribe(() => {
      this.closePanel('mouserHover');
    });
    this._setIsPanelOpen(true);
  }

  // set state rather than toggle to support triggers sharing a panel
  private _setIsPanelOpen(isOpen: boolean): void {
    this._panelOpen = isOpen;
    if (this._panelOpen) {
      this.panelOpened.emit();
    } else {
      this.panelClosed.emit();
    }
  }

  /**
   * This method creates the overlay from the provided panel's template and saves its
   * OverlayRef so that it can be attached to the DOM when openPanel is called.
   */
  private _createOverlay(): OverlayRef {
    if (document.querySelector('.oui-panel')) {
      document.querySelector('.oui-panel').remove();
    }
    if (!this._overlayRef) {
      const config = this._getOverlayConfig();
      this._subscribeToPositions(
        config.positionStrategy as FlexibleConnectedPositionStrategy
      );
      this._overlayRef = this._overlay.create(config);

      // Consume the `keydownEvents` in order to prevent them from going to another overlay.
      // Ideally we'd also have our keyboard event logic in here, however doing so will
      // break anybody that may have implemented the `OuiPanelOverlay` themselves.
      this._keyboardEventSubscription = this._overlayRef
        .keydownEvents()
        .pipe(filter((event) => event.key === 'Escape'))
        .subscribe(() => this.closePanel());
    }
    return this._overlayRef;
  }

  /**
   * This method builds the configuration object needed to create the overlay, the OverlayState.
   *
   * @returns OverlayConfig
   */
  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._element)
        .withLockedPosition()
        .withTransformOriginOn('.oui-panel-overlay'),
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this._scrollStrategy(),
      direction: 'ltr',
    });
  }

  /**
   * Listens to changes in the position of the overlay and sets the correct classes
   * on the menu based on the new position. This ensures the animation origin is always
   * correct, even if a fallback position is used for the overlay.
   */
  private _subscribeToPositions(
    position: FlexibleConnectedPositionStrategy
  ): void {
    if (this.panel.setPositionClasses) {
      position.positionChanges.subscribe((change) => {
        const posX: PanelPositionX =
          change.connectionPair.overlayX === 'start' ? 'after' : 'before';
        const posY: PanelPositionY =
          change.connectionPair.overlayY === 'top' ? 'below' : 'above';

        this.panel.setPositionClasses!(posX, posY);
      });
    }
  }

  /**
   * Sets the appropriate positions on a position strategy
   * so the overlay connects with the trigger correctly.
   *
   * @param positionStrategy Strategy whose position to update.
   */
  private _setPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
    const panelPositions = new PanelFlexiblePosition(
      this.panel.xPosition,
      this.panel.yPosition
    );
    positionStrategy.withPositions(panelPositions.getPosition());
  }
  /**  assign large width if overlay element contains img tag */
  private _setLargeWidth() {
    const imageTag = this._overlayRef.overlayElement.querySelector('img');
    if (imageTag) {
      const content: HTMLDivElement =
        this._overlayRef.overlayElement.querySelector('.oui-panel-content');
      content.classList.add('oui-panel-content-large');
    }
  }

  /** Cleans up the active subscriptions. */
  private _cleanUpSubscriptions(): void {
    this._closeSubscription.unsubscribe();
    this._hoverSubscription.unsubscribe();
    this._escapeEventSubscription.unsubscribe();
    this._keyboardEventSubscription.unsubscribe();
  }

  /** Closes the menu and does the necessary cleanup. */
  private _destroyPanel() {
    if (!this._overlayRef || !this.panelOpen) {
      return;
    }
    this._setIsPanelOpen(false);
    const panel = this.panel;

    this._closeSubscription.unsubscribe();
    this._overlayRef.detach();

    if (panel.lazyContent) {
      panel.lazyContent.detach();
    }
  }

  /** Closes The Panel */
  closePanel(hoverType?) {
    this.panel.closed.emit();
    if (!hoverType) {
      this._restoreFocus();
    }
  }

  /** Moves the focus inside the focus trap. */
  public _trapFocus() {
    const element: HTMLDivElement =
      this._overlayRef.overlayElement.querySelector('.oui-panel-content');

    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(element);
    }
    element.focus();
  }

  /** Restores focus to the element that was focused before the panel opened. */
  public _restoreFocus() {
    const toFocus = this._currentFocusElement;
    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      this._focusTrap = null;
    }
  }

  /** Gets the portal that should be attached to the overlay. */
  private _getPortal(): TemplatePortal {
    // Note that we can avoid this check by keeping the portal on the menu panel.
    // While it would be cleaner, we'd have to introduce another required method on
    // `OuiPanelOverlay`, making it harder to consume.
    if (!this._portal || this._portal.templateRef !== this.panel.templateRef) {
      this._portal = new TemplatePortal(
        this.panel.templateRef,
        this._viewContainerRef
      );
    }
    return this._portal;
  }

  public _handleMouseEnter(event: MouseEvent): void {
    // On hover it will focus on the element itself
    const focusElement = event.target as HTMLElement;
    this._currentFocusElement = focusElement.querySelector('oui-icon');
    this._mouseEnter.next(event);
    this.openPanel();
    event.stopImmediatePropagation();
  }

  public _handelMouseLeave(event: MouseEvent): void {
    this._mouseLeave.next(event);
    event.stopImmediatePropagation();
  }

  /** Returns a stream that emits whenever an action that should close the panel occurs. */
  private _panelClosingActions(): Observable<any> {
    const detachments = this._overlayRef!.detachments();
    const mouseLeave = merge(
      this._mouseLeave.asObservable(),
      this._mouseEnter.asObservable(),
      this.panel.mouseLeave,
      this.panel.mouseEnter
    ).pipe(
      debounceTime(200),
      filter((event) => event.type === 'mouseleave')
    );
    return merge(detachments, mouseLeave);
  }

  ngOnDestroy() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
    this._cleanUpSubscriptions();
  }
}
