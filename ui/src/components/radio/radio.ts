import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  effect,
  forwardRef,
  input,
  OnDestroy,
  OnInit,
  model,
  output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { CanColorCtor, mixinColor, ThemePalette } from '../core';
import { Subscription } from 'rxjs';
// Increasing integer for generating unique ids for radio components.
let nextUniqueId = 0;

/**
 * Provider Expression that allows oui-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 *
 * @docs-private
 */
export const OUI_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OuiRadioGroup),
  multi: true,
};

/** Change event object emitted by OuiRadio and OuiRadioGroup. */
export class OuiRadioChange {
  constructor(
    /** The OuiRadioButton that emits the change event. */
    public source: OuiRadioButton,
    /** The value of the OuiRadioButton. */
    public value: any
  ) {}
}

// Boilerplate for applying mixins to OuiRadioGroup.
/** @docs-private */
export class OuiRadioGroupBase {}

/**
 * A group of radio buttons. May contain one or more `<oui-radio-button>` elements.
 */
@Component({
  selector: 'oui-radio-group',
  exportAs: 'ouiRadioGroup',
  template: ` <ng-content></ng-content> `,
  providers: [OUI_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    role: 'radiogroup',
    class: 'oui-radio-group',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OuiRadioGroup implements AfterContentInit, ControlValueAccessor {
  private _changeDetector = inject(ChangeDetectorRef);

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
  readonly change = output<OuiRadioChange>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => OuiRadioButton), { descendants: true })
  _radios: QueryList<OuiRadioButton>;
  /** Selected value for the radio group. */

  /** The HTML name attribute applied to radio buttons in this group. */
  private _name = `oui-radio-group-${nextUniqueId++}`;

  /** The currently selected radio button. Should match value. */

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized = false;

  /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */

  /** Whether the radio group is disabled. */

  /** Whether the radio group is required. */

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   *
   * @docs-private
   */
  onTouched: () => any = () => {};

  /** Name of the radio button group. All radio buttons inside this group will use this name. */
  readonly name = model(this._name);

  /** Whether the labels should appear after or before the radio-buttons. Defaults to `after` */
  readonly labelPosition = model<'before' | 'after'>('after');

  /**
   * Value for the radio-group. Should equal the value of the selected radio button if there is
   * a corresponding radio button with a matching value. If there is not such a corresponding
   * radio button, this value persists to be applied in case a new radio button is added with a
   * matching value.
   */
  readonly value = model<any>(null);
  private _setValue(newValue: any) {
    if (this.value() !== newValue) {
      // Set this before proceeding to ensure no circular loop occurs with selection.
      this.value.set(newValue);

      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }

  _checkSelectedRadioButton() {
    if (this.selected() && !this.selected()!.checked()) {
      this.selected()!.checked.set(true);
    }
  }

  /**
   * The currently selected radio button. If set to a new radio button, the radio group value
   * will be updated to match the new selected button.
   */
  readonly selected = model<OuiRadioButton | null>(null);
  /** Whether the radio group is disabled */
  readonly disabled = model(false);

  /** Whether the radio group is required */
  readonly required = model(false);

  constructor() {
    effect(() => {
      this.name();
      this._updateRadioButtonNames();
      this.labelPosition();
      this._propagateGroupProperties();
      this.value();
      this._updateSelectedRadioFromValue();
      this.disabled();
      this.required();
      this._propagateGroupProperties();
    });
  }

  /** Propagates the group's `disabled`, `required` and `labelPosition` to its radios. */
  private _propagateGroupProperties(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.disabled.set(this.disabled());
        radio.required.set(this.required());
        radio.labelPosition.set(this.labelPosition());
      });
    }
  }

  /**
   * Initialize properties once content children are available.
   * This allows us to propagate relevant attributes to associated buttons.
   */
  ngAfterContentInit() {
    // Mark this component as initialized in AfterContentInit because the initial value can
    // possibly be set by NgModel on OuiRadioGroup, and it is possible that the OnInit of the
    // NgModel occurs *after* the OnInit of the OuiRadioGroup.
    this._isInitialized = true;
  }

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name.set(this.name());
      });
    }
  }

  /** Updates the `selected` radio button from the internal _value state. */
  private _updateSelectedRadioFromValue(): void {
    // If the value already matches the selected radio, do nothing.
    const isAlreadySelected =
      this.selected() !== null && this.selected()!.value() === this.value();

    if (this._radios && !isAlreadySelected) {
      this.selected.set(null);
      this._radios.forEach((radio) => {
        radio.checked.set(this.value() === radio.value());
        if (radio.checked()) {
          this.selected.set(radio);
        }
      });
    }
  }

  /** Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      this.change.emit(new OuiRadioChange(this.selected()!, this.value()));
    }
  }

  _markRadiosForCheck() {
    if (this._radios) {
      this._radios.forEach((radio) => radio._markForCheck());
    }
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   *
   * @param value
   */
  writeValue(value: any) {
    this._setValue(value);
    this._changeDetector.markForCheck();
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   *
   * @param fn Callback to be registered.
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   *
   * @param fn Callback to be registered.
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   *
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled.set(coerceBooleanProperty(isDisabled));
    this._changeDetector.markForCheck();
  }
}

// Boilerplate for applying mixins to OuiRadioButton.
/** @docs-private */
export class OuiRadioButtonBase {
  // Since the disabled property is manually defined for the OuiRadioButton and isn't set up in
  // the mixin base class. To be able to use the tabindex mixin, a disabled property must be
  // defined to properly work.
  // disabled: boolean;

  constructor(public _elementRef: ElementRef<HTMLElement>) {}
}

export const OuiRadioButtonMixinBase: CanColorCtor & typeof OuiRadioButtonBase =
  mixinColor(OuiRadioButtonBase);

@Component({
  selector: 'oui-radio-button',
  templateUrl: 'radio.html',
  styleUrls: ['radio.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiRadioButton',
  host: {
    class: 'oui-radio-button',
    '[class.oui-radio-checked]': 'checked()',
    '[class.oui-radio-disabled]': 'disabled()',
    '[class._oui-animation-noopable]': '_animationMode === "NoopAnimations"',
    '[attr.tabindex]': 'null',
    '[attr.id]': 'id()',
    // Note: under normal conditions focus shouldn't land on this element, however it may be
    // programmatically set, for example inside of a focus trap, in this case we want to forward
    // the focus to the native element.
    '(focus)': '_inputElement.nativeElement.focus()',
    '(click)': '_fireInputChange()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class OuiRadioButton
  extends OuiRadioButtonMixinBase
  implements OnInit, AfterViewInit, OnDestroy
{
  private _changeDetector = inject(ChangeDetectorRef);
  private _focusMonitor = inject(FocusMonitor);
  private _radioDispatcher = inject(UniqueSelectionDispatcher);
  _animationMode? = inject(ANIMATION_MODULE_TYPE, { optional: true });

  private _uniqueId = `oui-radio-${++nextUniqueId}`;
  private _monitorSubscription: Subscription = Subscription.EMPTY;
  /**
   * Implemented as part of CanColor.
   */
  readonly colorInput = input<ThemePalette>('primary', { alias: 'color' });
  get color(): ThemePalette {
    return super.color;
  }
  set color(value: ThemePalette) {
    super.color = value;
    this._changeDetector?.markForCheck();
  }
  /** The unique ID for the radio button. */
  readonly id = input(this._uniqueId);

  /** Analog to HTML `name` attribute used to group radios for unique selection. */
  readonly name = model<string>();

  /** Used to set the `aria-label` attribute on the underlying input element. */
  readonly ariaLabel = model<string>(undefined, { alias: 'aria-label' });

  /** The `aria-labelledby` attribute takes precedence as the element text alternative. */
  readonly ariaLabelledby = model<string>(undefined, {
    alias: 'aria-labelledby',
  });
  /** The `aria-labelledby` attribute takes precedence as the element text alternative. */
  readonly tabIndex = model<number>();

  /** The  `aria-describedby` attribute is read after the element label and field type. */
  readonly ariaDescribedby = model<string>(undefined, {
    alias: 'aria-describedby',
  });

  /** Whether this radio button is checked. */
  readonly checked = model(false);
  _setChecked(value: boolean) {
    const newCheckedState = coerceBooleanProperty(value);
    if (this.checked() !== newCheckedState) {
      this.checked.set(newCheckedState);
      if (newCheckedState && this.radioGroup) {
        this.radioGroup.selected.set(this);
        if (this.radioGroup.value() !== this.value()) {
          this.radioGroup.value.set(this.value());
        }
      } else if (
        !newCheckedState &&
        this.radioGroup &&
        this.radioGroup.value() === this.value()
      ) {
        // When unchecking the selected radio button, update the selected radio
        // property on the group.
        this.radioGroup.selected.set(null);
        this.radioGroup.value.set(null);
      }

      if (newCheckedState) {
        // Notify all radio buttons with the same name to un-check.
        this._radioDispatcher.notify(this.id(), this.name());
      }
      this._changeDetector.markForCheck();
    }
  }

  /** The value of this radio button. */
  readonly value = model<any>(null);
  private _setValue(value: any) {
    if (this.value() !== value) {
      this.value.set(value);
      if (this.radioGroup !== null) {
        if (!this.checked()) {
          // Update checked when the value changed to match the radio group's value
          this._setChecked(this.radioGroup.value() === value);
        }
        if (this.checked()) {
          this.radioGroup.selected.set(this);
        }
      }
    }
  }

  /** Whether the label should appear after or before the radio button. Defaults to `after` */
  readonly labelPosition = model<'before' | 'after'>('after');

  /** Whether the radio button is disabled. */
  readonly disabled = model(false);

  /** Whether the radio button is required. */
  readonly required = model(false);

  /**
   * Event emitted when the checked state of this radio button changes.
   * Change events are only emitted when the value changes due to user interaction with
   * the radio button (the same behavior as `<input type-"radio">`).
   */
  readonly change = output<OuiRadioChange>();

  /** The native `<input type=radio>` element */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  /** The parent radio group. May or may not be present. */
  radioGroup: OuiRadioGroup;

  /** ID of the native input element inside `<oui-radio-button>` */
  get inputId(): string {
    return `${this.id() || this._uniqueId}-input`;
  }

  /** Whether this radio is checked. */

  /** Unregister function for _radioDispatcher */
  private _removeUniqueSelectionListener: () => void = () => {};

  constructor() {
    const radioGroup = inject(OuiRadioGroup, { optional: true })!;
    const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    super(elementRef);
    const _radioDispatcher = this._radioDispatcher;

    // Assertions. Ideally these should be stripped out by the compiler.
    // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
    this.radioGroup = radioGroup;
    effect(() => {
      super.color = this.colorInput();
      this._changeDetector.markForCheck();
    });
    effect(() => {
      this.value();
      this.checked();
      if (this.radioGroup && !this.checked()) {
        this._setValue(this.value());
      }
    });
    // Track the aria inputs so the template re-renders when they change.
    effect(() => {
      this.ariaLabel();
      this.ariaLabelledby();
      this.ariaDescribedby();
      this.tabIndex();
      this._changeDetector.markForCheck();
    });

    this._removeUniqueSelectionListener = _radioDispatcher.listen(
      (id: string, name: string) => {
        if (id !== this.id() && name === this.name()) {
          this.checked.set(false);
        }
      }
    );
  }

  /** Focuses the radio button. */
  focus(): void {
    this._focusMonitor.focusVia(this._inputElement, 'keyboard');
  }

  _fireInputChange(): void {
    if (!this.disabled()) {
      const event = document.createEvent('Event');
      event.initEvent('change', false, true);
      this._inputElement.nativeElement.dispatchEvent(event);
    }
  }

  /**
   * Marks the radio button as needing checking for change detection.
   * This method is exposed because the parent radio group will directly
   * update bound properties of the radio button.
   */
  _markForCheck() {
    // When group value changes, the button will not be notified. Use `markForCheck` to explicit
    // update radio button's status
    this._changeDetector.markForCheck();
  }

  ngOnInit() {
    if (this.radioGroup) {
      // If the radio is inside a radio group, determine if it should be checked.
      // Only override the checked state when the group has a value; otherwise
      // respect the explicitly-set `checked` attribute on the radio button.
      const groupValue = this.radioGroup.value();
      if (groupValue !== null && groupValue !== undefined) {
        this._setChecked(groupValue === this.value());
      }
      // Copy name from parent radio group
      this.name.set(this.radioGroup.name());
    }
  }

  ngAfterViewInit() {
    this._monitorSubscription = this._focusMonitor
      .monitor(this._elementRef, true)
      .subscribe({
        next: (focusOrigin) => {
          if (!focusOrigin && this.radioGroup) {
            this.radioGroup._touch();
          }
        },
        error: (err: Error) =>
          console.error('Radio focus monitoring failed', err),
      });
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._removeUniqueSelectionListener();
    this._monitorSubscription.unsubscribe();
  }

  /** Dispatch change event with current value. */
  private _emitChangeEvent(): void {
    this.change.emit(new OuiRadioChange(this, this.value()));
  }

  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `radio-button` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
  }

  /**
   * Triggered when the radio button received a click or the input recognized any change.
   * Clicking on a label element, will trigger a change event on the associated input.
   */
  _onInputChange(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
    const groupValueChanged =
      this.radioGroup && this.value() !== this.radioGroup.value();
    this._setChecked(true);
    this._changeDetector.detectChanges();
    this._emitChangeEvent();

    if (this.radioGroup) {
      this.radioGroup._controlValueAccessorChangeFn(this.value());
      this.radioGroup._touch();
      if (groupValueChanged) {
        this.radioGroup._emitChangeEvent();
      }
    }
  }
}
