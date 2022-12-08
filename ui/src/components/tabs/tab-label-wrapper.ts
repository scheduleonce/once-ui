/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef} from '@angular/core';
import {OuiInkBarItem, mixinInkBarItem} from './ink-bar';
import {CanDisable, mixinDisabled} from '@angular/material/core';

// Boilerplate for applying mixins to MatTabLabelWrapper.
/** @docs-private */
const _OuiTabLabelWrapperMixinBase = mixinDisabled(class {});

/**
 * Used in the `oui-tab-group` view to display tab labels.
 * @docs-private
 */
@Directive()
export class _OuiTabLabelWrapperBase extends _OuiTabLabelWrapperMixinBase implements CanDisable {
  constructor(public elementRef: ElementRef) {
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

const _OuiTabLabelWrapperBaseWithInkBarItem = mixinInkBarItem(_OuiTabLabelWrapperBase);

/**
 * Used in the `oui-tab-group` view to display tab labels.
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
export class OuiTabLabelWrapper
  extends _OuiTabLabelWrapperBaseWithInkBarItem
  implements OuiInkBarItem {}
