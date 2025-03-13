import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  AfterViewInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { OuiFormField } from '../form-field/form-field';
import { OUI_INPUT_VALUE_ACCESSOR } from '../input/input-value-accessor';
import { Subscription, fromEvent } from 'rxjs';
import { OuiDatepicker } from './datepicker';
import { createMissingDateImplError } from './datepicker-errors';
import { ThemePalette } from '../core/public-api';
import { DateAdapter } from './date-adapter';
import { OuiDateFormats, OUI_DATE_FORMATS } from './date-formats';

export const OUI_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OuiDatepickerInput),
  multi: true,
};

export const OUI_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => OuiDatepickerInput),
  multi: true,
};

/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use OuiDatepickerInputEvent instead.
 */
export class OuiDatepickerInputEvent<D> {
  /** The new value for the target datepicker input. */
  value: D | null;

  constructor(
    /** Reference to the datepicker input component that emitted the event. */
    public target: OuiDatepickerInput<D>,
    /** Reference to the native input element associated with the datepicker input. */
    public targetElement: HTMLElement
  ) {
    this.value = this.target.value;
  }
}
const DATEPICKER_FOCUS_CLASS = 'oui-datepicker-focused';

/** Directive used to connect an input to a OuiDatepicker. */
@Directive({
    selector: 'input[ouiDatepicker]',
    providers: [
        OUI_DATEPICKER_VALUE_ACCESSOR,
        OUI_DATEPICKER_VALIDATORS,
        { provide: OUI_INPUT_VALUE_ACCESSOR, useExisting: OuiDatepickerInput },
    ],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'oui-datepicker-input',
        '[attr.aria-haspopup]': 'true',
        '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
        '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
        '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
        '[disabled]': 'disabled',
        '(input)': '_onInput($event.target.value)',
        '(change)': '_onChange()',
        '(blur)': '_onBlur()',
        '(keydown)': '_onKeydown($event)',
        '[class.oui-datepicker-disabled]': '_datepickerDisabled',
    },
    exportAs: 'ouiDatepickerInput',
    standalone: false
})
export class OuiDatepickerInput<D>
  implements ControlValueAccessor, OnDestroy, AfterViewInit, Validator
{
  private _disabled: boolean;
  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly dateChange: EventEmitter<OuiDatepickerInputEvent<D>> =
    new EventEmitter<OuiDatepickerInputEvent<D>>();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly dateInput: EventEmitter<OuiDatepickerInputEvent<D>> =
    new EventEmitter<OuiDatepickerInputEvent<D>>();

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D | null>();

  /** Emits when the disabled state has changed */
  _disabledChange = new EventEmitter<boolean>();

  private _datepickerSubscription = Subscription.EMPTY;

  private _localeSubscription = Subscription.EMPTY;

  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;

  private _parentNodeClickSubscription: Subscription = Subscription.EMPTY;

  _datepickerDisabled = false;
  /** The datepicker that this input is associated with. */
  @Input()
  set ouiDatepicker(value: OuiDatepicker<D>) {
    if (!value) {
      return;
    }

    this._datepicker = value;
    this._datepicker._registerInput(this);
    this._datepickerSubscription.unsubscribe();

    this._datepickerSubscription = this._datepicker._selectedChanged.subscribe(
      (selected: D) => {
        this.value = selected;
        this._cvaOnChange(selected);
        this._onTouched();
        this.dateInput.emit(
          new OuiDatepickerInputEvent(this, this._elementRef.nativeElement)
        );
        this.dateChange.emit(
          new OuiDatepickerInputEvent(this, this._elementRef.nativeElement)
        );
      }
    );
  }
  _datepicker: OuiDatepicker<D>;

  /** Function that can be used to filter out dates within the datepicker. */
  @Input()
  set ouiDatepickerFilter(value: (date: D | null) => boolean) {
    this._dateFilter = value;
    this._validatorOnChange();
  }
  _dateFilter: (date: D | null) => boolean;

  /** The value of the input. */
  @Input()
  get value(): D | null {
    return this._value;
  }
  set value(value: D | null) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._getValidDateOrNull(value);
    const oldDate = this.value;
    this._value = value;
    this._formatValue(value);

    if (!this._dateAdapter.sameDate(oldDate, value)) {
      this._valueChange.emit(value);
    }
  }
  private _value: D | null;

  /** The minimum valid date. */
  @Input()
  get min(): D | null {
    return this._min;
  }
  set min(value: D | null) {
    this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _min: D | null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null {
    return this._max;
  }
  set max(value: D | null) {
    this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _max: D | null;

  focus() {
    this._elementRef.nativeElement.classList.add(DATEPICKER_FOCUS_CLASS);
  }
  blur() {
    this._elementRef.nativeElement.classList.remove(DATEPICKER_FOCUS_CLASS);
  }

  /** Whether the datepicker-input is disabled. */
  @Input()
  get disabled(): boolean {
    return !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const element = this._elementRef.nativeElement;

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }

    // We need to null check the `blur` method, because it's undefined during SSR.
    if (newValue && element.blur) {
      // Normally, native input elements automatically blur if they turn disabled. This behavior
      // is problematic, because it would mean that it triggers another change detection cycle,
      // which then causes a changed after checked error if the input element was focused before.
      element.blur();
    }
  }

  _onTouched = () => {};

  private _cvaOnChange: (value: any) => void = () => {};

  private _validatorOnChange = () => {};

  /** The form control validator for whether the input parses. */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null =>
    this._lastValueValid
      ? null
      : { ouiDatepickerParse: { text: this._elementRef.nativeElement.value } };

  /** The form control validator for the min date. */
  private _minValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(
      this._dateAdapter.deserialize(control.value)
    );
    return !this.min ||
      !controlValue ||
      this._dateAdapter.compareDate(this.min, controlValue) <= 0
      ? null
      : { ouiDatepickerMin: { min: this.min, actual: controlValue } };
  };

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(
      this._dateAdapter.deserialize(control.value)
    );
    return !this.max ||
      !controlValue ||
      this._dateAdapter.compareDate(this.max, controlValue) >= 0
      ? null
      : { ouiDatepickerMax: { max: this.max, actual: controlValue } };
  };

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(
      this._dateAdapter.deserialize(control.value)
    );
    return !this._dateFilter || !controlValue || this._dateFilter(controlValue)
      ? null
      : { ouiDatepickerFilter: true };
  };

  /** The combined form control validator for this input. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _validator: ValidatorFn | null = Validators.compose([
    this._parseValidator,
    this._minValidator,
    this._maxValidator,
    this._filterValidator,
  ]);

  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    @Optional() public _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(OUI_DATE_FORMATS) private _dateFormats: OuiDateFormats,
    @Optional() private _formField: OuiFormField
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('OUI_DATE_FORMATS');
    }

    // Update the displayed date when the locale changes.
    this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
      this.value = this.value;
    });
  }

  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._parentNodeClickSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
  }

  ngAfterViewInit() {
    this._elementRef.nativeElement.setAttribute('disabled', 'true');
    this._parentNodeClickSubscription = fromEvent(
      this._elementRef.nativeElement.parentNode,
      'click'
    ).subscribe(() => {
      this._datepicker.open();
    });
  }

  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  /**
   * @deprecated
   * @breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
   */
  getPopupConnectionElementRef(): ElementRef {
    return this.getConnectedOverlayOrigin();
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   *
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField
      ? this._formField.getConnectedOverlayOrigin()
      : this._elementRef;
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _onKeydown(event: KeyboardEvent) {
    const isAltDownArrow = event.altKey && event.keyCode === DOWN_ARROW;

    if (
      this._datepicker &&
      isAltDownArrow &&
      !this._elementRef.nativeElement.readOnly
    ) {
      this._datepicker.open();
      event.preventDefault();
    }
  }

  _onInput(value: string) {
    let date = this._dateAdapter.parse(
      value,
      this._dateFormats.parse.dateInput
    );
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._getValidDateOrNull(date);

    if (!this._dateAdapter.sameDate(date, this._value)) {
      this._value = date;
      this._cvaOnChange(date);
      this._valueChange.emit(date);
      this.dateInput.emit(
        new OuiDatepickerInputEvent(this, this._elementRef.nativeElement)
      );
    }
  }

  _onChange() {
    this.dateChange.emit(
      new OuiDatepickerInputEvent(this, this._elementRef.nativeElement)
    );
  }

  /** Returns the palette used by the input's form field, if any. */
  _getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }

  /** Handles blur events on the input. */
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }

  /** Formats a value and sets it on the input element. */
  private _formatValue(value: D | null) {
    this._elementRef.nativeElement.value = value
      ? this._dateAdapter.format(value, this._dateFormats.display.dateInput)
      : '';
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return this._dateAdapter.isDateInstance(obj) &&
      this._dateAdapter.isValid(obj as any as D)
      ? obj
      : null;
  }
}
