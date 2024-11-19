import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '../core/common-behaviors/error-options';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiInput } from './input';
import { ReactiveFormsModule } from '@angular/forms';
import { OuiIconModule } from '../icon/icon.module';

@NgModule({
  declarations: [OuiInput],
  imports: [
    CommonModule,
    TextFieldModule,
    OuiFormFieldModule,
    ReactiveFormsModule,
    OuiIconModule,
  ],
  exports: [
    TextFieldModule,
    // We re-export the `OuiFormFieldModule` since `OuiInput` will almost always
    // be used together with `OuiFormField`.
    OuiFormFieldModule,
    OuiInput,
  ],
  providers: [ErrorStateMatcher],
})
export class OuiInputModule {}
