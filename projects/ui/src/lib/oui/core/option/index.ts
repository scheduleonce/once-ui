import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuiOption } from './option';
import { OuiOptgroup } from './optgroup';
import { OuiCheckboxModule } from '../../checkbox/checkbox.module';
import { OuiPseudoCheckboxModule } from '../selection/index';

@NgModule({
  imports: [CommonModule, OuiCheckboxModule, OuiPseudoCheckboxModule],
  exports: [OuiOption, OuiOptgroup],
  declarations: [OuiOption, OuiOptgroup]
})
export class OuiOptionModule {}

export * from './option';
export * from './optgroup';
