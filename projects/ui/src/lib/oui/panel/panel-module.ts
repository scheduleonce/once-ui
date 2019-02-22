import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiPanelContent } from './panel-content';
import { OuiPanel, OuiPanelIcon } from './panel';
import {
  OuiPanelTrigger,
  OUI_PANEL_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './panel-trigger';

@NgModule({
  imports: [CommonModule, OverlayModule],
  exports: [OuiPanel, OuiPanelTrigger, OuiPanelContent, OuiPanelIcon],
  declarations: [OuiPanel, OuiPanelTrigger, OuiPanelContent, OuiPanelIcon],
  providers: [OUI_PANEL_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class OuiPanelModule {}
