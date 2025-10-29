/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  InjectionToken,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

/**
 * Injection token that can be used to reference instances of `OuiTabLabel`. It serves as
 * alternative token to the actual `OuiTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const OUI_TAB_LABEL = new InjectionToken<OuiTabLabel>('OuiTabLabel');

/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
export const OUI_TAB = new InjectionToken<any>('OUI_TAB');

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: '[oui-tab-label], [OuiTabLabel]',
  providers: [{ provide: OUI_TAB_LABEL, useExisting: OuiTabLabel }],
  standalone: false,
})
export class OuiTabLabel extends CdkPortal {
  _closestTab = inject(OUI_TAB, { optional: true })!;

  constructor() {
    const templateRef = inject<TemplateRef<any>>(TemplateRef);
    const viewContainerRef = inject(ViewContainerRef);

    super(templateRef, viewContainerRef);
  }
}
