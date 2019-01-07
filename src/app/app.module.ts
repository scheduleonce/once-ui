import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OuiSlideToggleModule } from 'projects/ui/src/lib/oui/slide-toggle/public-api';
import {
  OuiButtonModule,
  OuiProgressSpinnerModule
} from 'projects/ui/src/lib/oui';
import { OuiDialogModule } from 'projects/ui/src/lib/oui';
import { OuiFormFieldModule } from 'projects/ui/src/lib/oui';
import { OuiInputModule } from 'projects/ui/src/lib/oui';
import { OuiAutocompleteModule } from 'projects/ui/src/lib/oui';
import { OuiIconModule } from 'projects/ui/src/lib/oui';
import { OuiMenuModule } from 'projects/ui/src/lib/oui';
import { OuiCheckboxModule } from 'projects/ui/src/lib/oui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
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
    OuiProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
