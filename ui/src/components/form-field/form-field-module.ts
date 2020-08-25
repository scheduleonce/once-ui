import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ObserversModule } from '@angular/cdk/observers';
import { OuiFormField } from './form-field';
import { OuiError } from './error';

@NgModule({
  declarations: [OuiFormField, OuiError],
  imports: [CommonModule, ObserversModule],
  exports: [OuiFormField, OuiError],
})
export class OuiFormFieldModule {}
