import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import { CanDisable, CanColor, CanDisableCtor, CanColorCtor, mixinColor, mixinDisabled } from '../core';

/**
 * List of classes to add to Button instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
    'oui-button',
    'oui-ghost-button',
    'oui-link-button',
    'oui-icon-button'
];

/** Default color palette for round buttons (mat-fab and mat-mini-fab) */
const DEFAULT_COLOR = 'primary';

// Boilerplate for applying mixins to OuiButton.
/** @docs-private */
export class OuiButtonBase {
    constructor(public _elementRef: ElementRef) { }
}

export const OuiButtonMixinBase:
    CanDisableCtor & CanColorCtor & typeof OuiButtonBase =
    mixinColor(mixinDisabled(OuiButtonBase));

/**
 * Once Ui button.
 */
@Component({
    selector: `button[oui-button], button[oui-ghost-button], button[oui-link-button],
               button[oui-icon-button]`,
    exportAs: 'ouiButton',
    host: {
        '[disabled]': 'disabled || null',
    },
    templateUrl: 'button.html',
    styleUrls: ['button.scss'],
    inputs: ['disabled', 'color'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OuiButton extends OuiButtonMixinBase implements OnDestroy, CanDisable, CanColor {

    constructor(private elementRef: ElementRef) {
        super(elementRef);
        this.addClass();
    }

    addClass() {
        for (const attr of BUTTON_HOST_ATTRIBUTES) {
            if (this.hasHostAttributes(attr)) {
                (this.elementRef.nativeElement as HTMLElement).classList.add(attr);
            }
        }
        if(!this.color){
            this.color = DEFAULT_COLOR;
        }
    }

    getHostElement() {
        return this.elementRef.nativeElement;
    }
    /** Gets whether the button has one of the given attributes. */
    hasHostAttributes(...attributes: string[]) {
        return attributes.some(attribute => this.getHostElement().hasAttribute(attribute));
    }

    ngOnDestroy() {

    }
}


/**
 * Once UI anchor.
 */
@Component({
    selector: `a[oui-button], a[oui-ghost-button], a[oui-link-button],
    a[oui-icon-button]`,
    exportAs: 'ouiButton, ouiAnchor',
    host: {
        '[attr.disabled]': 'disabled || null',
        '[attr.aria-disabled]': 'disabled.toString()',
        '(click)': '_haltDisabledEvents($event)',
    },
    inputs: ['disabled', 'color'],
    templateUrl: 'button.html',
    styleUrls: ['button.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OuiAnchor extends OuiButton {

    constructor(
        elementRef: ElementRef) {
        super(elementRef);
    }

    _haltDisabledEvents(event: Event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
}
