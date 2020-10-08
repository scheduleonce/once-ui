import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuiProgressSpinner } from './progress-spinner';

@NgModule({
  imports: [CommonModule],
  declarations: [OuiProgressSpinner],
  exports: [OuiProgressSpinner],
})
export class OuiProgressSpinnerModule {}
