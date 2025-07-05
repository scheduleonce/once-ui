import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  Input,
  inject,
} from '@angular/core';
import {
  CanDisable,
  CanColor,
  CanDisableCtor,
  CanColorCtor,
  mixinColor,
  mixinDisabled,
} from '../core';

import { CanProgress, CanProgressCtor, mixinProgress } from './progress';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
/**
 * List of classes to add to Button instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'oui-button',
  'oui-ghost-button',
  'oui-link-button',
  'oui-icon-button',
  'oui-icon-text-button',
];

/** Default color palette for round buttons (oui-fab and oui-mini-fab) */
const DEFAULT_COLOR = 'primary';

// Boilerplate for applying mixins to OuiButton.
/** @docs-private */
export class OuiButtonBase {
  public _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public _cdr = inject(ChangeDetectorRef);
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
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: `button[oui-button], button[oui-ghost-button], button[oui-link-button], button[oui-icon-button],
               button[oui-icon-text-button]`,
  exportAs: 'ouiButton',
  host: {
    '[disabled]': 'disabled || null',
    '[tabindex]': 'tabIndex || 0',
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'color', 'progress', 'tabIndex'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class OuiButton
  extends OuiButtonMixinBase
  implements OnDestroy, CanDisable, CanColor, CanProgress
{
  protected elementRef: ElementRef<HTMLElement>;
  private _focusMonitor = inject(FocusMonitor);
  _cdr: ChangeDetectorRef;
  private _ngZone = inject(NgZone);

  private _monitorSubscription: Subscription = Subscription.EMPTY;

  constructor() {
    super();
    this.elementRef = this._elementRef;

    this.addClass();
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() =>
        this._ngZone.run(() => {
          this._cdr.markForCheck();
        })
      );
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

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this.elementRef);
    this._monitorSubscription.unsubscribe();
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
    return attributes.some((attribute) =>
      this.getHostElement().hasAttribute(attribute)
    );
  }
}

/**
 * Once UI anchor.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: `a[oui-button], a[oui-ghost-button], a[oui-link-button], a[oui-icon-button],
    a[oui-icon-text-button]`,
  exportAs: 'ouiButton, ouiAnchor',
  host: {
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex || 0)',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_haltDisabledEvents($event)',
  },
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'color'],
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class OuiAnchor extends OuiButton {
  /** Tabindex of the button. */
  @Input() tabIndex: number;

  constructor() {
    super();
  }

  _haltDisabledEvents(event: Event) {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
