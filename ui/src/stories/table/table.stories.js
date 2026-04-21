import {
  OuiIconModule,
  OuiTableModule,
  OuiTableColumnsModule,
  OuiPaginatorModule,
  OuiSortModule,
  OuiInputModule,
  OuiTooltipModule,
} from '../../components';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { USERINFODATASOURCE } from './const';
import {
  OuiTableStorybook,
  OuiTableCustomStorybook,
  OuiTableEnhancedStorybook,
} from './table.component';

export default {
  title: 'Table',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [
        OuiTableModule,
        OuiSortModule,
        OuiPaginatorModule,
        OuiIconModule,
        OuiInputModule,
        BrowserAnimationsModule,
      ],

      schemas: [],
      declarations: [OuiTableStorybook],
    },

    template: `<oui-table-storybook [pageSize]="pageSize"></oui-table-storybook>`,
    props,
  }),

  name: 'Regular',
  height: '700px',

  parameters: {
    docs: {
      source: {
        code: `<oui-table-storybook [pageSize]="pageSize" [users]="data"></oui-table-storybook>`,
      },
    },
  },

  args: {
    pageSize: 10,
  },
};

export const Custom = {
  render: (props) => ({
    moduleMetadata: {
      imports: [
        OuiTableModule,
        OuiSortModule,
        OuiIconModule,
        OuiInputModule,
        OuiTooltipModule,
        BrowserAnimationsModule,
      ],

      schemas: [],
      declarations: [OuiTableCustomStorybook],
    },

    template: `<oui-table-custom-storybook [users]="data"></oui-table-custom-storybook>`,
    props,
  }),

  height: '700px',
  name: 'Custom',

  parameters: {
    docs: {
      source: {
        code: `<oui-table-custom-storybook [users]="data"></oui-table-custom-storybook>`,
      },
    },
  },

  args: {
    data: USERINFODATASOURCE,
  },
};

export const Enhanced = {
  render: (props) => ({
    moduleMetadata: {
      imports: [
        OuiTableColumnsModule,
        OuiPaginatorModule,
        OuiIconModule,
        OuiInputModule,
        BrowserAnimationsModule,
        DragDropModule,
      ],
      schemas: [],
      declarations: [OuiTableEnhancedStorybook],
    },

    template: `<oui-table-enhanced-storybook></oui-table-enhanced-storybook>`,
    props,
  }),

  height: '700px',
  name: 'Enhanced (Sort + Resize + Reorder + Column Menu)',

  parameters: {
    docs: {
      description: {
        story: `
Demonstrates all three opt-in column features together.

**Sort** — click any column header to sort asc/desc. Hover the sort icon to see the current state in a tooltip.

**Resize** — hover a header cell and drag its right edge to resize the column.

**Reorder** — drag a column header to a new position. A blue drop indicator shows where it will land.

**Column menu** — hover a header cell and click the ⋮ button for sort actions, move left/right/first/last, and hide column.
        `,
      },
      source: {
        code: `
<!-- Import OuiTableColumnsModule instead of OuiTableModule -->

<table
  oui-table
  [dataSource]="dataSource"
  ouiSort
  ouiResizableColumns
  ouiReorderableColumns
  (ouiSortChange)="onSort($event)"
  (columnResized)="onColumnResized($event)"
  (columnOrderChanged)="onColumnOrderChanged($event)"
>
  @for (column of displayedColumns; track column) {
  <ng-container [ouiColumnDef]="column">
    <th
      oui-header-cell
      *ouiHeaderCellDef
      oui-sort-header
      [ouiColumnMenu]="displayedColumns"
      (columnMenuAction)="onColumnMenuAction($event)"
    >
      {{ column }}
    </th>
    <td oui-cell *ouiCellDef="let row">{{ row[column] }}</td>
  </ng-container>
  }
  <tr oui-header-row *ouiHeaderRowDef="displayedColumns"></tr>
  <tr oui-row *ouiRowDef="let row; columns: displayedColumns"></tr>
</table>
        `,
      },
    },
  },
};
