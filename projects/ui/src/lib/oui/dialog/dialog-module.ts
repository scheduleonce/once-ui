import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { OUI_DIALOG_SCROLL_STRATEGY_PROVIDER, OuiDialog } from './dialog';
import { OuiDialogContainer } from './dialog-container';
import { DialogScrollStrategy } from './dialog-scroll-strategy';
import {
  OuiDialogHeader,
  OuiDialogContent,
  OuiDialogFooter,
  OuiDialogHeaderAction,
  OuiDialogHeaderArticle,
  OuiDialogHeaderClose,
  OuiDialogHeaderTitle,
  OuiDialogHeaderVideo,
  OuiDialogClose,
  OuiDialogHeaderSeparator,
  OuiDialogFooterActionLeft,
  OuiDialogFooterActionRight,
  OuiDialogHeaderImage
} from './dialog-content';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, ScrollDispatchModule],
  exports: [
    OuiDialogContainer,
    OuiDialogHeader,
    OuiDialogHeaderImage,
    OuiDialogContent,
    OuiDialogFooter,
    OuiDialogHeaderAction,
    OuiDialogHeaderArticle,
    OuiDialogHeaderClose,
    OuiDialogHeaderTitle,
    OuiDialogHeaderVideo,
    OuiDialogClose,
    OuiDialogHeaderSeparator,
    OuiDialogFooterActionLeft,
    OuiDialogFooterActionRight
  ],
  declarations: [
    OuiDialogContainer,
    OuiDialogHeader,
    OuiDialogHeaderImage,
    OuiDialogContent,
    OuiDialogFooter,
    OuiDialogHeaderAction,
    OuiDialogHeaderArticle,
    OuiDialogHeaderClose,
    OuiDialogHeaderTitle,
    OuiDialogHeaderVideo,
    OuiDialogClose,
    OuiDialogHeaderSeparator,
    OuiDialogFooterActionLeft,
    OuiDialogFooterActionRight
  ],
  providers: [
    OuiDialog,
    DialogScrollStrategy,
    OUI_DIALOG_SCROLL_STRATEGY_PROVIDER
  ],
  entryComponents: [OuiDialogContainer]
})
export class OuiDialogModule {}
