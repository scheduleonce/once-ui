import { NgModule } from '@angular/core';
import { OuiPseudoCheckbox } from './pseudo-checkbox/pseudo-checkbox';

@NgModule({
  exports: [OuiPseudoCheckbox],
  declarations: [OuiPseudoCheckbox],
})
export class OuiPseudoCheckboxModule {}

export * from './pseudo-checkbox/pseudo-checkbox';
