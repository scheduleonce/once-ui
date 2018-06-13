import {
    Component,
    Input
} from '@angular/core';
import {OnceDialogConfig} from '../dialog-config';

/**
 * Header component that wraps content section
 */
@Component({
    selector: 'once-ui-dialog-content',
    templateUrl: 'dialog.content.component.html',
    host: {
        'class': 'onceUiDialogContent'
    }
})
export class DialogContentComponent {
    @Input() contentSettings: string;

    constructor(public _config: OnceDialogConfig) {
    }
}
