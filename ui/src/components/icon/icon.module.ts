import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Icon } from './icon';
import { OuiIconRegistry } from './icon-registery';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [Icon],
  declarations: [Icon],
  providers: [OuiIconRegistry, TitleCasePipe]
})
export class OuiIconModule {}
