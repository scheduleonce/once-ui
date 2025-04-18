/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, ElementRef } from '@angular/core';
import { mixinInkBarItem } from './ink-bar';
import { CanDisable, mixinDisabled } from '../core';

// Boilerplate for applying mixins to ouiTabLabelWrapper.
/** @docs-private */
const _OuiTabLabelWrapperMixinBase = mixinInkBarItem(
  mixinDisabled(
    class {
      elementRef: ElementRef;
    }
  )
);

/**
 * Used in the `oui-tab-group` view to display tab labels.
 * @docs-private
 */
@Directive({
  selector: '[ouiTabLabelWrapper]',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'fitInkBarToContent'],
  host: {
    '[class.oui-mdc-tab-disabled]': 'disabled',
    '[attr.aria-disabled]': '!!disabled',
  },
  standalone: false,
})
export class ouiTabLabelWrapper
  extends _OuiTabLabelWrapperMixinBase
  implements CanDisable
{
  constructor(override elementRef: ElementRef) {
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
