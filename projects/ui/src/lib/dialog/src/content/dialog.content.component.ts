import { Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Header component that wraps content section
 */
@Component({
  selector: 'once-ui-dialog-content',
  templateUrl: 'dialog.content.component.html',
  styleUrls: ['./dialog.content.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'onceUiDialogContent'
  },
  encapsulation: ViewEncapsulation.None
})
export class DialogContentComponent {
  @Input()
  content: string;
  constructor() {}
}
