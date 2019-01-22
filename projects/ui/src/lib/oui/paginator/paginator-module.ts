import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OuiButtonModule } from '../button/public-api';
import { OuiTooltipModule } from '../tooltip/public-api';
import { OuiPaginator } from './paginator';
import { OUI_PAGINATOR_INTL_PROVIDER } from './paginator-intl';

@NgModule({
  imports: [CommonModule, OuiButtonModule, OuiTooltipModule],
  exports: [OuiPaginator],
  declarations: [OuiPaginator],
  providers: [OUI_PAGINATOR_INTL_PROVIDER]
})
export class OuiPaginatorModule {}
