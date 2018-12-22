import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ObserversModule } from '@angular/cdk/observers';
import { OuiFormField } from './form-field';

@NgModule({
  declarations: [OuiFormField],
  imports: [CommonModule, ObserversModule],
  exports: [OuiFormField]
})
export class OuiFormFieldModule {}
