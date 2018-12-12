import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ObserversModule } from '@angular/cdk/observers';
import { OuiFormField } from './form-field';
// import {MatError} from './error';
// import {MatHint} from './hint';
// import {MatLabel} from './label';
// import {MatPlaceholder} from './placeholder';
// import {MatPrefix} from './prefix';
// import {MatSuffix} from './suffix';

@NgModule({
  declarations: [OuiFormField],
  imports: [CommonModule, ObserversModule],
  exports: [OuiFormField]
})
export class OuiFormFieldModule {}
