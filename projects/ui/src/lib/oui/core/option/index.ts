import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuiOption } from './option';
import { OuiOptgroup } from './optgroup';

@NgModule({
  imports: [CommonModule],
  exports: [OuiOption, OuiOptgroup],
  declarations: [OuiOption, OuiOptgroup]
})
export class OuiOptionModule {}

export * from './option';
export * from './optgroup';
