/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { InjectionToken } from '@angular/core';

/**
 * This token is used to inject the object whose value should be set into `OuiInput`. If none is
 * provided, the native `HTMLInputElement` is used. Directives like `MatDatepickerInput` can provide
 * themselves for this token, in order to make `OuiInput` delegate the getting and setting of the
 * value to them.
 */
export const OUI_INPUT_VALUE_ACCESSOR = new InjectionToken<{ value: any }>(
  'OUI_INPUT_VALUE_ACCESSOR'
);
