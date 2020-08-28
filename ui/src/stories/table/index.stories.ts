import {
  OuiIconModule,
  OuiTableModule,
  OuiPaginatorModule,
  OuiSortModule,
  OuiInputModule,
  OuiTooltipModule,
  OuiTable,
} from '../../components';
import { object, number } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import '!style-loader!css-loader!./table.css';
import { NAMES, COLORS, USERINFODATASOURCE } from './const';
import { OuiTableStorybook, OuiTableCustomStorybook } from './table.component';

function createNewUser(id: number) {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
  };
}

const TABLEDATASOURCE = Array.from({ length: 5000 }, (_, k) =>
  createNewUser(k + 1)
);

const valueOptions = {
  range: true,
  min: 5,
  max: 50,
  step: 5,
};

export default {
  title: 'Table',
  component: OuiTable,
};

export const Regular = () => ({
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
  template: `<oui-table-storybook [pageSize]="pageSize" [users]="data"></oui-table-storybook>`,
  props: {
    pageSize: number('pageSize', 10, valueOptions),
    data: object('data', TABLEDATASOURCE),
  },
});

export const Custom = () => ({
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
  props: {
    data: object('data', USERINFODATASOURCE),
  },
});
