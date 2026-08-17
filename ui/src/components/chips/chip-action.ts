import {
  Directive,
  ElementRef,
  Input,
  booleanAttribute,
  numberAttribute,
  inject,
} from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { OUI_CHIP } from './tokens';

/**
 * A non-interactive section of a chip.
 * @docs-private
 */
@Directive({
  selector: '[ouiChipContent]',
  host: {
    class: 'oui-chip-action oui-chip-action--presentational',
    '[class.oui-chip-action--primary]': '_isPrimary',
    '[class.oui-chip-action--secondary]': '!_isPrimary',
    '[class.oui-chip-action--trailing]': '!_isPrimary && !_isLeading',
    '[attr.disabled]': '_getDisabledAttribute()',
    '[attr.aria-disabled]': 'disabled',
  },
})
export class OuiChipContent {
  _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _parentChip = inject<{
    _handlePrimaryActionInteraction(): void;
    remove(): void;
    disabled: boolean;
    _edit(event: Event): void;
    _isEditing?: boolean;
  }>(OUI_CHIP);

  /** Whether this is the primary action in the chip. */
  _isPrimary = true;

  /** Whether this is the leading action in the chip. */
  _isLeading = false;

  /** Whether the action is disabled. */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled || this._parentChip?.disabled || false;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled = false;

  /** Tab index of the action. */
  @Input({
    transform: (value: unknown) =>
      value == null ? -1 : numberAttribute(value),
  })
  tabIndex: number = -1;

  /**
   * Private API to allow focusing this chip when it is disabled.
   */
  @Input()
  _allowFocusWhenDisabled = false;

  /**
   * Determine the value of the disabled attribute for this chip action.
   */
  protected _getDisabledAttribute(): string | null {
    return this.disabled && !this._allowFocusWhenDisabled ? '' : null;
  }

  constructor() {
    if (this._elementRef.nativeElement.nodeName === 'BUTTON') {
      this._elementRef.nativeElement.setAttribute('type', 'button');
    }
  }

  focus() {
    this._elementRef.nativeElement.focus();
  }
}

/**
 * Interactive section of a chip.
 * @docs-private
 */
@Directive({
  selector: '[ouiChipAction]',
  host: {
    '[attr.tabindex]': '_getTabindex()',
    '[class.oui-chip-action--presentational]': 'false',
    '(click)': '_handleClick($event)',
    '(keydown)': '_handleKeydown($event)',
  },
})
export class OuiChipAction extends OuiChipContent {
  /**
   * Determine the value of the tabindex attribute for this chip action.
   */
  protected _getTabindex(): string | null {
    return this.disabled && !this._allowFocusWhenDisabled
      ? null
      : this.tabIndex.toString();
  }

  _handleClick(event: MouseEvent) {
    if (!this.disabled && this._isPrimary) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }

  _handleKeydown(event: KeyboardEvent) {
    if (
      (event.keyCode === ENTER || event.keyCode === SPACE) &&
      !this.disabled &&
      this._isPrimary &&
      !this._parentChip._isEditing
    ) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }
}
