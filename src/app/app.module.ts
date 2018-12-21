import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OuiButtonModule } from './button/button-module';
import { OuiDialogModule } from './dialog/dialog-module';
import { OuiSlideToggleModule } from './slide-toggle/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OuiButtonModule, OuiDialogModule,OuiSlideToggleModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
