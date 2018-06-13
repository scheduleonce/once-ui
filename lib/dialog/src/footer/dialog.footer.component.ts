import {
    Component,
    Input
} from '@angular/core';
import {OnceDialogConfig} from '../dialog-config';

/**
 * Header component that wraps footer section
 */
@Component({
    selector: 'once-ui-dialog-footer',
    templateUrl: 'dialog.component.footer.html',
    host: {
        'class': 'onceUiDialogFooter'
    }
})
export class DialogFooterComponent {
    @Input() footerSettings: string;

    constructor(public _config: OnceDialogConfig) {
    }
}
