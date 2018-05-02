import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule
  ],
  exports: [
    DatepickerComponent
  ],
  declarations: [
    DatepickerComponent
  ]
})
export class DatepickerModule { }
