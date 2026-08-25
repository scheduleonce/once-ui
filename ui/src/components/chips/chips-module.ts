import { ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { ErrorStateMatcher } from '../core';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiPseudoCheckboxModule } from '../core/selection/index';
import { OuiChip } from './chip';
import { OuiChipAction, OuiChipContent } from './chip-action';
import { OUI_CHIPS_DEFAULT_OPTIONS, OuiChipsDefaultOptions } from './tokens';
import { OuiChipGrid } from './chip-grid';
import {
  OuiChipAvatar,
  OuiChipEdit,
  OuiChipRemove,
  OuiChipTrailingIcon,
} from './chip-icons';
import { OuiChipEditInput } from './chip-edit-input';
import { OuiChipInput } from './chip-input';
import { OuiChipRow } from './chip-row';
import { OuiChipSet } from './chip-set';
import { ChipsOption } from './chips-option';
import { ChipsAutocomplete } from './chips-autocomplete';
import {
  ChipsAutocompleteTrigger,
  CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './chips-autocomplete-trigger';

const CHIP_DECLARATIONS = [
  OuiChip,
  OuiChipAvatar,
  OuiChipEdit,
  OuiChipEditInput,
  OuiChipGrid,
  OuiChipInput,
  OuiChipRemove,
  OuiChipRow,
  OuiChipSet,
  OuiChipTrailingIcon,
];

const CHIPS_AUTOCOMPLETE_DECLARATIONS = [
  ChipsOption,
  ChipsAutocomplete,
  ChipsAutocompleteTrigger,
];

@NgModule({
  imports: [
    CommonModule,
    OuiFormFieldModule,
    OuiPseudoCheckboxModule,
    OverlayModule,
    OuiChipAction,
    OuiChipContent,
    CHIP_DECLARATIONS,
  ],
  declarations: CHIPS_AUTOCOMPLETE_DECLARATIONS,
  exports: [
    OuiFormFieldModule,
    CHIP_DECLARATIONS,
    CHIPS_AUTOCOMPLETE_DECLARATIONS,
  ],
  providers: [
    ErrorStateMatcher,
    CHIPS_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
    {
      provide: OUI_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER],
      } as OuiChipsDefaultOptions,
    },
  ],
})
export class OuiChipsModule {}
