import { BACKSPACE, hasModifierKey, ModifierKey } from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  OnChanges,
  OnDestroy,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import {
  OuiChipsDefaultOptions,
  OUI_CHIPS_DEFAULT_OPTIONS,
  SeparatorKey,
} from './tokens';
import { OuiChipGrid } from './chip-grid';
import { OuiChipTextControl } from './chip-text-control';

/** Represents an input event on a `ouiChipInput`. */
export interface OuiChipInputEvent {
  /**
   * The native `<input>` element that the event is being fired for.
   * @deprecated Use `OuiChipInputEvent#chipInput.inputElement` instead.
   */
  input: HTMLInputElement;

  /** The value of the input. */
  value: string;

  /** Reference to the chip input that emitted the event. */
  chipInput: OuiChipInput;
}

/**
 * Directive that adds chip-specific behaviors to an input element inside `<oui-form-field>`.
 * May be placed inside or outside of an `<oui-chip-grid>`.
 */
@Directive({
  selector: 'input[ouiChipInputFor]',
  exportAs: 'ouiChipInput, ouiChipInputFor',
  host: {
    class: 'oui-chip-input',
    '(keydown)': '_keydown($event)',
    '(blur)': '_blur()',
    '(focus)': '_focus()',
    '(input)': '_onInput()',
    '[id]': 'id',
    '[attr.disabled]': 'disabled && !disabledInteractive ? "" : null',
    '[attr.placeholder]': 'placeholder || null',
    '[attr.aria-invalid]':
      '_chipGrid && _chipGrid.ngControl ? _chipGrid.ngControl.invalid : null',
    '[attr.aria-required]': '_chipGrid && _chipGrid.required || null',
    '[attr.aria-disabled]': 'disabled && disabledInteractive ? "true" : null',
    '[attr.readonly]': '_getReadonlyAttribute()',
    '[attr.required]': '_chipGrid && _chipGrid.required || null',
  },
})
export class OuiChipInput implements OuiChipTextControl, OnChanges, OnDestroy {
  protected _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Whether the control is focused. */
  focused: boolean = false;

  /** Register input for chip list */
  readonly chipGridInput = input<OuiChipGrid | undefined>(undefined, {
    alias: 'ouiChipInputFor',
  });
  get chipGrid(): OuiChipGrid {
    return this._chipGrid;
  }
  set chipGrid(value: OuiChipGrid) {
    if (value) {
      this._chipGrid = value;
      this._chipGrid.registerInput(this);
    }
  }
  protected _chipGrid!: OuiChipGrid;

  /**
   * Whether or not the chipEnd event will be emitted when the input is blurred.
   */
  readonly addOnBlur = input(false, {
    alias: 'ouiChipInputAddOnBlur',
    transform: booleanAttribute,
  });

  /**
   * The list of key codes that will trigger a chipEnd event.
   *
   * Defaults to `[ENTER]`.
   */
  readonly separatorKeyCodesInput = input<
    readonly (number | SeparatorKey)[] | ReadonlySet<number | SeparatorKey>
  >(undefined, {
    alias: 'ouiChipInputSeparatorKeyCodes',
  });
  private _separatorKeyCodes:
    | readonly (number | SeparatorKey)[]
    | ReadonlySet<number | SeparatorKey>;
  get separatorKeyCodes() {
    return this.separatorKeyCodesInput() ?? this._separatorKeyCodes;
  }

  /** Emitted when a chip is to be added. */
  /* eslint-disable @angular-eslint/no-output-rename */
  readonly chipEnd = output<OuiChipInputEvent>({
    alias: 'ouiChipInputTokenEnd',
  });
  /* eslint-enable @angular-eslint/no-output-rename */

  /** The input's placeholder text. */
  readonly placeholderInput = input('', { alias: 'placeholder' });
  get placeholder(): string {
    return this.placeholderInput();
  }

  /** Unique id for the input. */
  readonly idInput = input(inject(_IdGenerator).getId('oui-chip-list-input-'), {
    alias: 'id',
  });
  get id(): string {
    return this.idInput();
  }

  /** Whether the input is disabled. */
  readonly disabledInput = input(false, { transform: booleanAttribute });
  get disabled(): boolean {
    return this.disabledInput() || (this._chipGrid && this._chipGrid.disabled);
  }

  /** Whether the input is readonly. */
  readonly readonly = input(false, { transform: booleanAttribute });

  /** Whether the input should remain interactive when it is disabled. */
  readonly disabledInteractiveInput = input<boolean | undefined>(undefined, {
    alias: 'ouiChipInputDisabledInteractive',
    transform: booleanAttribute,
  });
  private _disabledInteractive = false;
  get disabledInteractive(): boolean {
    return this.disabledInteractiveInput() ?? this._disabledInteractive;
  }

  /** Whether the input is empty. */
  get empty(): boolean {
    return !this.inputElement.value;
  }

  /** The native input element to which this directive is attached. */
  readonly inputElement!: HTMLInputElement;

  constructor() {
    const defaultOptions = inject<OuiChipsDefaultOptions>(
      OUI_CHIPS_DEFAULT_OPTIONS
    );

    this.inputElement = this._elementRef.nativeElement as HTMLInputElement;
    this._separatorKeyCodes = defaultOptions.separatorKeyCodes;
    this._disabledInteractive =
      defaultOptions.inputDisabledInteractive ?? false;
    effect(() => {
      const chipGrid = this.chipGridInput();
      if (chipGrid) {
        this.chipGrid = chipGrid;
      }
    });
  }

  ngOnChanges() {
    this._chipGrid?.stateChanges?.next();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {}

  /** Utility method to make host definition/tests more clear. */
  _keydown(event: KeyboardEvent) {
    if (this.empty && event.keyCode === BACKSPACE) {
      if (!event.repeat) {
        this._chipGrid._focusLastChip();
      }
      event.preventDefault();
    } else {
      this._emitChipEnd(event);
    }
  }

  /** Checks to see if the blur should emit the (chipEnd) event. */
  _blur() {
    if (this.addOnBlur()) {
      this._emitChipEnd();
    }
    this.focused = false;
    if (!this._chipGrid.focused) {
      this._chipGrid._blur();
    }
    this._chipGrid.stateChanges.next();
  }

  _focus() {
    this.focused = true;
    this._chipGrid.stateChanges.next();
  }

  /** Checks to see if the (chipEnd) event needs to be emitted. */
  _emitChipEnd(event?: KeyboardEvent) {
    if (
      !event ||
      (this._isSeparatorKey(event) && !event.repeat && !event.defaultPrevented)
    ) {
      this.chipEnd.emit({
        input: this.inputElement,
        value: this.inputElement.value,
        chipInput: this,
      });

      event?.preventDefault();
    }
  }

  _onInput() {
    this._chipGrid.stateChanges.next();
  }

  /** Focuses the input. */
  focus(): void {
    this.inputElement.focus();
  }

  /** Clears the input */
  clear(): void {
    this.inputElement.value = '';
  }

  /**
   * Implemented as part of OuiChipTextControl.
   * @docs-private
   */
  get describedByIds(): string[] {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute('aria-describedby');

    return existingDescribedBy?.split(' ') || [];
  }

  setDescribedByIds(ids: string[]): void {
    const element = this._elementRef.nativeElement;

    if (ids.length) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  }

  /** Checks whether a keycode is one of the configured separators. */
  private _isSeparatorKey(event: KeyboardEvent): boolean {
    if (!this.separatorKeyCodes) {
      return false;
    }

    for (const key of this.separatorKeyCodes) {
      let keyCode: number;
      let modifiers: readonly ModifierKey[] | null;

      if (typeof key === 'number') {
        keyCode = key;
        modifiers = null;
      } else {
        keyCode = key.keyCode;
        modifiers = key.modifiers;
      }

      const modifiersMatch = !modifiers?.length
        ? !hasModifierKey(event)
        : hasModifierKey(event, ...modifiers);

      if (keyCode === event.keyCode && modifiersMatch) {
        return true;
      }
    }

    return false;
  }

  /** Gets the value to set on the `readonly` attribute. */
  protected _getReadonlyAttribute(): string | null {
    return this.readonly() || (this.disabled && this.disabledInteractive)
      ? 'true'
      : null;
  }
}
