import { DOWN_ARROW } from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  ErrorHandler,
  effect,
  forwardRef,
  OnDestroy,
  output,
  input,
  model,
  AfterViewInit,
  inject,
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
    this.value =
      typeof this.target.value === 'function'
        ? (this.target.value as () => D | null)() ?? null
        : (this.target.value as unknown as D | null) ?? null;
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
  host: {
    class: 'oui-datepicker-input',
    '[attr.aria-haspopup]': 'true',
    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
    '[attr.min]': 'min() ? _dateAdapter.toIso8601(min()!) : null',
    '[attr.max]': 'max() ? _dateAdapter.toIso8601(max()!) : null',
    '[disabled]': 'disabled()',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
    '[class.oui-datepicker-disabled]': '_datepickerDisabled',
  },
  exportAs: 'ouiDatepickerInput',
  standalone: false,
})
export class OuiDatepickerInput<D>
  implements ControlValueAccessor, OnDestroy, AfterViewInit, Validator
{
  private _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  _dateAdapter = inject<DateAdapter<D>>(DateAdapter, { optional: true })!;
  private _dateFormats = inject<OuiDateFormats>(OUI_DATE_FORMATS, {
    optional: true,
  })!;
  private _formField = inject(OuiFormField, { optional: true })!;
  private _errorHandler = inject(ErrorHandler);

  /** Emits when a `change` event is fired on this `<input>`. */
  readonly dateChange = output<OuiDatepickerInputEvent<D>>();

  /** Emits when an `input` event is fired on this `<input>`. */
  readonly dateInput = output<OuiDatepickerInputEvent<D>>();

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = output<D | null>();

  /** Emits when the disabled state has changed */
  _disabledChange = output<boolean>();

  private _datepickerSubscription = Subscription.EMPTY;

  private _localeSubscription = Subscription.EMPTY;

  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;

  private _parentNodeClickSubscription: Subscription = Subscription.EMPTY;

  _datepickerDisabled = false;
  /** The datepicker that this input is associated with. */
  readonly ouiDatepicker = input<OuiDatepicker<D>>();
  _datepicker!: OuiDatepicker<D>;

  /** Function that can be used to filter out dates within the datepicker. */
  readonly ouiDatepickerFilter = input<(date: D | null) => boolean>();

  /** The value of the input. */
  readonly value = model<D | null>(null);

  /** The minimum valid date. */
  readonly min = input<D | null, D | null>(null, {
    transform: (value: D | null) =>
      this._getValidDateOrNull(this._dateAdapter.deserialize(value)),
  });

  /** The maximum valid date. */
  readonly max = input<D | null, D | null>(null, {
    transform: (value: D | null) =>
      this._getValidDateOrNull(this._dateAdapter.deserialize(value)),
  });

  focus() {
    this._elementRef.nativeElement.classList.add(DATEPICKER_FOCUS_CLASS);
  }
  blur() {
    this._elementRef.nativeElement.classList.remove(DATEPICKER_FOCUS_CLASS);
  }

  /** Whether the datepicker-input is disabled. */
  readonly disabled = model(false);
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
    return !this.min() ||
      !controlValue ||
      this._dateAdapter.compareDate(this.min()!, controlValue) <= 0
      ? null
      : { ouiDatepickerMin: { min: this.min(), actual: controlValue } };
  };

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(
      this._dateAdapter.deserialize(control.value)
    );
    return !this.max() ||
      !controlValue ||
      this._dateAdapter.compareDate(this.max()!, controlValue) >= 0
      ? null
      : { ouiDatepickerMax: { max: this.max(), actual: controlValue } };
  };

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(
      this._dateAdapter.deserialize(control.value)
    );
    return !this.ouiDatepickerFilter() ||
      !controlValue ||
      this.ouiDatepickerFilter()!(controlValue)
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

  constructor() {
    const _dateAdapter = this._dateAdapter;

    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('OUI_DATE_FORMATS');
    }

    // Update the displayed date when the locale changes.
    this._localeSubscription = _dateAdapter.localeChanges.subscribe({
      next: () => this._formatValue(this._readValue() ?? null),
      error: (err: Error) =>
        console.error('Datepicker locale update failed', err),
    });
    effect(() => {
      const datepicker = this.ouiDatepicker();
      if (!datepicker) return;
      this._datepicker = datepicker;
      datepicker._registerInput(this);
      this._datepickerSubscription.unsubscribe();
      this._datepickerSubscription = datepicker._selectedChanged.subscribe({
        next: (selected: D) => {
          this._setValue(selected);
          this._cvaOnChange(selected);
          this._onTouched();
          this.dateInput.emit(
            new OuiDatepickerInputEvent(this, this._elementRef.nativeElement)
          );
          this.dateChange.emit(
            new OuiDatepickerInputEvent(this, this._elementRef.nativeElement)
          );
        },
        error: (err: Error) =>
          console.error('Datepicker selection update failed', err),
      });
    });
    effect(() => {
      this.ouiDatepickerFilter();
      this.min();
      this.max();
      this._validatorOnChange();
    });
    effect(() => {
      const value = this._readValue();
      const normalizedValue = this._getValidDateOrNull(
        this._dateAdapter.deserialize(value)
      );
      if (value !== normalizedValue) {
        this._setValue(normalizedValue);
      } else {
        this._formatValue(normalizedValue);
      }
    });
  }

  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._parentNodeClickSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this._elementRef.nativeElement.setAttribute('disabled', 'true');
    this._parentNodeClickSubscription = fromEvent(
      this._elementRef.nativeElement.parentNode!,
      'click'
    ).subscribe({
      next: () => {
        this._datepicker?.open();
      },
      error: (err: Error) => this._errorHandler.handleError(err),
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
    this._setValue(value);
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
    this.disabled.set(isDisabled);
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

    if (!this._dateAdapter.sameDate(date, this._readValue() ?? null)) {
      this._setValue(date);
      this._cvaOnChange(date);
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

  private _setValue(value: D | null): void {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._getValidDateOrNull(value);
    const oldDate = this._readValue() ?? null;
    this._writeValue(value);
    this._formatValue(value);

    if (!this._dateAdapter.sameDate(oldDate, value)) {
      this._valueChange.emit(value);
    }
  }

  /** Returns the palette used by the input's form field, if any. */
  _getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }

  /** Handles blur events on the input. */
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this._readValue()) {
      this._formatValue(this._readValue() ?? null);
    }

    this._onTouched();
  }

  private _readValue(): D | null {
    const value = this.value as unknown;
    return typeof value === 'function'
      ? (value as () => D | null)()
      : (value as D | null);
  }

  private _writeValue(value: D | null): void {
    const valueSignal = this.value as unknown;
    if (typeof valueSignal === 'function') {
      (valueSignal as unknown as { set(value: D | null): void }).set(value);
    } else {
      (this as unknown as { value: D | null }).value = value;
    }
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
