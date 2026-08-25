import { _IdGenerator } from '@angular/cdk/a11y';
import {
  DOWN_ARROW,
  hasModifierKey,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  AfterViewInit,
  booleanAttribute,
  Component,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '../core';
import { OuiFormFieldControl } from '../form-field/form-field-control';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OuiChipRow } from './chip-row';
import { OuiChipSet } from './chip-set';
import { OuiChipTextControl } from './chip-text-control';

/** Change event object that is emitted when the chip grid value has changed. */
export class OuiChipGridChange {
  constructor(
    /** Chip grid that emitted the event. */
    public source: OuiChipGrid,
    /** Value of the chip grid when the event was emitted. */
    public value: any
  ) {}
}

/**
 * An extension of the OuiChipSet component used with OuiChipRow chips and
 * the ouiChipInputFor directive.
 */
@Component({
  selector: 'oui-chip-grid',
  template: `
    <div class="oui-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['chip-set.scss'],
  host: {
    class: 'oui-chip-set oui-chip-grid',
    '[attr.role]': 'role',
    '[attr.tabindex]':
      '(disabled || (_chips && _chips.length === 0)) ? -1 : tabIndex',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[class.oui-chip-list-disabled]': 'disabled',
    '[class.oui-chip-list-invalid]': 'errorState',
    '[class.oui-chip-list-required]': 'required',
    '(focus)': 'focus()',
    '(blur)': '_blur()',
  },
  providers: [{ provide: OuiFormFieldControl, useExisting: OuiChipGrid }],
  encapsulation: ViewEncapsulation.None,
})
export class OuiChipGrid
  extends OuiChipSet
  implements
    AfterContentInit,
    AfterViewInit,
    ControlValueAccessor,
    DoCheck,
    OuiFormFieldControl<any>,
    OnDestroy
{
  ngControl = inject(NgControl, { optional: true, self: true })!;

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  readonly controlType: string = 'oui-chip-grid';

  /** The chip input to add more chips */
  protected _chipInput?: OuiChipTextControl;

  protected override _defaultRole = 'grid';
  private _errorStateTracker: ErrorStateTracker;
  private _uid = inject(_IdGenerator).getId('oui-chip-grid-');

  /**
   * List of element ids to propagate to the chipInput's aria-describedby attribute.
   */
  private _ariaDescribedbyIds: string[] = [];

  /**
   * Function when touched. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onTouched = () => {};

  /**
   * Function when changed. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onChange: (value: any) => void = () => {};

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  @Input({ transform: booleanAttribute })
  override get disabled(): boolean {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  override set disabled(value: boolean) {
    this._disabled = value;
    this._syncChipsState();
    this.stateChanges.next();
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  get id(): string {
    return this._chipInput ? this._chipInput.id : this._uid;
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  override get empty(): boolean {
    return (
      (!this._chipInput || this._chipInput.empty) &&
      (!this._chips || this._chips.length === 0)
    );
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  @Input()
  get placeholder(): string {
    return this._chipInput ? this._chipInput.placeholder : this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  protected _placeholder = '';

  /** Whether any chips or the ouiChipInput inside of this chip-grid has focus. */
  override get focused(): boolean {
    return this._chipInput?.focused || this._hasFocusedChip();
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return (
      this._required ??
      this.ngControl?.control?.hasValidator(Validators.required) ??
      false
    );
  }
  set required(value: boolean) {
    this._required = value;
    this.stateChanges.next();
  }
  protected _required: boolean | undefined;

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat(): boolean {
    return !this.empty || this.focused;
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this._value = value;
  }
  protected _value: any[] = [];

  /** An object used to control when error messages are shown. */
  @Input()
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value: ErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

  /** Combined stream of all of the child chips' blur events. */
  get chipBlurChanges() {
    return this._getChipStream((chip) => chip._onBlur);
  }

  /** Emits when the chip grid value has been changed by the user. */
  @Output() readonly change: EventEmitter<OuiChipGridChange> =
    new EventEmitter<OuiChipGridChange>();

  /**
   * Emits whenever the raw value of the chip-grid changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(OuiChipRow, {
    descendants: true,
  })
  override _chips: QueryList<OuiChipRow> = undefined!;

  /**
   * Emits whenever the component state changes and should cause the parent
   * form-field to update. Implemented as part of `OuiFormFieldControl`.
   * @docs-private
   */
  readonly stateChanges = new Subject<void>();

  /** Whether the chip grid is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

  constructor() {
    super();

    const parentForm = inject(NgForm, { optional: true });
    const parentFormGroup = inject(FormGroupDirective, { optional: true });
    const defaultErrorStateMatcher = inject(ErrorStateMatcher);

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this._errorStateTracker = new ErrorStateTracker(
      defaultErrorStateMatcher,
      this.ngControl,
      parentFormGroup,
      parentForm,
      this.stateChanges
    );
  }

  ngAfterContentInit() {
    this.chipBlurChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._blur();
      this.stateChanges.next();
    });

    merge(this.chipFocusChanges, this._chips.changes)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.stateChanges.next());
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.stateChanges.complete();
  }

  /** Associates an HTML input element with this chip grid. */
  registerInput(inputElement: OuiChipTextControl): void {
    this._chipInput = inputElement;
    this._chipInput.setDescribedByIds(this._ariaDescribedbyIds);

    this._elementRef.nativeElement.removeAttribute('aria-describedby');
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  onContainerClick(event: MouseEvent) {
    if (!this.disabled && !this._originatesFromChip(event)) {
      this.focus();
    }
  }

  /**
   * Focuses the first chip in this chip grid, or the associated input when there
   * are no eligible chips.
   */
  override focus(): void {
    if (this.disabled || this._chipInput?.focused) {
      return;
    }

    if (!this._chips.length || this._chips.first.disabled) {
      if (!this._chipInput) {
        return;
      }

      Promise.resolve().then(() => this._chipInput!.focus());
    } else {
      const activeItem = this._keyManager.activeItem;

      if (activeItem) {
        activeItem.focus();
      } else {
        this._keyManager.setFirstItemActive();
      }
    }

    this.stateChanges.next();
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  get describedByIds(): string[] {
    if (this._chipInput) {
      return this._chipInput.describedByIds || [];
    }
    const existing =
      this._elementRef.nativeElement.getAttribute('aria-describedby');
    return existing ? existing.split(' ') : [];
  }

  /**
   * Implemented as part of OuiFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedbyIds = ids;

    if (this._chipInput) {
      this._chipInput.setDescribedByIds(ids);
    } else if (ids.length) {
      this._elementRef.nativeElement.setAttribute(
        'aria-describedby',
        ids.join(' ')
      );
    } else {
      this._elementRef.nativeElement.removeAttribute('aria-describedby');
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  writeValue(value: any): void {
    this._value = value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  /** Refreshes the error state of the chip grid. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  /** When blurred, mark the field as touched when focus moved outside the chip grid. */
  _blur() {
    if (!this.disabled) {
      setTimeout(() => {
        if (!this.focused) {
          this._propagateChanges();
          this._markAsTouched();
        }
      });
    }
  }

  /**
   * Removes the `tabindex` from the chip grid and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the grid from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  protected override _allowFocusEscape() {
    if (!this._chipInput?.focused) {
      super._allowFocusEscape();
    }
  }

  /** Handles custom keyboard events. */
  override _handleKeydown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    const activeItem = this._keyManager.activeItem;

    if (keyCode === TAB) {
      if (
        this._chipInput?.focused &&
        hasModifierKey(event, 'shiftKey') &&
        this._chips.length &&
        !this._chips.last.disabled
      ) {
        event.preventDefault();

        if (activeItem) {
          this._keyManager.setActiveItem(activeItem);
        } else {
          this._focusLastChip();
        }
      } else {
        super._allowFocusEscape();
      }
    } else if (!this._chipInput?.focused) {
      if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && activeItem) {
        const eligibleActions = this._chipActions.filter(
          (action) =>
            action._isPrimary === activeItem._isPrimary &&
            !this._skipPredicate(action)
        );
        const currentIndex = eligibleActions.indexOf(activeItem);
        const delta = event.keyCode === UP_ARROW ? -1 : 1;

        event.preventDefault();
        if (currentIndex > -1 && this._isValidIndex(currentIndex + delta)) {
          this._keyManager.setActiveItem(eligibleActions[currentIndex + delta]);
        }
      } else {
        super._handleKeydown(event);
      }
    }

    this.stateChanges.next();
  }

  protected override _redirectDestroyedChipFocus() {
    if (this._lastDestroyedFocusedChipIndex === null) {
      return;
    }

    super._redirectDestroyedChipFocus();

    if (
      !this._chips.length ||
      (this._chips.length === 1 && this._chips.first.disabled)
    ) {
      this._keyManager.updateActiveItem(-1);
    }
  }

  _focusLastChip() {
    if (this._chips.length) {
      this._chips.last.focus();
    }
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(): void {
    const valueToEmit = this._chips.length
      ? this._chips.toArray().map((chip) => chip.value)
      : [];
    this._value = valueToEmit;
    this.change.emit(new OuiChipGridChange(this, valueToEmit));
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }

  /** Mark the field as touched */
  private _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
}

/**
 * Internal tracker for the chip grid error state.
 * @docs-private
 */
class ErrorStateTracker {
  errorState = false;

  constructor(
    private _defaultMatcher: ErrorStateMatcher,
    private _ngControl: NgControl | null,
    private _parentFormGroup: FormGroupDirective | null,
    private _parentForm: NgForm | null,
    private _stateChanges: Subject<void>
  ) {}

  get matcher(): ErrorStateMatcher {
    return this._defaultMatcher;
  }
  set matcher(value: ErrorStateMatcher) {
    this._defaultMatcher = value;
  }

  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const control: AbstractControl | null = this._ngControl
      ? this._ngControl.control
      : null;
    const newState = this._defaultMatcher.isErrorState(
      control as unknown as import('@angular/forms').UntypedFormControl | null,
      parent
    );

    if (newState !== oldState) {
      this.errorState = newState;
      this._stateChanges.next();
    }
  }
}
