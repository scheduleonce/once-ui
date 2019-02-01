/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { DateAdapter } from './date-adapter';
import { OUI_DATE_FORMATS } from './date-formats';
import { NativeDateAdapter } from './native-date-adapter';
import { OUI_NATIVE_DATE_FORMATS } from './native-date-formats';

export * from './date-adapter';
export * from './date-formats';
export * from './native-date-adapter';
export * from './native-date-formats';

@NgModule({
  imports: [PlatformModule],
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }]
})
export class NativeDateModule {}

@NgModule({
  imports: [NativeDateModule],
  providers: [{ provide: OUI_DATE_FORMATS, useValue: OUI_NATIVE_DATE_FORMATS }]
})
export class OuiNativeDateModule {}
