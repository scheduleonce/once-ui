/**
 * Dialog module
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogHeaderComponent } from './header/dialog.header.component';
import { DialogFooterComponent } from './footer/dialog.footer.component';
import { DialogContentComponent } from './content/dialog.content.component';
import { DialogOverlayComponent } from './overlay/dialog.overlay.component';
import { OnceDialogConfig } from './dialog-config';
import { FocusTrapFactory, InteractivityChecker, FocusMonitor } from '@angular/cdk/a11y'
import { Platform } from '@angular/cdk/platform';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DialogComponent
  ],
  declarations: [
    DialogComponent,
    DialogHeaderComponent,
    DialogFooterComponent,
    DialogContentComponent,
    DialogOverlayComponent
  ],
  entryComponents: [DialogComponent],
  providers: [OnceDialogConfig, FocusTrapFactory, InteractivityChecker, Platform, FocusMonitor]
})
export class DialogModule {}