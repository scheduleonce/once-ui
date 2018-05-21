import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownComponent } from './drop-down.component';
import { FilterPipe } from './filter.pipe';
import { KeysPipe } from './keys.pipe';
import { DecodePipe } from './html.pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule
  ],
  exports: [
    DropDownComponent,
    // pipes
    FilterPipe,
    DecodePipe,
    KeysPipe
  ],
  declarations: [
    DropDownComponent,
    // pipes
    FilterPipe,
    DecodePipe,
    KeysPipe
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class DropDownModule{ }
