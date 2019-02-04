import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OuiSlideToggleModule } from 'projects/ui/src/lib/oui/slide-toggle/public-api';
import {
  OuiButtonModule,
  OuiProgressSpinnerModule,
  OuiDialogModule,
  OuiFormFieldModule,
  OuiInputModule,
  OuiAutocompleteModule,
  OuiIconModule,
  OuiMenuModule,
  OuiCheckboxModule,
  OuiTooltipModule,
  OuiRadioModule,
  OuiProgressBarModule
} from 'projects/ui/src/lib/oui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  OuiTableModule,
  OuiSortModule,
  OuiPaginatorModule
} from 'projects/ui/src/public_api';
import { MatNativeDateModule } from '@angular/material';
import { OuiDatepickerModule } from 'projects/ui/src/lib/oui/datepicker';
import { OuiNativeDateModule } from 'projects/ui/src/lib/oui/datepicker/native-date.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OuiTooltipModule,
    OuiButtonModule,
    OuiDialogModule,
    OuiSlideToggleModule,
    OuiFormFieldModule,
    OuiAutocompleteModule,
    OuiInputModule,
    OuiIconModule,
    OuiMenuModule,
    OuiCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    OuiTableModule,
    OuiProgressSpinnerModule,
    OuiSortModule,
    OuiPaginatorModule,
    OuiProgressSpinnerModule,
    OuiRadioModule,
    OuiProgressBarModule,
    MatNativeDateModule,
    OuiDatepickerModule,
    OuiNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
