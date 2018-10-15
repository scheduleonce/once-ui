import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelComponent } from './overlay-panel.component';

@NgModule({
  imports: [CommonModule],
  declarations: [OverlayPanelComponent],
  exports: [OverlayPanelComponent]
})
export class OverlayPanelModule {}
