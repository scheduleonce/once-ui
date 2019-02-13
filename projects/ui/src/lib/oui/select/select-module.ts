import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiOptionModule } from '../core';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { FilterPipe } from './filter.pipe';
import {
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

import { OuiSelect, OuiSelectTrigger } from './select';
import { OuiSelectSearchComponent } from './search';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    OuiOptionModule,
    PerfectScrollbarModule
  ],
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
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class OuiSelectModule {}
