import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiAnchor, OuiButton, OuiProgressButton } from './button';

@NgModule({
  imports: [CommonModule],
  exports: [OuiButton, OuiAnchor, OuiProgressButton],
  declarations: [OuiButton, OuiAnchor, OuiProgressButton]
})
export class OuiButtonModule {}
