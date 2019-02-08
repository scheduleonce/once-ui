import { NgModule } from '@angular/core';
import { OuiSortHeader } from './sort-header';
import { OuiSort } from './sort';
import { OUI_SORT_HEADER_INTL_PROVIDER } from './sort-header-intl';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [OuiSort, OuiSortHeader],
  declarations: [OuiSort, OuiSortHeader],
  providers: [OUI_SORT_HEADER_INTL_PROVIDER]
})
export class OuiSortModule {}
