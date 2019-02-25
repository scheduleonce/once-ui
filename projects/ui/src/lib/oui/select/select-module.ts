import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiOptionModule } from '../core';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiInputModule } from '../input/input-module';
import { FilterPipe } from './filter.pipe';
import { OuiSelect, OuiSelectTrigger } from './select';
import { OuiSelectSearchComponent } from './search';
@NgModule({
  imports: [CommonModule, OverlayModule, OuiOptionModule, OuiInputModule],
  exports: [
    OuiFormFieldModule,
    OuiSelect,
    OuiSelectTrigger,
    OuiOptionModule,
    OuiSelectSearchComponent,
    FilterPipe
  ],
  declarations: [
    OuiSelect,
    OuiSelectTrigger,
    OuiSelectSearchComponent,
    FilterPipe
  ]
})
export class OuiSelectModule {}
