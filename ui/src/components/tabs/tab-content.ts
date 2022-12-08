/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, InjectionToken, TemplateRef} from '@angular/core';

/**
 * Injection token that can be used to reference instances of `MatTabContent`. It serves as
 * alternative token to the actual `MatTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const OUI_TAB_CONTENT = new InjectionToken<OuiTabContent>('OuiTabContent');

/** Decorates the `ng-template` tags and reads out the template from it. */
@Directive({
  selector: '[ouiTabContent]',
  providers: [{provide: OUI_TAB_CONTENT, useExisting: OuiTabContent}],
})
export class OuiTabContent {
  constructor(/** Content for the tab. */ public template: TemplateRef<any>) {}
}
