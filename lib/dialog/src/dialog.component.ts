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
    moduleId: module.id,
    'class': 'onceUiDialogContainer',
    'tabindex': '-1',
    '[attr.id]': '_id',
    '[attr.aria-label]': '_config.ariaLabel',
  }
})
export class DialogComponent {
  custom: any = {};
  system: any = {};
  dialog:any;

  /**
   * @whatIsThisFor: System settings are for dialog internal use
   */
  constructor() {
    this.system = OnceDialogConfig;
    this.dialog = DialogService
  }

  ngOnInit() {
    debugger
    console.log("I am in component.@.11");
    this.custom = {header: 'rere', content: 'ss', footer: 'pppppppp'};
  }

  open() {
    debugger;
    this.ngOnInit();
  }
}
