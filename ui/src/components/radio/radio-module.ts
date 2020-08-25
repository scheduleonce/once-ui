import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { ObserversModule } from '@angular/cdk/observers';
import { OuiRadioGroup, OuiRadioButton } from './radio';

@NgModule({
  declarations: [OuiRadioGroup, OuiRadioButton],
  imports: [CommonModule, ObserversModule, OverlayModule],
  exports: [OuiRadioGroup, OuiRadioButton],
})
export class OuiRadioModule {}
