import { Component, Input } from '@angular/core';
import { OnceDialogConfig } from '../dialog-config';
import { DialogService } from '../dialog.service';

/**
 * Header component that wraps header section
 */
@Component({
  selector: 'once-ui-dialog-header',
  templateUrl: 'dialog.component.header.html',
  styleUrls: ['./dialog.header.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'onceUiDialogHeader'
  }
})
export class DialogHeaderComponent {
  @Input()
  headerSettings: any;
  _config: any;

  constructor(
    public _settings: OnceDialogConfig,
    public dialog: DialogService
  ) {
    this._config = _settings.header;
  }

  /**
   * Close event from header
   */
  close() {
    this.dialog.close();
  }

  /**
   * Close dialog
   * @param event
   */
  closeDialog(event) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      event.preventDefault();
      this.dialog.close();
    }
  }
}
