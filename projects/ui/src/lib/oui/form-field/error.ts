/**
 * Error directive
 * Shows error messages
 */
import { Directive, Input } from '@angular/core';

let nextUniqueId = 0;

/** Single error message to be shown underneath the form field. */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'oui-error',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-error',
    role: 'alert',
    '[attr.id]': 'id'
  }
})
export class OuiError {
  @Input() id = `oui-error-${nextUniqueId++}`;
}
