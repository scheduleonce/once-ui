import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ObserversModule } from '@angular/cdk/observers';
import { OuiSlideToggle } from './slide-toggle';

@NgModule({
  declarations: [OuiSlideToggle],
  imports: [CommonModule, ObserversModule],
  exports: [OuiSlideToggle],
})
export class OuiSlideToggleModule {}
