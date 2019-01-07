import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OuiProgressSpinner } from './progress-spinner';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [OuiProgressSpinner],
  exports: [OuiProgressSpinner]
})
export class OuiProgressSpinnerModule { }
