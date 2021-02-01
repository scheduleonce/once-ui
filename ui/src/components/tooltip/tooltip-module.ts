import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { ObserversModule } from '@angular/cdk/observers';
import {
  OuiTooltip,
  TooltipComponent,
  OUI_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './tooltip';

@NgModule({
  declarations: [OuiTooltip, TooltipComponent],
  imports: [CommonModule, ObserversModule, OverlayModule],
  exports: [TooltipComponent, OuiTooltip],
  providers: [OUI_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class OuiTooltipModule {}
