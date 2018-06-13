import {
  Component
} from '@angular/core';

/**
 * Internal component that wraps user-provided dialog content.
 */
@Component({
  selector: 'once-ui-dialog',
  templateUrl: 'dialog.component.html',
  host: {
    'class': 'onceUiDialogContainer',
    'tabindex': '-1'
  }
})
export class DialogComponent {
}
