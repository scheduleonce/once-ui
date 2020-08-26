import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiMenuContent } from './menu-content';
import { OuiMenu } from './menu-directive';
import { OuiMenuItem } from './menu-item';
import {
  OuiMenuTrigger,
  OUI_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './menu-trigger';
import { OuiMenuIcon } from './menu-icon';
import { OuiIconModule } from '../icon/icon.module';

@NgModule({
  imports: [CommonModule, OverlayModule, OuiIconModule],
  exports: [OuiMenu, OuiMenuItem, OuiMenuTrigger, OuiMenuContent, OuiMenuIcon],
  declarations: [
    OuiMenu,
    OuiMenuItem,
    OuiMenuTrigger,
    OuiMenuContent,
    OuiMenuIcon,
  ],
  providers: [OUI_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class OuiMenuModule {}
