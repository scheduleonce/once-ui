import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Directive } from '@angular/core';
import { OuiChipAction, OuiChipContent } from './chip-action';
import {
  OUI_CHIP_AVATAR,
  OUI_CHIP_EDIT,
  OUI_CHIP_REMOVE,
  OUI_CHIP_TRAILING_ICON,
} from './tokens';

/** Avatar image within a chip. */
@Directive({
  selector: 'oui-chip-avatar, [ouiChipAvatar]',
  host: {
    class: 'oui-chip-avatar oui-chip__icon oui-chip__icon--primary',
    role: 'img',
  },
  providers: [{ provide: OUI_CHIP_AVATAR, useExisting: OuiChipAvatar }],
})
export class OuiChipAvatar {}

/** Non-interactive trailing icon in a chip. */
@Directive({
  selector: 'oui-chip-trailing-icon, [ouiChipTrailingIcon]',
  host: {
    class: 'oui-chip-trailing-icon oui-chip__icon oui-chip__icon--trailing',
    'aria-hidden': 'true',
  },
  providers: [
    { provide: OUI_CHIP_TRAILING_ICON, useExisting: OuiChipTrailingIcon },
  ],
})
export class OuiChipTrailingIcon extends OuiChipContent {
  override _isPrimary = false;
}

/**
 * Directive to edit the parent chip when the leading action icon is clicked or
 * when the ENTER key is pressed on it.
 *
 * Example:
 *
 * ```
 * <oui-chip>
 *   <button ouiChipEdit aria-label="Edit">
 *     <oui-icon>edit</oui-icon>
 *   </button>
 * </oui-chip>
 * ```
 */
@Directive({
  selector: '[ouiChipEdit]',
  host: {
    class:
      'oui-chip-edit oui-chip-avatar oui-chip__icon oui-chip__icon--primary',
    role: 'button',
    '[attr.aria-hidden]': 'null',
  },
  providers: [{ provide: OUI_CHIP_EDIT, useExisting: OuiChipEdit }],
})
export class OuiChipEdit extends OuiChipAction {
  override _isPrimary = false;
  override _isLeading = true;

  override _handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip._edit(event);
    }
  }

  override _handleKeydown(event: KeyboardEvent) {
    if (
      (event.keyCode === ENTER || event.keyCode === SPACE) &&
      !this.disabled
    ) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip._edit(event);
    }
  }
}

/**
 * Directive to remove the parent chip when the trailing icon is clicked or
 * when the ENTER key is pressed on it.
 *
 * Example:
 *
 * ```
 * <oui-chip>
 *   <button ouiChipRemove aria-label="Remove">
 *     <oui-icon>close</oui-icon>
 *   </button>
 * </oui-chip>
 * ```
 */
@Directive({
  selector: '[ouiChipRemove]',
  host: {
    class:
      'oui-chip-remove oui-chip-trailing-icon oui-chip__icon oui-chip__icon--trailing',
    role: 'button',
    '[attr.aria-hidden]': 'null',
  },
  providers: [{ provide: OUI_CHIP_REMOVE, useExisting: OuiChipRemove }],
})
export class OuiChipRemove extends OuiChipAction {
  override _isPrimary = false;

  override _handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }

  override _handleKeydown(event: KeyboardEvent) {
    if (
      (event.keyCode === ENTER || event.keyCode === SPACE) &&
      !this.disabled
    ) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }
}
