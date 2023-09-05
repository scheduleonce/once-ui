/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef} from '@angular/core';
import {mixinInkBarItem} from './ink-bar';
import {CanDisable, mixinDisabled} from '../core';

// Boilerplate for applying mixins to MatTabLabelWrapper.
/** @docs-private */
const _OuiTabLabelWrapperMixinBase = mixinInkBarItem(
  mixinDisabled(
    class {
      elementRef: ElementRef;
    },
  ),
);

/**
 * Used in the `mat-tab-group` view to display tab labels.
 * @docs-private
 */
@Directive({
  selector: '[ouiTabLabelWrapper]',
  inputs: ['disabled', 'fitInkBarToContent'],
  host: {
    '[class.oui-mdc-tab-disabled]': 'disabled',
    '[attr.aria-disabled]': '!!disabled',
  },
})
export class OuiTabLabelWrapper extends _OuiTabLabelWrapperMixinBase implements CanDisable {
  constructor(private elementRef: ElementRef) {
    super();
  }

  /** Sets focus on the wrapper element */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }
}
