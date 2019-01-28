import { NgModule } from '@angular/core';
import { OuiTable } from './table';
import { CdkTableModule } from '@angular/cdk/table';
import {
  OuiCell,
  OuiCellDef,
  OuiColumnDef,
  OuiFooterCell,
  OuiFooterCellDef,
  OuiHeaderCell,
  OuiHeaderCellDef
} from './cell';
import {
  OuiFooterRow,
  OuiFooterRowDef,
  OuiHeaderRow,
  OuiHeaderRowDef,
  OuiRow,
  OuiRowDef
} from './row';
import { CommonModule } from '@angular/common';

const EXPORTED_DECLARATIONS = [
  // Table
  OuiTable,

  // Template defs
  OuiHeaderCellDef,
  OuiHeaderRowDef,
  OuiColumnDef,
  OuiCellDef,
  OuiRowDef,
  OuiFooterCellDef,
  OuiFooterRowDef,

  // Cell directives
  OuiHeaderCell,
  OuiCell,
  OuiFooterCell,

  // Row directions
  OuiHeaderRow,
  OuiRow,
  OuiFooterRow
];

@NgModule({
  imports: [CdkTableModule, CommonModule],
  exports: EXPORTED_DECLARATIONS,
  declarations: EXPORTED_DECLARATIONS
})
export class OuiTableModule {}
