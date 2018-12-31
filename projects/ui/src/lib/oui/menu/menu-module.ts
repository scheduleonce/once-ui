import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiMenuContent } from './menu-content';
import { OuiMenu } from './menu-directive';
import { OuiMenuItem } from './menu-item';
import {
  OuiMenuTrigger,
  OUI_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './menu-trigger';

@NgModule({
  imports: [CommonModule, OverlayModule],
  exports: [OuiMenu, OuiMenuItem, OuiMenuTrigger, OuiMenuContent],
  declarations: [OuiMenu, OuiMenuItem, OuiMenuTrigger, OuiMenuContent],
  providers: [OUI_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class OuiMenuModule {}
