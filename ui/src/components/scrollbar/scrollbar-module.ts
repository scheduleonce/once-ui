import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuiScrollbar } from './scrollbar';

@NgModule({
  imports: [CommonModule],
  declarations: [OuiScrollbar],
  exports: [OuiScrollbar]
})
export class OuiScrollbarModule {}
