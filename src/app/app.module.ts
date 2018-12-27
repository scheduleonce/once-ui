import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OuiButtonModule } from './button/button-module';
import { OuiDialogModule } from './dialog/dialog-module';
import { OuiFormFieldModule } from './form-field/form-field-module';
import { OuiInputModule } from './input/input-module';
import { OuiAutocompleteModule } from './autocomplete/autocomplete-module';
import { OuiIconModule } from './icon/icon.module';
import { OuiMenuModule } from './menu/menu-module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    OuiButtonModule,
    OuiDialogModule,
    OuiFormFieldModule,
    OuiAutocompleteModule,
    OuiInputModule,
    OuiIconModule,
    OuiMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
