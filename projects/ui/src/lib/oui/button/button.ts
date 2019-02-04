import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import {
  CanDisable,
  CanColor,
  CanDisableCtor,
  CanColorCtor,
  mixinColor,
  mixinDisabled
} from '../core';

import { CanProgress, CanProgressCtor, mixinProgress } from './progress';

/**
 * List of classes to add to Button instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'oui-button',
  'oui-ghost-button',
  'oui-link-button',
  'oui-icon-button',
  'oui-icon-text-button'
];

/** Default color palette for round buttons (mat-fab and mat-mini-fab) */
const DEFAULT_COLOR = 'primary';

// Boilerplate for applying mixins to OuiButton.
/** @docs-private */
export class OuiButtonBase {
  constructor(public _elementRef: ElementRef) {}
}

export const OuiButtonMixinBase: CanDisableCtor &
  CanColorCtor &
  CanProgressCtor &
  typeof OuiButtonBase = mixinProgress(
  mixinColor(mixinDisabled(OuiButtonBase))
);

/**
 * Once Ui button.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: `button[oui-button], button[oui-ghost-button], button[oui-link-button], button[oui-icon-button],
               button[oui-icon-text-button]`,
  exportAs: 'ouiButton',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[disabled]': 'disabled || null'
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled', 'color', 'progress'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OuiButton extends OuiButtonMixinBase
  implements OnDestroy, CanDisable, CanColor, CanProgress {
  constructor(protected elementRef: ElementRef) {
    super(elementRef);
    this.addClass();
  }

  protected addClass() {
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this.hasHostAttributes(attr)) {
        (this.elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }
    if (!this.color) {
      this.color = DEFAULT_COLOR;
    }
  }
  
  /** Focuses the button. */
  focus(): void {
    this.getHostElement().focus();
  }

  getHostElement() {
    return this.elementRef.nativeElement;
  }
  /** Gets whether the button has one of the given attributes. */
  hasHostAttributes(...attributes: string[]) {
    return attributes.some(attribute =>
      this.getHostElement().hasAttribute(attribute)
    );
  }

  ngOnDestroy() {}
}

/**
 * Once UI anchor.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: `a[oui-button], a[oui-ghost-button], a[oui-link-button], a[oui-icon-button],
    a[oui-icon-text-button]`,
  exportAs: 'ouiButton, ouiAnchor',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_haltDisabledEvents($event)'
  },
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled', 'color'],
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OuiAnchor extends OuiButton {
  constructor(elementRef: ElementRef) {
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
