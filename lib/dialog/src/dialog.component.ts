import {
  Component
} from '@angular/core';
import {OnceDialogConfig} from './dialog-config';
import {DialogService} from './dialog.service';


/**
 * Internal component that wraps user-provided dialog content.
 */
@Component({
  selector: 'once-ui-dialog',
  templateUrl: './dialog.component.html',
  host: {
    'class': 'onceUiDialogContainer',
    'tabindex': '-1'
  }
})
export class DialogComponent {
  system: any = {};
  dialog:any;

  /**
   * @whatIsThisFor: System settings are for dialog internal use
   */
  constructor() {
    this.system = OnceDialogConfig;
    this.dialog = DialogService;
  }
}
