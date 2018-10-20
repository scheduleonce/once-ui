import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { ProgressButtonComponent } from './progress-button/progress-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonComponent, ProgressButtonComponent],
  exports: [ButtonComponent, ProgressButtonComponent]
})
export class ButtonModule {}
