import {
  Component,
  Input,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { DialogService } from '../dialog.service';

/**
 * Header component that wraps header section
 */
@Component({
  selector: 'once-ui-dialog-overlay',
  templateUrl: 'dialog.component.overlay.html',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'onceUiDialogHeader'
  },
  encapsulation: ViewEncapsulation.None
})
export class DialogOverlayComponent {
  @Input()
  modal: boolean;
  @Input()
  escape: boolean;

  constructor(public dialog: DialogService) {}

  /**
   * On escape close
   * @param event
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
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
