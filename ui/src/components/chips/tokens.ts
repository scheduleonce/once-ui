import { ENTER, ModifierKey } from '@angular/cdk/keycodes';
import { InjectionToken } from '@angular/core';
import type { OuiChip } from './chip';

/** Key that can be used as a separator between chips. */
export interface SeparatorKey {
  keyCode: number;
  modifiers: readonly ModifierKey[];
}

/** Default options, for the chips module, that can be overridden. */
export interface OuiChipsDefaultOptions {
  /** The list of key codes that will trigger a chipEnd event. */
  separatorKeyCodes:
    | readonly (number | SeparatorKey)[]
    | ReadonlySet<number | SeparatorKey>;

  /** Whether icon indicators should be hidden for single-selection. */
  hideSingleSelectionIndicator?: boolean;

  /** Whether the chip input should be interactive while disabled by default. */
  inputDisabledInteractive?: boolean;
}

/** Injection token to be used to override the default options for the chips module. */
export const OUI_CHIPS_DEFAULT_OPTIONS =
  new InjectionToken<OuiChipsDefaultOptions>('oui-chips-default-options', {
    providedIn: 'root',
    factory: () => ({
      separatorKeyCodes: [ENTER],
    }),
  });

/**
 * Injection token that can be used to reference instances of `OuiChipAvatar`. It serves as
 * alternative token to the actual `OuiChipAvatar` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const OUI_CHIP_AVATAR = new InjectionToken('OuiChipAvatar');

/**
 * Injection token that can be used to reference instances of `OuiChipTrailingIcon`. It serves as
 * alternative token to the actual `OuiChipTrailingIcon` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const OUI_CHIP_TRAILING_ICON = new InjectionToken('OuiChipTrailingIcon');

/**
 * Injection token that can be used to reference instances of `OuiChipEdit`. It serves as
 * alternative token to the actual `OuiChipEdit` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const OUI_CHIP_EDIT = new InjectionToken('OuiChipEdit');

/**
 * Injection token that can be used to reference instances of `OuiChipRemove`. It serves as
 * alternative token to the actual `OuiChipRemove` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const OUI_CHIP_REMOVE = new InjectionToken('OuiChipRemove');

/**
 * Injection token used to avoid a circular dependency between the `OuiChip` and `OuiChipAction`.
 */
export const OUI_CHIP = new InjectionToken<OuiChip>('OuiChip');
