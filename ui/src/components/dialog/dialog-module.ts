import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
  OuiDialogHeaderImage,
} from './dialog-content';
import { OuiIconModule } from '../icon/icon.module';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, OuiIconModule],
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
    OuiDialogFooterActionRight,
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
    OuiDialogFooterActionRight,
  ],
  providers: [
    OuiDialog,
    DialogScrollStrategy,
    OUI_DIALOG_SCROLL_STRATEGY_PROVIDER,
  ],
})
export class OuiDialogModule {}
