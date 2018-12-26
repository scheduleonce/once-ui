import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OuiButtonModule } from './button/button-module';
import { OuiDialogModule } from './dialog/dialog-module';
import { OuiIconModule } from './icon/icon.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OuiButtonModule, OuiDialogModule, OuiIconModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
