/**
 * Error directive
 * Shows error messages
 */
import { Directive, Input } from '@angular/core';

let nextUniqueId = 0;

/** Single error message to be shown underneath the form field. */
@Directive({
  selector: 'oui-error',

  host: {
    class: 'oui-error',
    role: 'alert',
    '[attr.id]': 'id',
  },
})
export class OuiError {
  @Input() id = `oui-error-${nextUniqueId++}`;
}
