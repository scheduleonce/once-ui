import {
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  NgZone,
  inject,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';

/**
 * Possible states for a pseudo checkbox.
 *
 * @docs-private
 */
export type OuiPseudoCheckboxState = 'unchecked' | 'checked';

/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `oui-primary .oui-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<oui-checkbox>` and should *not* be used if the user would directly
 * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 *
 * @docs-private
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oui-pseudo-checkbox',
  styleUrls: ['pseudo-checkbox.scss'],
  template: '',
  host: {
    class: 'oui-pseudo-checkbox',
    '[class.oui-pseudo-checkbox-checked]': 'state === "checked"',
    '[class.oui-pseudo-checkbox-disabled]': 'disabled',
  },
  standalone: false,
})
export class OuiPseudoCheckbox implements OnDestroy {
  protected elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _focusMonitor = inject(FocusMonitor);
  private _ngZone = inject(NgZone);
  _animationMode? = inject(ANIMATION_MODULE_TYPE, { optional: true });

  /** Display state of the checkbox. */
  @Input() state: OuiPseudoCheckboxState = 'unchecked';

  /** Whether the checkbox is disabled. */
  @Input() disabled = false;
  private _monitorSubscription: Subscription = Subscription.EMPTY;

  constructor() {
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));
  }
  ngOnDestroy() {
    this._monitorSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this.elementRef);
  }
}
