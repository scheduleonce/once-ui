import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OuiTableModule } from './table-module';
import { OuiSortModule } from '../sort/sort-module';
import { OuiIconModule } from '../icon/icon.module';
import { OuiMenuModule } from '../menu/menu-module';
import { OuiColumnMenuDirective } from './column-menu/oui-column-menu.directive';
import { OuiColumnMenuPanelComponent } from './column-menu/oui-column-menu-panel.component';
import { OuiResizableColumnsDirective } from './column-resize/oui-column-resize.directive';
import { OuiResizableColumnDirective } from './column-resize/oui-column-resize-column.directive';
import { OuiReorderableColumnsDirective } from './column-reorder/oui-column-reorder.directive';
import { OuiReorderableAutoScrollDirective } from './column-reorder/oui-reorderable-auto-scroll.directive';
import { OuiTooltipModule } from '../tooltip/tooltip-module';

const COLUMN_FEATURE_DECLARATIONS = [
  OuiColumnMenuDirective,
  OuiColumnMenuPanelComponent,
  OuiResizableColumnsDirective,
  OuiResizableColumnDirective,
  OuiReorderableColumnsDirective,
  OuiReorderableAutoScrollDirective,
];

/**
 * Drop-in replacement for OuiTableModule that adds opt-in column features:
 *  - `ouiColumnMenu`         (on th[oui-header-cell]) — 3-dots context menu
 *  - `ouiResizableColumns`   (on oui-table)            — drag-to-resize columns (table-wide) (deprecated, use ouiResizableColumn instead)
 *  - `ouiResizableColumn`    (on th[oui-header-cell])  — drag-to-resize a single column
 *  - `ouiReorderableColumns` (on oui-table)            — drag-to-reorder columns
 *
 * Re-exports OuiTableModule and OuiSortModule so consuming modules only need to
 * import OuiTableColumnsModule.
 */
@NgModule({
  imports: [
    CommonModule,
    OuiTableModule,
    OuiSortModule,
    OuiIconModule,
    OuiMenuModule,
    OuiTooltipModule,
  ],
  declarations: COLUMN_FEATURE_DECLARATIONS,
  exports: [
    // All existing table + sort primitives still available.
    OuiTableModule,
    OuiSortModule,
    // New feature directives.
    ...COLUMN_FEATURE_DECLARATIONS,
  ],
})
export class OuiTableColumnsModule {}
