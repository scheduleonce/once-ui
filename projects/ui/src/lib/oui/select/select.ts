import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import {
  A,
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
  hasModifierKey
} from '@angular/cdk/keycodes';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  isDevMode,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  Inject
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm
} from '@angular/forms';
import {
  CanDisable,
  CanDisableCtor,
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  ErrorStateMatcher,
  HasTabIndex,
  HasTabIndexCtor,
  OUI_OPTION_PARENT_COMPONENT,
  OuiOptgroup,
  OuiOption,
  OuiOptionSelectionChange,
  mixinDisabled,
  mixinErrorState,
  mixinTabIndex,
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition
} from '../core';
import { defer, merge, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';

import {
  getOuiSelectDynamicMultipleError,
  getOuiSelectNonArrayValueError,
  getOuiSelectNonFunctionValueError
} from './select-errors';
import { OuiFormFieldControl } from '../form-field/public-api';

let nextUniqueId = 0;

/** The total height of the select panel. */
export const SELECT_PANEL_HEIGHT = 200;

/** The height of each select option. */
export const SELECT_OPTION_HEIGHT = 40;

/** Change event object that is emitted when the select value has changed. */
export class OuiSelectChange {
  constructor(
    /** Reference to the select that emitted the change event. */
    public source: OuiSelect,
    /** Current value of the select that emitted the event. */
    public value: any
  ) {}
}

// Boilerplate for applying mixins to OuiSelect.
/** @docs-private */
export class OuiSelectBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}
export const _OuiSelectMixinBase: CanDisableCtor &
  HasTabIndexCtor &
  CanUpdateErrorStateCtor &
  typeof OuiSelectBase = mixinTabIndex(
  mixinDisabled(mixinErrorState(OuiSelectBase))
);

/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
@Directive({
  selector: 'oui-select-trigger'
})
export class OuiSelectTrigger {}

@Component({
  selector: 'oui-select',
  exportAs: 'OuiSelect',
  templateUrl: 'select.html',
  styleUrls: ['select.scss'],
  inputs: ['disabled', 'disableRipple', 'tabIndex'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listbox',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-label]': '_getAriaLabel()',
    '[attr.aria-labelledby]': '_getAriaLabelledby()',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-owns]': 'panelOpen ? _optionIds : null',
    '[attr.aria-multiselectable]': 'multiple',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
    '[class.oui-select-disabled]': 'disabled',
    '[class.oui-select-invalid]': 'errorState',
    '[class.oui-select-required]': 'required',
    '[class.oui-select-empty]': 'empty',
    class: 'oui-select oui-input',
    '(keydown)': '_handleKeydown($event)',
    '(focus)': '_onFocus()',
    '(blur)': '_onBlur()'
  },
  providers: [
    { provide: OuiFormFieldControl, useExisting: OuiSelect },
    { provide: OUI_OPTION_PARENT_COMPONENT, useExisting: OuiSelect }
  ]
})
export class OuiSelect extends _OuiSelectMixinBase
  implements
    AfterContentInit,
    OnChanges,
    OnDestroy,
    OnInit,
    DoCheck,
    ControlValueAccessor,
    CanDisable,
    HasTabIndex,
    OuiFormFieldControl<any>,
    CanUpdateErrorState {
  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** Adding top class to overlay panel */
  cdkConnectionOverlayPanel = '';

  /** Whether filling out the select is required in the form. */
  private _required: boolean = false;

  /** The placeholder displayed in the trigger of the select. */
  private _placeholder: string;

  /** Whether the component is in multiple selection mode. */
  private _multiple: boolean = false;

  /** Comparison function to specify which option is displayed. Defaults to object equality. */
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  /** Unique id for this input. */
  private _uid = `oui-select-${nextUniqueId++}`;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** The last measured value for the trigger's client bounding rect. */
  _triggerRect: ClientRect;

  /** The aria-describedby attribute on the select for improved a11y. */
  _ariaDescribedby: string;

  /** Deals with the selection logic. */
  _selectionModel: SelectionModel<OuiOption>;

  /** Manages keyboard events for options in the panel. */
  _keyManager: ActiveDescendantKeyManager<OuiOption>;

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when select has been touched` */
  _onTouched = () => {};

  /** The IDs of child options to be passed to the aria-owns attribute. */
  _optionIds: string = '';

  /** Emits when the panel element is finished transforming in. */
  _panelDoneAnimatingStream = new Subject<string>();

  /** If there is search input field a class is added dynamically to the perfect scrollbar **/
  ouiSelectInputOuterClassName: string;

  /** Whether the select is focused. */
  get focused(): boolean {
    return this._focused || this._panelOpen;
  }
  /**
   * @deprecated Setter to be removed as this property is intended to be readonly.
   * @breaking-change 8.0.0
   */
  set focused(value: boolean) {
    this._focused = value;
  }
  private _focused = false;

  /** A name for this control that can be used by `oui-form-field`. */
  controlType = 'oui-select';

  /** Trigger that opens the select. */
  @ViewChild('trigger') trigger: ElementRef;

  /** Panel containing the select options. */
  @ViewChild('panel') panel: ElementRef;

  /** Adds class to overlay panel **/
  @ViewChild('overlayPanel') overlayPanel: ElementRef;

  /** Overlay pane containing the options. */
  @ViewChild(CdkConnectedOverlay) overlayDir: CdkConnectedOverlay;

  /** All of the defined select options. */
  @ContentChildren(OuiOption, { descendants: true }) options: QueryList<
    OuiOption
  >;
  initialValue = '';

  /** All of the defined groups of options. */
  @ContentChildren(OuiOptgroup) optionGroups: QueryList<OuiOptgroup>;

  /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[] | Set<string> | { [key: string]: any };

  /** User-supplied override of the trigger element. */
  @ContentChild(OuiSelectTrigger) customTrigger: OuiSelectTrigger;

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.initialValue = value;
    this.stateChanges.next();
  }

  /** Whether the component is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /** Whether the user should be allowed to select multiple options. */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    if (this._selectionModel) {
      throw getOuiSelectDynamicMultipleError();
    }

    this._multiple = coerceBooleanProperty(value);
  }

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input()
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw getOuiSelectNonFunctionValueError();
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }

  /** Value of the select control. */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (newValue !== this._value) {
      this.writeValue(newValue);
      this._value = newValue;
    }
  }
  private _value: any;

  /** Aria label of the select. If not specified, the placeholder will be used as label. */
  @Input('aria-label') ariaLabel: string = '';

  /** Input that can be used to specify the `aria-labelledby` attribute. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** Object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /**
   * Function used to sort the values in a select in multiple mode.
   * Follows the same logic as `Array.prototype.sort`.
   */
  @Input() sortComparator: (
    a: OuiOption,
    b: OuiOption,
    options: OuiOption[]
  ) => number;

  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  /** Combined stream of all of the child options' change events. */
  readonly optionSelectionChanges: Observable<OuiOptionSelectionChange> = defer(
    () => {
      if (this.options) {
        return merge(...this.options.map(option => option.onSelectionChange));
      }

      return this._ngZone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionSelectionChanges)
      );
    }
  );

  /** Event emitted when the select panel has been toggled. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  /** Event emitted when the select has been opened. */
  @Output('opened') readonly _openedStream: Observable<
    void
  > = this.openedChange.pipe(
    filter(o => o),
    map(() => {})
  );

  /** Event emitted when the select has been closed. */
  @Output('closed') readonly _closedStream: Observable<
    void
  > = this.openedChange.pipe(
    filter(o => !o),
    map(() => {})
  );

  /** Event emitted when the selected value has been changed by the user. */
  @Output() readonly selectionChange: EventEmitter<
    OuiSelectChange
  > = new EventEmitter<OuiSelectChange>();

  @Output() readonly change: EventEmitter<OuiSelectChange> = new EventEmitter<
    OuiSelectChange
  >();
  /**
   * Event that emits whenever the raw value of the select changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    elementRef: ElementRef,
    @Optional() private _dir: Directionality,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Self() @Optional() public ngControl: NgControl,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    super(
      elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl
    );

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.tabIndex = parseInt(tabIndex) || 0;

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  ngOnInit() {
    this._selectionModel = new SelectionModel<OuiOption>(this.multiple);
    this.stateChanges.next();

    // We need `distinctUntilChanged` here, because some browsers will
    // fire the animation end event twice for the same animation. See:
    // https://github.com/angular/angular/issues/24084
    this._panelDoneAnimatingStream
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy)
      )
      .subscribe(() => {
        if (this.panelOpen) {
          this.openedChange.emit(true);
        } else {
          this.openedChange.emit(false);
          this.overlayDir.offsetX = 0;
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  ngAfterContentInit() {
    this._initKeyManager();
    this._selectionModel.onChange
      .pipe(takeUntil(this._destroy))
      .subscribe(event => {
        event.added.forEach(option => option.select());
        event.removed.forEach(option => option.deselect());
      });
    this.options.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy)
      )
      .subscribe(() => {
        this._resetOptions();
        this._initializeSelection();
      });
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Updating the disabled state is handled by `mixinDisabled`, but we need to additionally let
    // the parent form field know to run change detection when the disabled state changes.
    if (changes.disabled) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
  }

  /** Toggles the overlay panel open or closed. */
  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  /** Opens the overlay panel. */
  open(): void {
    if (
      this.disabled ||
      !this.options ||
      !this.options.length ||
      this._panelOpen
    ) {
      return;
    }

    this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();

    this._panelOpen = true;
    this._keyManager.withHorizontalOrientation(null);

    this._highlightCorrectOption();
    this._changeDetectorRef.markForCheck();
    this.openedChange.emit(true);
    this._elementRef.nativeElement.classList.add(
      'oui-select-list-options-opened'
    );
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._keyManager.withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr');
      this._changeDetectorRef.markForCheck();
      this._onTouched();
      this.openedChange.emit(false);
      this._elementRef.nativeElement.classList.remove(
        'oui-select-list-options-opened'
      );
      setTimeout(_ => this._document.activeElement.blur());
    }
  }

  /**
   * Sets the select's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: any): void {
    if (this.options) {
      this._setSelectionByValue(value);
    }
  }

  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /**
   * Disables the select. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }

  /** The currently selected option. */
  get selected(): OuiOption | OuiOption[] {
    return this.multiple
      ? this._selectionModel.selected
      : this._selectionModel.selected[0];
  }

  /** The value displayed in the trigger. */
  get triggerValue(): string {
    if (this.empty) {
      return '';
    }
    if (this._multiple) {
      const selectedOptions = this._selectionModel.selected.map(
        option => option.viewValueForSelect
      );

      if (this._isRtl()) {
        selectedOptions.reverse();
      }

      return selectedOptions.join(', ');
    }
    return this._selectionModel.selected[0].viewValueForSelect;
  }

  /** Whether the element is in RTL mode. */
  _isRtl(): boolean {
    return this._dir ? this._dir.value === 'rtl' : false;
  }

  /** Handles all keydown events on the select. */
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.panelOpen
        ? this._handleOpenKeydown(event)
        : this._handleClosedKeydown(event);
    }
  }

  /** Handles keyboard events while the select is closed. */
  private _handleClosedKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey =
      keyCode === DOWN_ARROW ||
      keyCode === UP_ARROW ||
      keyCode === LEFT_ARROW ||
      keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this._keyManager;

    // Open the select on ALT + arrow key to match the native <select>
    if (
      (isOpenKey && !hasModifierKey(event)) ||
      ((this.multiple || event.altKey) && isArrowKey)
    ) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.open();
    } else if (!this.multiple) {
      if (keyCode === HOME || keyCode === END) {
        keyCode === HOME
          ? manager.setFirstItemActive()
          : manager.setLastItemActive();
        event.preventDefault();
      } else {
        manager.onKeydown(event);
      }
    }
  }

  /** Handles keyboard events when the selected is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const manager = this._keyManager;

    // Check if search input field is present in select box
    const searchField = <HTMLInputElement>event.target;
    if (
      searchField &&
      (searchField.tagName.toLowerCase() === 'input' && keyCode === SPACE)
    ) {
      return;
    }

    if (keyCode === HOME || keyCode === END) {
      event.preventDefault();
      keyCode === HOME
        ? manager.setFirstItemActive()
        : manager.setLastItemActive();
    } else if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
    } else if (
      (keyCode === ENTER || keyCode === SPACE) &&
      manager.activeItem &&
      !hasModifierKey(event)
    ) {
      event.preventDefault();
      manager.activeItem._selectViaInteraction();
    } else if (this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      const hasDeselectedOptions = this.options.some(
        opt => !opt.disabled && !opt.selected
      );

      this.options.forEach(option => {
        if (!option.disabled) {
          hasDeselectedOptions ? option.select() : option.deselect();
        }
      });
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;

      manager.onKeydown(event);

      if (
        this._multiple &&
        isArrowKey &&
        event.shiftKey &&
        manager.activeItem &&
        manager.activeItemIndex !== previouslyFocusedIndex
      ) {
        manager.activeItem._selectViaInteraction();
      }
      if (isArrowKey && manager.activeItemIndex !== previouslyFocusedIndex) {
        this._scrollToOption();
      } else {
        // First or last
        if (keyCode === DOWN_ARROW) {
          manager.setFirstItemActive();
          this._setScrollTop(0);
        }
        if (keyCode === UP_ARROW) {
          manager.setLastItemActive();
          this._scrollToOption();
        }
      }
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
    const manager = this._keyManager;
    const index = manager.activeItemIndex || 0;
    const labelCount = _countGroupLabelsBeforeOption(
      index,
      this.options,
      this.optionGroups
    );
    const scrollTop = this._getScrollTop();
    const newScrollPosition = _getOptionScrollPosition(
      index + labelCount,
      SELECT_OPTION_HEIGHT,
      scrollTop,
      SELECT_PANEL_HEIGHT
    );
    this._setScrollTop(newScrollPosition);
  }

  /**
   * Sets the panel scrollTop. This allows us to manually scroll to display options
   * above or below the fold, as they are not actually being focused when active.
   */
  _setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }

  /** Returns the panel's scrollTop. */
  _getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
   * "blur" to the panel when it opens, causing a false positive.
   */
  _onBlur() {
    this._focused = false;

    if (!this.disabled && !this.panelOpen) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /** Whether the select has a value. */
  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      this._setSelectionByValue(
        this.ngControl ? this.ngControl.value : this._value
      );
    });
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: any | any[]): void {
    if (this.multiple && value) {
      if (!Array.isArray(value)) {
        throw getOuiSelectNonArrayValueError();
      }

      this._selectionModel.clear();
      value.forEach((currentValue: any) => this._selectValue(currentValue));
      this._sortValues();
    } else {
      this._selectionModel.clear();
      const correspondingOption = this._selectValue(value);

      // Shift focus to the active item. Note that we shouldn't do this in multiple
      // mode, because we don't know what option the user interacted with last.
      if (correspondingOption) {
        this._keyManager.setActiveItem(correspondingOption);
      }
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private _selectValue(value: any): OuiOption | undefined {
    const correspondingOption = this.options.find((option: OuiOption) => {
      try {
        // Treat null as a special reset value.
        return option.value != null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          // Notify developers of errors in their comparator.
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager<OuiOption>(this.options)
      .withTypeAhead()
      .withVerticalOrientation()
      .withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr')
      .withAllowedModifierKeys(['shiftKey']);

    this._keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => {
      // Restore focus to the trigger before closing. Ensures that the focus
      // position won't be lost if the user got focus into the overlay.
      this.focus();
      this.close();
    });

    this._keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (!this._panelOpen && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }

  /** Drops current option subscriptions and IDs and resets from scratch. */
  private _resetOptions(): void {
    const changedOrDestroyed = merge(this.options.changes, this._destroy);
    this.optionSelectionChanges
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(event => {
        this._onSelect(event.source, event.isUserInput);
        if (event.isUserInput && !this.multiple && this._panelOpen) {
          this.close();
          this.focus();
        }
      });

    // Listen to changes in the internal state of the options and react accordingly.
    // Handles cases like the labels of the selected options changing.
    merge(...this.options.map(option => option._stateChanges))
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
        this.stateChanges.next();
      });

    this._setOptionIds();
  }

  /** Invoked when an option is clicked. */
  private _onSelect(option: OuiOption, isUserInput: boolean): void {
    const wasSelected = this._selectionModel.isSelected(option);

    if (option.value == null && !this._multiple) {
      option.deselect();
      this._selectionModel.clear();
      this._propagateChanges(option.value);
    } else {
      option.selected
        ? this._selectionModel.select(option)
        : this._selectionModel.deselect(option);

      if (isUserInput) {
        this._keyManager.setActiveItem(option);
      }

      if (this.multiple) {
        this._sortValues();

        if (isUserInput) {
          // In case the user selected the option with their mouse, we
          // want to restore focus back to the trigger, in order to
          // prevent the select keyboard controls from clashing with
          // the ones from `oui-option`.
          this.focus();
        }
      }
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this.stateChanges.next();
  }

  ngAfterViewInit() {
    this.options.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy)
      )
      .subscribe(_ => {
        this._resetOptions();
        this._initializeSelection();
      });
  }

  /** Sorts the selected values in the selected based on their order in the panel. */
  private _sortValues() {
    if (this.multiple) {
      const options = this.options.toArray();

      this._selectionModel.sort((a, b) => {
        return this.sortComparator
          ? this.sortComparator(a, b, options)
          : options.indexOf(a) - options.indexOf(b);
      });
      this.stateChanges.next();
    }
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: any): void {
    let valueToEmit: any = null;
    if (this.multiple) {
      valueToEmit = (this.selected as OuiOption[]).map(option => option.value);
    } else {
      valueToEmit = this.selected
        ? (this.selected as OuiOption).value
        : fallbackValue;
    }
    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this.selectionChange.emit(new OuiSelectChange(this, valueToEmit));
    this.change.emit(new OuiSelectChange(this, valueToEmit));
    this._changeDetectorRef.markForCheck();
    this.initialValue = this.triggerValue;
  }

  /** Records option IDs to pass to the aria-owns property. */
  private _setOptionIds() {
    this._optionIds = this.options.map(option => option.id).join(' ');
  }

  /**
   * Highlights the selected item. If no option is selected, it will highlight
   * the first item instead.
   */
  private _highlightCorrectOption(): void {
    if (this._keyManager) {
      if (this.empty) {
        this._keyManager.setFirstItemActive();
      } else {
        this._keyManager.setActiveItem(this._selectionModel.selected[0]);
      }
    }
  }

  /** Focuses the select element. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** Returns the aria-label of the select component. */
  _getAriaLabel(): string | null {
    // If an ariaLabelledby value has been set by the consumer, the select should not overwrite the
    // `aria-labelledby` value by setting the ariaLabel to the placeholder.
    return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
  }

  /** Returns the aria-labelledby of the select component. */
  _getAriaLabelledby(): string | null {
    if (this.ariaLabelledby) {
      return this.ariaLabelledby;
    }
  }

  /** Determines the `aria-activedescendant` to be set on the host. */
  _getAriaActiveDescendant(): string | null {
    if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
      return this._keyManager.activeItem.id;
    }

    return null;
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  onContainerClick() {
    this.focus();
    this.open();
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat(): boolean {
    return this._panelOpen || !this.empty;
  }

  /**
   * Add outer class to perfect scrollbar
   * This is added only when there is a search field
   */
  ouiSelectInputOuter() {
    this.ouiSelectInputOuterClassName = 'oui-select-input-outer';
  }

  /**
   * Custom overlay class for cdk overlay container
   */
  openCdk() {
    this.overlayDir.positionChange.pipe(take(1)).subscribe(e => {
      this.cdkConnectionOverlayPanel = '';
      if (e.connectionPair.originY === 'top') {
        this.cdkConnectionOverlayPanel = 'select-overlay-top';
      }
      this._changeDetectorRef.detectChanges();
      setTimeout(_ => this._scrollToOption());
    });

    const cdkOverLayContainer = this._document.querySelector(
      '.cdk-overlay-container'
    );
    const ouiSelectPanel = this._document.querySelector('.oui-select-panel');
    cdkOverLayContainer.classList.add('oui-select-overlay-container');
    const containerWidth = this._elementRef.nativeElement.offsetWidth;
    ouiSelectPanel.style.width = `${containerWidth}px`;
  }
}
