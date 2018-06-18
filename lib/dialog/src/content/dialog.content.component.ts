import {
  Component,
  Input
} from '@angular/core';

/**
 * Header component that wraps content section
 */
@Component({
    selector: 'once-ui-dialog-content',
    templateUrl: 'dialog.content.component.html',
    styleUrls: ['./dialog.content.component.scss'],
    host: {
        'class': 'onceUiDialogContent'
    }
})
export class DialogContentComponent {
    @Input() content: string;
    constructor() {
    }
}

