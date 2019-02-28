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
  OuiProgressBarModule,
  OuiPanelModule,
  OuiSelectModule
} from 'projects/ui/src/lib/oui';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  OuiTableModule,
  OuiSortModule,
  OuiPaginatorModule
} from 'projects/ui/src/public_api';
import { OuiDatepickerModule } from 'projects/ui/src/lib/oui/datepicker';

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
    OuiPanelModule,
    OuiSelectModule,
    OuiProgressBarModule,
    OuiDatepickerModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
