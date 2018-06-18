import {
  Component,
  Input
} from '@angular/core';
import {DialogService} from '../dialog.service';

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

  constructor(public dialog: DialogService) {
  }

  /**
   * Close event from header
   */
  close() {
    if(!this.modal) {
      this.dialog.close();
    }
  }
}
