import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { CanColor, mixinColor } from '../core';
import { OuiFormFieldControl } from '../form-field/form-field-control';
import { Subject } from 'rxjs';
import { getOuiInputUnsupportedTypeError } from './input-errors';
import { ErrorStateMatcher } from '../core/common-behaviors/error-options';
import { OUI_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
import {
  CanUpdateErrorStateCtor,
  mixinErrorState,
} from '../core/common-behaviors/error-state';

// Invalid input type. Using one of these will throw an OuiInputUnsupportedTypeError.
const OUI_INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
];

/** Default color palette for input */
const DEFAULT_COLOR = 'primary';

/**
 * List of classes to add to Button instances based on host attributes to
 * style as different variants.
 */
const INPUT_HOST_ATTRIBUTES = ['oui-input'];

let nextUniqueId = 0;

// Boilerplate for applying mixins to OuiInput.
/** @docs-private */

export class OuiInputErrorBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl
  ) {}
}
export const _OuiInputErrorMixinBase: CanUpdateErrorStateCtor &
  typeof OuiInputErrorBase = mixinErrorState(OuiInputErrorBase);

export class OuiInputBase extends _OuiInputErrorMixinBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
  }
}

export const _OuiInputMixinBase: typeof OuiInputBase = mixinColor(OuiInputBase);

/** Directive that allows a native input to work inside a `OuiFormField`. */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: `input[oui-input], textarea[oui-input]`,
    exportAs: 'ouiInput',
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'oui-input-element',
        // Native input properties that are overwritten by Angular inputs need to be synced with
        // the native input element. Otherwise property bindings for those don't work.
        '[attr.id]': 'id',
        '[attr.placeholder]': 'placeholder',
        '[disabled]': 'disabled',
        '[required]': 'required',
        '[attr.readonly]': 'readonly && !_isNativeSelect || null',
        '[attr.aria-describedby]': '_ariaDescribedby || null',
        '[attr.aria-invalid]': 'errorState',
        '[attr.aria-required]': 'required.toString()',
        '(input)': '_onInput()',
    },
    providers: [
        { provide: OuiFormFieldControl, useExisting: OuiInput },
        NgForm,
        FormGroupDirective,
    ],
    standalone: false
})
export class OuiInput
  extends _OuiInputMixinBase
  implements OuiFormFieldControl<any>, OnChanges, OnDestroy, OnInit, CanColor
{
  protected _uid = `oui-input-${nextUniqueId++}`;
  protected _previousNativeValue: any;
  private _inputValueAccessor: { value: any };

  /**
   * Implemented as part of CanColor.
   */
  color: any;

  /**
   * Implemented as part of CanUpdateErrorState.
   *
   * @docs-private
   */
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  errorState: boolean = false;

  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  /** Whether the component is being rendered on the server. */
  _isServer = false;

  /** Whether the component is a native html select. */
  _isNativeSelect = false;

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  focused: boolean = false;

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  readonly stateChanges: Subject<void> = new Subject<void>();

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  controlType: string = 'oui-input';

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  autofilled = false;

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  protected _disabled = false;

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  protected _id: string;

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  @Input()
  placeholder: string;

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  protected _required = false;

  /** Input type of the element. */
  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value || 'text';
    this._validateType();

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      (this._elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
  }
  protected _type = 'text';

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  @Input()
  get value(): string {
    return this._inputValueAccessor.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;

  protected _neverEmptyInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'month',
    'time',
    'week',
  ].filter((t) => getSupportedInputTypes().has(t));

  constructor(
    public _elementRef: ElementRef<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    protected _platform: Platform,
    /** @docs-private */
    @Optional()
    @Self()
    public ngControl: NgControl,
    @Optional()
    @Self()
    @Inject(OUI_INPUT_VALUE_ACCESSOR)
    inputValueAccessor: any,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    private _autofillMonitor: AutofillMonitor,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective /** @docs-private */
  ) {
    super(
      _elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl
    );

    const element = this._elementRef.nativeElement;

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
    this._inputValueAccessor = inputValueAccessor || element;

    this._previousNativeValue = this.value;

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    this._isNativeSelect = element.nodeName.toLowerCase() === 'select';

    if (this._isNativeSelect) {
      this.controlType = (element as HTMLSelectElement).multiple
        ? 'oui-native-select-multiple'
        : 'oui-native-select';
    }

    this.addClass();
  }

  ngOnInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor
        .monitor(this._elementRef.nativeElement)
        .subscribe((event) => {
          this.autofilled = event.isAutofilled;
          this.stateChanges.next();
        });
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();

    if (this._platform.isBrowser) {
      this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
    }
  }

  /** Focuses the input. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  _onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // It's necessary that Angular recognizes the value change, because when floatingLabel
    // is set to false and Angular forms aren't used, the placeholder won't recognize the
    // value changes and will not disappear.
    // Listening to the input event wouldn't be necessary when the input is using the
    // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
  }

  /** Getting native host element */
  getHostElement() {
    return this._elementRef.nativeElement;
  }

  /** Gets whether the button has one of the given attributes. */
  hasHostAttributes(...attributes: string[]) {
    return attributes.some((attribute) =>
      this.getHostElement().hasAttribute(attribute)
    );
  }

  updateErrorState() {}

  /** Adding class dynamically based of type */
  protected addClass() {
    for (const attr of INPUT_HOST_ATTRIBUTES) {
      if (this.hasHostAttributes(attr)) {
        (this._elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }
    if (!this.color) {
      this.color = DEFAULT_COLOR;
    }
  }

  /** Does some manual dirty checking on the native input `value` property. */
  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Make sure the input is a supported type. */
  protected _validateType() {
    if (OUI_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
      throw getOuiInputUnsupportedTypeError(this._type);
    }
  }

  /** Checks whether the input type is one of the types that are never empty. */
  protected _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement)
      .validity;
    return validity && validity.badInput;
  }

  /** Determines if the component host is a textarea. */
  protected _isTextarea() {
    return this._elementRef.nativeElement.nodeName.toLowerCase() === 'textarea';
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  get empty(): boolean {
    return (
      !this._isNeverEmpty() &&
      !this._elementRef.nativeElement.value &&
      !this._isBadInput() &&
      !this.autofilled
    );
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  get shouldLabelFloat(): boolean {
    if (this._isNativeSelect) {
      // For a single-selection `<select>`, the label should float when the selected option has
      // a non-empty display value. For a `<select multiple>`, the label *always* floats to avoid
      // overlapping the label with the options.
      const selectElement = this._elementRef.nativeElement as HTMLSelectElement;
      const firstOption: HTMLOptionElement | undefined =
        selectElement.options[0];

      // On most browsers the `selectedIndex` will always be 0, however on IE and Edge it'll be
      // -1 if the `value` is set to something, that isn't in the list of options, at a later point.
      return (
        this.focused ||
        selectElement.multiple ||
        !this.empty ||
        !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label)
      );
    } else {
      return this.focused || !this.empty;
    }
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   *
   * @docs-private
   */
  onContainerClick() {
    // Do not re-focus the input element if the element is already focused. Otherwise it can happen
    // that someone clicks on a time input and the cursor resets to the "hours" field while the
    // "minutes" field was actually clicked. See: https://github.com/angular/material2/issues/12849
    if (!this.focused) {
      this.focus();
    }
  }
}
