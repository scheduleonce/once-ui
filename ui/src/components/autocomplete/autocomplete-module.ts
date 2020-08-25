import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { OuiOptionModule } from '../core/option/index';
import { OuiAutocomplete } from './autocomplete';
import {
  OuiAutocompleteTrigger,
  OUI_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './autocomplete-trigger';
import { OuiAutocompleteOrigin } from './autocomplete-origin';

@NgModule({
  imports: [OuiOptionModule, OverlayModule, CommonModule],
  exports: [
    OuiAutocomplete,
    OuiOptionModule,
    OuiAutocompleteTrigger,
    OuiAutocompleteOrigin,
  ],
  declarations: [
    OuiAutocomplete,
    OuiAutocompleteTrigger,
    OuiAutocompleteOrigin,
  ],
  providers: [OUI_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class OuiAutocompleteModule {}
