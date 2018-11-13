import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OuiButtonModule } from './button/button-module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OuiButtonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
