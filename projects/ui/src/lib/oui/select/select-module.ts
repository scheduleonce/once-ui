import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { OuiOptionModule } from '../core/option/index';
import { OuiInputModule } from '../input/input-module';
import { FilterPipe } from './filter.pipe';
import { OuiSelectTrigger, OuiSelect } from './select.component';
import { OuiSelectSearchComponent } from './search/index';

@NgModule({
  imports: [OuiOptionModule, OverlayModule, OuiInputModule, CommonModule],
  exports: [
    OuiOptionModule,
    OuiSelectTrigger,
    OuiSelectSearchComponent,
    FilterPipe,
    OuiSelect
  ],
  declarations: [
    OuiSelectTrigger,
    OuiSelectSearchComponent,
    FilterPipe,
    OuiSelect
  ]
})
export class OuiSelectModule {}
