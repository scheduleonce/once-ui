import {
    Component,
    Input
} from '@angular/core';
import {OnceDialogConfig} from '../dialog-config';

/**
 * Header component that wraps header section
 */
@Component({
    selector: 'once-ui-dialog-header',
    templateUrl: './dialog.component.header.html',
    host: {
        'class': 'onceUiDialogHeader'
    }
})
export class DialogHeaderComponent {
    @Input() headerSettings: string;

    constructor(public _config: OnceDialogConfig) {
    }
}
