/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiInput } from './input';

@NgModule({
  declarations: [OuiInput],
  imports: [CommonModule, TextFieldModule, OuiFormFieldModule],
  exports: [
    TextFieldModule,
    // We re-export the `OuiFormFieldModule` since `OuiInput` will almost always
    // be used together with `OuiFormField`.
    OuiFormFieldModule,
    OuiInput
  ],
  providers: []
})
export class OuiInputModule {}
