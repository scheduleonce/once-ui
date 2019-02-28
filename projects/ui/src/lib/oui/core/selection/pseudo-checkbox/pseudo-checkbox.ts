import {
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
  Inject,
  Optional
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

/**
 * Possible states for a pseudo checkbox.
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
    '[class.oui-pseudo-checkbox-disabled]': 'disabled'
  }
})
export class OuiPseudoCheckbox {
  /** Display state of the checkbox. */
  @Input() state: OuiPseudoCheckboxState = 'unchecked';

  /** Whether the checkbox is disabled. */
  @Input() disabled: boolean = false;

  constructor(
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string
  ) {}
}
