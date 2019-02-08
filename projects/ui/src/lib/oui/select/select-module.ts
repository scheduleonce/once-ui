import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { OuiOptionModule } from '../core';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import {OUI_SELECT_SCROLL_STRATEGY_PROVIDER, OuiSelect, OuiSelectTrigger} from './select';
import {OuiSelectSearchComponent} from './search';
import {NoSanitizePipe} from './sanitize';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    OuiOptionModule
  ],
  exports: [OuiFormFieldModule, OuiSelect, OuiSelectTrigger, OuiOptionModule, OuiSelectSearchComponent],
  declarations: [OuiSelect, OuiSelectTrigger, OuiSelectSearchComponent, NoSanitizePipe],
  providers: [OUI_SELECT_SCROLL_STRATEGY_PROVIDER]
})
export class OuiSelectModule {}
