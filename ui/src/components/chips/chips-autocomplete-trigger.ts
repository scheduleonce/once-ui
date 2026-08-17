import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { filter, take, switchMap, delay, tap, map } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  ViewContainerRef,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  _countChipsGroupLabelsBeforeOption,
  _getChipsOptionScrollPosition,
  ChipsOption,
  ChipsOptionSelectionChange,
} from './chips-option';

import {
  Subscription,
  defer,
  fromEvent,
  merge,
  of as observableOf,
  Subject,
  Observable,
} from 'rxjs';
import { ChipsAutocomplete } from './chips-autocomplete';
import { OuiFormField } from '../form-field/form-field';

/**
 * The following style constants are necessary to save here in order
 * to properly calculate the scrollTop of the panel. Because we are not
 * actually focusing the active item, scroll must be handled manually.
 */

/** The height of each autocomplete option. */
const CHIPS_AUTOCOMPLETE_OPTION_HEIGHT = 48;

/** The total height of the autocomplete panel. */
const CHIPS_AUTOCOMPLETE_PANEL_HEIGHT = 256;

/** Injection token that determines the scroll handling while the chips autocomplete panel is open. */
export const CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>('oui-chips-autocomplete-scroll-strategy');

/** @docs-private */
export function CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY,
};

/**
 * Provider that allows the chips autocomplete to register as a ControlValueAccessor.
 *
 * @docs-private
 */
export const CHIPS_AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ChipsAutocompleteTrigger),
  multi: true,
};

/**
 * Creates an error to be thrown when attempting to use a chips autocomplete trigger without a panel.
 *
 * @docs-private
 */
export function getChipsAutocompleteMissingPanelError(): Error {
  return Error(
    'Attempting to open an undefined instance of `oui-chips-autocomplete`. ' +
      'Make sure that the id passed to the `ouiChipAutocomplete` is correct and that ' +
      "you're attempting to open it after the ngAfterContentInit hook."
  );
}

@Directive({
  selector: `input[ouiChipAutocomplete]`,
  host: {
    '[attr.autocomplete]': 'autocompleteAttribute()',
    '[attr.role]': 'autocompleteDisabled() ? null : "combobox"',
    '[attr.aria-autocomplete]': 'autocompleteDisabled() ? null : "list"',
    '[attr.aria-activedescendant]': 'activeOption?.id',
    '[attr.aria-expanded]':
      'autocompleteDisabled() ? null : panelOpen.toString()',
    '[attr.aria-owns]':
      '(autocompleteDisabled() || !panelOpen) ? null : autocomplete?.id',
    '(focusin)': '_handleFocus()',
    '(blur)': '_onBlur()',
    '(input)': '_handleInput($event)',
    '(keydown)': '_handleKeydown($event)',
    // Chips-specific: Click handler ensures the panel reopens when the input
    // already has focus (e.g. after selecting an option which calls focus()).
    '(click)': '_handleClick()',
  },
  exportAs: 'ouiChipAutocompleteTrigger',
  providers: [CHIPS_AUTOCOMPLETE_VALUE_ACCESSOR],
  standalone: false,
})
export class ChipsAutocompleteTrigger
  implements ControlValueAccessor, OnDestroy
{
  private _element = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  private _zone = inject(NgZone);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  // Chips-specific: no `host: true` — allows finding the form-field when
  // the input is a child of the form-field (not the form-field itself).
  private _formField = inject(OuiFormField, { optional: true })!;
  private _document = inject<Document>(DOCUMENT, { optional: true })!;
  private _viewportRuler = inject(ViewportRuler);

  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;
  private _componentDestroyed = false;
  private _scrollStrategy: () => ScrollStrategy = inject(
    CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY
  );

  /** Old value of the native input. Used to work around issues with the `input` event on IE. */
  private _previousValue: string | number | null;

  /** Strategy that is used to position the panel. */
  private _positionStrategy: FlexibleConnectedPositionStrategy;

  /** The subscription for closing actions (some are bound to document). */
  private _closingActionsSubscription: Subscription;

  /** Subscription to viewport size changes. */
  private _viewportSubscription = Subscription.EMPTY;

  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  private _canOpenOnNextFocus = true;

  /** Stream of keyboard events that can close the panel. */
  private readonly _closeKeyEventStream = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private _overlayAttached: boolean = false;

  /** Stream of autocomplete option selections. */
  readonly optionSelections: Observable<ChipsOptionSelectionChange> = defer(
    (): Observable<ChipsOptionSelectionChange> => {
      if (this.autocomplete && this.autocomplete.options) {
        return merge(
          ...this.autocomplete.options.map((option) => option.onSelectionChange)
        );
      }

      // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
      // Return a stream that we'll replace with the real one once everything is in place.
      return this._zone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionSelections)
      );
    }
  );

  /** The autocomplete panel to be attached to this trigger. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ouiChipAutocomplete')
  autocomplete: ChipsAutocomplete;

  /**
   * `autocomplete` attribute to be set on the input element.
   *
   * @docs-private
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly autocompleteAttribute = input('off', { alias: 'autocomplete' });

  /**
   * Event handler for when the window is blurred. Needs to be an
   * arrow function in order to preserve the context.
   */
  private _windowBlurHandler = () => {
    this._canOpenOnNextFocus =
      document.activeElement !== this._element.nativeElement || this.panelOpen;
  };

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when autocomplete has been touched` */
  _onTouched = () => {};

  /**
   * When the user clicks an option inside the overlay, the input blurs first
   * (focus moves to the option element). We use this flag to prevent the blur
   * handler from closing the panel in that case — the option selection logic
   * in `panelClosingActions` will close it properly.
   */
  private _skipBlurClose = false;

  _onBlur(): void {
    this._onTouched();
    if (this._skipBlurClose) {
      this._skipBlurClose = false;
    } else {
      this.closePanel();
    }
  }

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  readonly autocompleteDisabled = input(false, {
    alias: 'ouiChipAutocompleteDisabled',
    transform: booleanAttribute,
  });

  constructor() {
    const _zone = this._zone;

    if (typeof window !== 'undefined') {
      _zone.runOutsideAngular(() => {
        window.addEventListener('blur', this._windowBlurHandler);
      });
    }

    // Register a capturing-phase keydown listener on the input element.
    // This fires BEFORE any Angular bubble-phase host bindings (including
    // OuiChipInput._keydown), so we can call event.preventDefault() to
    // prevent the chip input from emitting a chipEnd event when an
    // autocomplete option is being selected via Enter.
    this._element.nativeElement.addEventListener(
      'keydown',
      this._keydownCaptureHandler,
      true
    );
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this._windowBlurHandler);
    }

    this._element.nativeElement.removeEventListener(
      'keydown',
      this._keydownCaptureHandler,
      true
    );

    this._viewportSubscription.unsubscribe();
    this._componentDestroyed = true;
    this._destroyPanel();
    this._closeKeyEventStream.complete();
  }

  /**
   * Capturing-phase keydown handler. When an autocomplete option is active
   * and Enter is pressed, we call preventDefault() here so that downstream
   * bubble-phase handlers (specifically OuiChipInput._emitChipEnd) see
   * defaultPrevented = true and skip emitting the raw input value.
   */
  private _keydownCaptureHandler = (event: KeyboardEvent): void => {
    if (this.activeOption && event.key === 'Enter' && this.panelOpen) {
      event.preventDefault();
    }
  };

  /**
   * Mousedown handler on the overlay element. When the user clicks an option
   * inside the dropdown, the input blurs first (focus moves to the option).
   * This flag prevents _onBlur from closing the panel in that case.
   */
  private _overlayMousedownHandler = (): void => {
    this._skipBlurClose = true;
  };

  /** Whether or not the autocomplete panel is open. */
  get panelOpen(): boolean {
    return this._overlayAttached && this.autocomplete.showPanel;
  }

  /** Opens the autocomplete suggestion panel. */
  openPanel(): void {
    this._attachOverlay();
  }

  /** Closes the autocomplete suggestion panel. */
  closePanel(): void {
    if (!this._overlayAttached) {
      return;
    }

    if (this.panelOpen) {
      this.autocomplete.closed.emit();
    }

    this.autocomplete._isOpen = this._overlayAttached = false;

    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
      this._closingActionsSubscription.unsubscribe();
    }

    if (!this._componentDestroyed) {
      this._changeDetectorRef.detectChanges();
    }
  }

  /**
   * Updates the position of the autocomplete suggestion panel to ensure that it fits all options
   * within the viewport.
   */
  updatePosition(): void {
    if (this._overlayAttached) {
      this._overlayRef!.updatePosition();
    }
  }

  /**
   * A stream of actions that should close the autocomplete panel, including
   * when an option is selected, on blur, and when TAB is pressed.
   */
  get panelClosingActions(): Observable<ChipsOptionSelectionChange | null> {
    return merge(
      this.optionSelections,
      this.autocomplete._keyManager.tabOut.pipe(
        filter(() => this._overlayAttached)
      ),
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._overlayRef
        ? this._overlayRef
            .detachments()
            .pipe(filter(() => this._overlayAttached))
        : observableOf()
    ).pipe(
      // Normalize the output so we return a consistent type.
      map((event) =>
        event instanceof ChipsOptionSelectionChange ? event : null
      )
    );
  }

  /** The currently active option, coerced to ChipsOption type. */
  get activeOption(): ChipsOption | null {
    if (this.autocomplete && this.autocomplete._keyManager) {
      return this.autocomplete._keyManager.activeItem;
    }

    return null;
  }

  /** Stream of clicks outside of the autocomplete panel. */
  private _getOutsideClickStream(): Observable<any> {
    if (!this._document) {
      return observableOf(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend')
    ).pipe(
      filter((event) => {
        const clickTarget = event.target as HTMLElement;
        const formField = this._formField
          ? this._formField._elementRef.nativeElement
          : null;

        return (
          this._overlayAttached &&
          clickTarget !== this._element.nativeElement &&
          (!formField || !formField.contains(clickTarget)) &&
          !!this._overlayRef &&
          !this._overlayRef.overlayElement.contains(clickTarget)
        );
      })
    );
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any): void {
    Promise.resolve(null).then(() => this._setTriggerValue(value));
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => {}): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this._element.nativeElement.disabled = isDisabled;
  }

  _handleKeydown(event: KeyboardEvent): void {
    const key = event.key;

    if (key === 'Escape') {
      event.preventDefault();
    }

    if (this.activeOption && key === 'Enter' && this.panelOpen) {
      this.activeOption._selectViaInteraction();
      this._resetActiveItem();
      event.preventDefault();
    } else if (this.autocomplete) {
      const prevActiveItem = this.autocomplete._keyManager.activeItem;
      const isArrowKey = key === 'ArrowUp' || key === 'ArrowDown';

      if (this.panelOpen || key === 'Tab') {
        this.autocomplete._keyManager.onKeydown(event);
      } else if (isArrowKey && this._canOpen()) {
        this.openPanel();
        // Chips-specific: After opening the panel via arrow key, forward the
        // event to the key manager so the first option gets activated immediately.
        this.autocomplete._keyManager.onKeydown(event);
      }

      if (
        isArrowKey ||
        this.autocomplete._keyManager.activeItem !== prevActiveItem
      ) {
        this._scrollToOption();
      }
    }
  }

  _handleInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    let value: number | string | null = target.value;

    if (target.type === 'number') {
      value = value === '' ? null : parseFloat(value);
    }

    if (this._previousValue !== value) {
      this._previousValue = value;
      this._onChange(value);

      if (
        this._canOpen() &&
        document.activeElement === event.target &&
        typeof value === 'string' &&
        value.trim().length > 0
      ) {
        this.openPanel();
      }
    }
  }

  // Chips-specific: Click handler ensures the panel reopens when the input
  // already has focus (e.g. after selecting an option which calls focus()).
  _handleClick(): void {
    if (this._canOpen() && !this.panelOpen) {
      this._previousValue = this._element.nativeElement.value;
      this._attachOverlay();
    }
  }

  _handleFocus(): void {
    if (!this._canOpenOnNextFocus) {
      this._canOpenOnNextFocus = true;
    } else if (this._canOpen()) {
      this._previousValue = this._element.nativeElement.value;
      this._attachOverlay();
    }
  }

  /**
   * Given that we are not actually focusing active options, we must manually adjust scroll
   * to reveal options below the fold. First, we find the offset of the option from the top
   * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
   * the panel height + the option height, so the active option will be just visible at the
   * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
   * will become the offset. If that offset is visible within the panel already, the scrollTop is
   * not adjusted.
   */
  private _scrollToOption(): void {
    const index = this.autocomplete._keyManager.activeItemIndex || 0;
    const labelCount = _countChipsGroupLabelsBeforeOption(
      index,
      this.autocomplete.options,
      this.autocomplete.optionGroups
    );

    const newScrollPosition = _getChipsOptionScrollPosition(
      index + labelCount,
      CHIPS_AUTOCOMPLETE_OPTION_HEIGHT,
      this.autocomplete._getScrollTop(),
      CHIPS_AUTOCOMPLETE_PANEL_HEIGHT
    );

    this.autocomplete._setScrollTop(newScrollPosition);
  }

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  private _subscribeToClosingActions(): Subscription {
    // Chips-specific: In zoneless Angular, onStable never fires. Use a
    // microtask delay instead to defer subscribing to closing actions until
    // the panel is rendered.
    const firstStable = observableOf(null).pipe(delay(0));
    const optionChanges = this.autocomplete.options.changes.pipe(
      tap(() => this._positionStrategy.reapplyLastPosition()),
      delay(0)
    );

    return merge(firstStable, optionChanges)
      .pipe(
        switchMap(() => {
          this._resetActiveItem();
          this.autocomplete._setVisibility();

          if (this.panelOpen) {
            this._overlayRef!.updatePosition();
          }

          return this.panelClosingActions;
        }),
        take(1)
      )
      .subscribe((event) => this._setValueAndClose(event));
  }

  /** Destroys the autocomplete suggestion panel. */
  private _destroyPanel(): void {
    if (this._overlayRef) {
      this._overlayRef.overlayElement.removeEventListener(
        'mousedown',
        this._overlayMousedownHandler
      );
      this.closePanel();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _setTriggerValue(value: any): void {
    const displayWith = this.autocomplete && this.autocomplete.displayWith();
    const toDisplay = displayWith ? displayWith(value) : value;

    const inputValue = toDisplay != null ? toDisplay : '';

    if (this._formField) {
      this._formField._control.value = inputValue;
    } else {
      this._element.nativeElement.value = inputValue;
    }

    this._previousValue = inputValue;
  }

  /**
   * This method closes the panel, and if a value is specified, also sets the associated
   * control to that value. It will also mark the control as dirty if this interaction
   * stemmed from the user.
   */
  private _setValueAndClose(event: ChipsOptionSelectionChange | null): void {
    if (event && event.source) {
      this._clearPreviousSelectedOption(event.source);
      this._onChange(event.source.value);
      this._element.nativeElement.focus();
      this.autocomplete._emitSelectEvent(event.source);
    }

    // Chips-specific: Always clear the input after selection. The selected
    // value becomes a chip via the (optionSelected) handler, so the input
    // should be empty ready for the next entry.
    this._element.nativeElement.value = '';
    this._previousValue = '';

    this.closePanel();
  }

  /**
   * Clear any previous selected option and emit a selection change event for this option
   */
  private _clearPreviousSelectedOption(skip: ChipsOption) {
    this.autocomplete.options.forEach((option) => {
      if (option !== skip && option.selected) {
        option.deselect();
      }
    });
  }

  private _attachOverlay(): void {
    if (!this.autocomplete) {
      throw getChipsAutocompleteMissingPanelError();
    }

    if (!this._overlayRef) {
      this._portal = new TemplatePortal(
        this.autocomplete.template,
        this._viewContainerRef
      );
      this._overlayRef = this._overlay.create(this._getOverlayConfig());

      // Chips-specific: When the user mousedowns inside the overlay (e.g. to
      // click an option), the input will blur. We set a flag so that _onBlur
      // does not close the panel — the option selection logic will handle it.
      this._overlayRef.overlayElement.addEventListener(
        'mousedown',
        this._overlayMousedownHandler
      );

      this._overlayRef.keydownEvents().subscribe((event) => {
        if (
          event.key === 'Escape' ||
          (event.key === 'ArrowUp' && event.altKey)
        ) {
          this._resetActiveItem();
          this._closeKeyEventStream.next();
        }
      });

      if (this._viewportRuler) {
        this._viewportSubscription = this._viewportRuler
          .change()
          .subscribe(() => {
            if (this.panelOpen && this._overlayRef) {
              this._overlayRef.updateSize({ width: this._getPanelWidth() });
            }
          });
      }
    } else {
      this._overlayRef.updateSize({ width: this._getPanelWidth() });
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
      this._closingActionsSubscription = this._subscribeToClosingActions();
    }

    const wasOpen = this.panelOpen;

    this.autocomplete._setVisibility();
    this.autocomplete._isOpen = this._overlayAttached = true;

    if (this.panelOpen && wasOpen !== this.panelOpen) {
      this.autocomplete.opened.emit();
    }
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPosition(),
      scrollStrategy: this._scrollStrategy(),
      width: this._getPanelWidth(),
    });
  }

  private _getOverlayPosition(): PositionStrategy {
    this._positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._getConnectedElement())
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          panelClass: 'oui-autocomplete-panel-above',
        },
      ]);

    return this._positionStrategy;
  }

  /**
   * Chips-specific: When inside a form-field (e.g. chips autocomplete), position
   * relative to the form-field's connection container so the dropdown covers the
   * entire form-field area including chips, preventing chips from being hidden
   * behind the dropdown.
   */
  private _getConnectedElement(): ElementRef {
    // When inside a form-field (e.g. chips autocomplete), position relative to the
    // form-field's connection container so the dropdown covers the entire form-field
    // area including chips, preventing chips from being hidden behind the dropdown.
    if (this._formField) {
      return this._formField.getConnectedOverlayOrigin();
    }

    return this._element;
  }

  private _getPanelWidth(): number | string {
    return this.autocomplete.panelWidth() || this._getHostWidth();
  }

  /** Returns the width of the input element, so the panel width can match it. */
  private _getHostWidth(): number {
    return this._getConnectedElement().nativeElement.getBoundingClientRect()
      .width;
  }

  /**
   * Resets the active item to -1 so arrow events will activate the
   * correct options, or to 0 if the consumer opted into it.
   */
  private _resetActiveItem(): void {
    this.autocomplete._keyManager.setActiveItem(
      this.autocomplete.autoActiveFirstOption() ? 0 : -1
    );
  }

  /** Determines whether the panel can be opened. */
  private _canOpen(): boolean {
    const element = this._element.nativeElement;
    return (
      !element.readOnly && !element.disabled && !this.autocompleteDisabled()
    );
  }
}
