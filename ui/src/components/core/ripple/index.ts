/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule } from '@angular/core';
import { OuiCommonModule } from '../common-behaviors/common-module';
import { OuiRipple } from './ripple';

export * from './ripple';
export * from './ripple-ref';
export * from './ripple-renderer';

@NgModule({
  imports: [OuiCommonModule],
  exports: [OuiRipple, OuiCommonModule],
  declarations: [OuiRipple],
})
export class OuiRippleModule {}
