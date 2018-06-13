import {
  Component,
  Input
} from '@angular/core';
import {OnceDialogConfig} from '../dialog-config';
import {DialogService} from '../dialog.service';

/**
 * Header component that wraps header section
 */
@Component({
  selector: 'once-ui-dialog-header',
  templateUrl: 'dialog.component.header.html',
  host: {
    'class': 'onceUiDialogHeader'
  }
})
export class DialogHeaderComponent {
  @Input() headerSettings: any;
  _config: any;

  constructor(public _settings: OnceDialogConfig, public dialog: DialogService) {
    this._config = _settings.header;
  }

  /**
   * Close event from header
   */
  close() {
    this.dialog.close();
  }
}
