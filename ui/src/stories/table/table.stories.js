import {
  OuiIconModule,
  OuiTableModule,
  OuiPaginatorModule,
  OuiSortModule,
  OuiInputModule,
  OuiTooltipModule,
} from '../../components';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { USERINFODATASOURCE } from './const';
import { OuiTableStorybook, OuiTableCustomStorybook } from './table.component';

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
