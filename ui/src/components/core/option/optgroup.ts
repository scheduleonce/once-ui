import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {
  CanDisable,
  CanDisableCtor,
  mixinDisabled
} from '../common-behaviors/disabled';

// Boilerplate for applying mixins to OuiOptgroup.
/** @docs-private */
export class OuiOptgroupBase {}
export const _OuiOptgroupMixinBase: CanDisableCtor &
  typeof OuiOptgroupBase = mixinDisabled(OuiOptgroupBase);

// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;

/**
 * Component that is used to group instances of `oui-option`.
 */
@Component({
  selector: 'oui-optgroup',
  exportAs: 'ouiOptgroup',
  templateUrl: 'optgroup.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled'],
  styleUrls: ['optgroup.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-optgroup',
    role: 'group',
    '[class.oui-optgroup-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-labelledby]': '_labelId'
  }
})
export class OuiOptgroup extends _OuiOptgroupMixinBase implements CanDisable {
  /** Label for the option group. */
  @Input()
  label: string;

  /** Unique id for the underlying label. */
  // tslint:disable-next-line:no-inferrable-types
  _labelId: string = `oui-optgroup-label-${_uniqueOptgroupIdCounter++}`;
}
