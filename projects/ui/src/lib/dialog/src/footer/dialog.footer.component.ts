import { Component, Input, ViewEncapsulation } from '@angular/core';
import { OnceDialogConfig } from '../dialog-config';
import { DialogService } from '../dialog.service';

/**
 * Header component that wraps footer section
 */
@Component({
  selector: 'once-ui-dialog-footer',
  templateUrl: 'dialog.component.footer.html',
  styleUrls: ['./dialog.footer.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'onceUiDialogFooter'
  },
  encapsulation: ViewEncapsulation.None
})
export class DialogFooterComponent {
  @Input()
  footerSettings: any;

  constructor(public _config: OnceDialogConfig, public dialog: DialogService) {}

  /**
   * Close event from footer
   */
  close() {
    this.dialog.close();
  }

  /**
   * Get obj keys
   */
  getKeys(obj) {
    return Object.keys(obj);
  }
}
