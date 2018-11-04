import {
    Component,
    ComponentRef,
    EmbeddedViewRef,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    BasePortalOutlet,
    ComponentPortal,
    CdkPortalOutlet,
    TemplatePortal
} from '@angular/cdk/portal';
import { OuiDialogConfig } from './dialog-config';


/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwOuiDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}

/**
 * Internal component that wraps user-provided dialog content.
 * @docs-private
 */
@Component({
    selector: 'oui-dialog-container',
    templateUrl: 'dialog-container.html',
    styleUrls: ['dialog.css'],
    encapsulation: ViewEncapsulation.None,
    // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    host: {
        'class': 'oui-dialog-container',
        'tabindex': '-1',
        'aria-modal': 'true',
        '[attr.id]': '_id',
        '[attr.role]': '_config.role',
        '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
        '[attr.aria-label]': '_config.ariaLabel',
        '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    },
})
export class OuiDialogContainer extends BasePortalOutlet {
    /** The portal outlet inside of this container into which the dialog content will be loaded. */
    @ViewChild(CdkPortalOutlet) _portalOutlet: CdkPortalOutlet;

    /** ID of the element that should be considered as the dialog's label. */
    _ariaLabelledBy: string | null = null;

    /** ID for the container DOM element. */
    _id: string;

    constructor(
        public _config: OuiDialogConfig) {
        super();
    }

    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        if (this._portalOutlet.hasAttached()) {
            throwOuiDialogContentAlreadyAttachedError();
        }
        return this._portalOutlet.attachComponentPortal(portal);
    }

    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
        if (this._portalOutlet.hasAttached()) {
            throwOuiDialogContentAlreadyAttachedError();
        }
        return this._portalOutlet.attachTemplatePortal(portal);
    }

}
