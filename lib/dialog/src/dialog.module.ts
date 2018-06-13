/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogHeaderComponent } from './header/dialog.header.component';
import { DialogFooterComponent } from './footer/dialog.footer.component';
import { DialogContentComponent } from './content/dialog.content.component';
import { OnceDialogConfig } from './dialog-config';

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
    DialogContentComponent
  ],
  entryComponents: [DialogComponent],
  providers: [OnceDialogConfig]
})
export class DialogModule {}
