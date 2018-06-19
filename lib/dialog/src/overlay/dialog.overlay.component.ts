import {
  Component,
  Input, HostListener, Inject
} from '@angular/core';
import {DialogService} from '../dialog.service';
import {DOCUMENT} from "@angular/platform-browser";

/**
 * Header component that wraps header section
 */
@Component({
  selector: 'once-ui-dialog-overlay',
  templateUrl: 'dialog.component.overlay.html',
  host: {
    'class': 'onceUiDialogHeader'
  }
})
export class DialogOverlayComponent {
  @Input() modal: boolean;
  @Input() escape: boolean;

  constructor(public dialog: DialogService, @Inject(DOCUMENT) private document) {
  }

  /**
   * On escape close
   * @param event
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      if (this.escape) {
        this.dialog.close();
      }
    }
  }

  /**
   * Close event from header
   */
  close() {
    if (!this.modal) {
      this.dialog.close();
    }
  }
}
