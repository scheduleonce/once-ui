import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';

@NgModule({
  imports: [CommonModule],
  exports: [TooltipDirective, TooltipComponent],
  entryComponents: [TooltipComponent],
  declarations: [TooltipDirective, TooltipComponent]
})
export class TooltipModule {}
