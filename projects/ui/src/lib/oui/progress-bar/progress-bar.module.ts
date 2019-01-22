import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuiProgressBar } from './progress-bar';

@NgModule({
  imports: [CommonModule],
  exports: [OuiProgressBar],
  declarations: [OuiProgressBar]
})
export class OuiProgressBarModule {}
