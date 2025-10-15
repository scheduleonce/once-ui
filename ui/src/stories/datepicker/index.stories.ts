import { action } from 'storybook/actions';
import { COLORS, APPEARANCE } from '../const';
import { OuiDatepickerModule } from '../../components/datepicker';
import { OuiFormFieldModule, OuiInputModule } from '../../components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  OuiDaterangepickerStorybook,
  OuiDatepickerStorybook,
  OuiDatepickerCustomStorybook,
} from './datepicker.component';

const START_VIEWS = ['month', 'year', 'multi-year'];
const CURRENT_DATE = new Date();
const MAX_DATE = getDate(0, 0, 1);

function getDate(day: number, month: number, year: number) {
  // eslint-disable-next-line no-shadow
  const date = new Date();
  date.setFullYear(date.getFullYear() + year);
  date.setMonth(date.getMonth() + month);
  date.setDate(date.getDate() + day);
  return date;
}
export default {
  title: 'Form Field/Datepicker',
};

export const Regular = (props) => ({
  moduleMetadata: {
    imports: [
      OuiDatepickerModule,
      OuiFormFieldModule,
      OuiInputModule,
      BrowserAnimationsModule,
    ],
    schemas: [],
    declarations: [OuiDatepickerStorybook],
  },
  template: `<oui-datepicker-storybook 
    [value]="value" 
    [disabled]="disabled" 
    [startView]="startView" 
    [appearance]="appearance"
    [color]="color" 
    [opened]="opened" 
    [mindate]="minDate" 
    [maxdate]="maxDate"
    (_closed)="closed($event)"
    (_monthSelected)="monthSelected($event)"
    (_opened)="datepickeropened($event)"
    (_yearSelected)="yearSelected($event)"
    (_dateChange)="dateChange($event)"></oui-datepicker-storybook>`,
  props: {
    ...props,
    closed: action('closed'),
    monthSelected: action('monthSelected'),
    datepickeropened: action('opened'),
    yearSelected: action('yearSelected'),
    dateChange: action('dateChange'),
  },
});

Regular.args = {
  color: COLORS[0],
  startView: START_VIEWS[0],
  opened: false,
  disabled: false,
  minDate: CURRENT_DATE,
  maxDate: MAX_DATE,
  value: CURRENT_DATE.toISOString(),
  appearance: APPEARANCE[0],
};

Regular.argTypes = {
  color: {
    options: COLORS,
    control: { type: 'select' },
  },
  startView: {
    options: START_VIEWS,
    control: { type: 'select' },
  },
  appearance: {
    options: APPEARANCE,
    control: { type: 'select' },
  },
};

export const Custom_Format = (props) => ({
  moduleMetadata: {
    imports: [
      OuiDatepickerModule,
      OuiFormFieldModule,
      OuiInputModule,
      BrowserAnimationsModule,
    ],
    schemas: [],

    declarations: [OuiDatepickerCustomStorybook],
  },
  template: `<oui-datepicker-custom-storybook 
    [value]="value" 
    [disabled]="disabled" 
    [appearance]="appearance"
    [startView]="startView" 
    [color]="color" 
    [opened]="opened" 
    [mindate]="minDate" 
    [maxdate]="maxDate"
    (_closed)="closed($event)"
    (_monthSelected)="monthSelected($event)"
    (_opened)="datepickeropened($event)"
    (_yearSelected)="yearSelected($event)"
    (_dateChange)="dateChange($event)"></oui-datepicker-custom-storybook>`,
  props: {
    ...props,
    closed: action('closed'),
    monthSelected: action('monthSelected'),
    datepickeropened: action('opened'),
    yearSelected: action('yearSelected'),
    dateChange: action('dateChange'),
  },
});

Custom_Format.args = {
  color: COLORS[0],
  startView: START_VIEWS[0],
  opened: false,
  disabled: false,
  minDate: CURRENT_DATE,
  maxDate: MAX_DATE,
  value: CURRENT_DATE,
  appearance: APPEARANCE[0],
};

Custom_Format.argTypes = {
  color: {
    options: COLORS,
    control: { type: 'select' },
  },
  startView: {
    options: START_VIEWS,
    control: { type: 'select' },
  },
  appearance: {
    options: APPEARANCE,
    control: { type: 'select' },
  },
};

export const Daterange_Picker = (props) => ({
  moduleMetadata: {
    imports: [
      OuiDatepickerModule,
      OuiFormFieldModule,
      OuiInputModule,
      BrowserAnimationsModule,
    ],
    schemas: [],
    declarations: [OuiDaterangepickerStorybook],
  },
  template: `<oui-daterangepicker-storybook
      [disabled]="disabled" 
      [startView]="startView" 
      [appearance]="appearance"
      [color]="color" 
      [opened]="opened" 
      [mindate]="minDate" 
      [maxdate]="maxDate"
      (_closed)="closed($event)"
      (_monthSelected)="monthSelected($event)"
      (_opened)="datepickeropened($event)"
      (_yearSelected)="yearSelected($event)"
      (_dateChange)="dateChange($event)"></oui-daterangepicker-storybook>`,
  props: {
    ...props,
    closed: action('closed'),
    monthSelected: action('monthSelected'),
    datepickeropened: action('opened'),
    yearSelected: action('yearSelected'),
    dateChange: action('dateChange'),
  },
});

Daterange_Picker.args = {
  color: COLORS[0],
  startView: START_VIEWS[0],
  disabled: false,
  minDate: CURRENT_DATE,
  maxDate: MAX_DATE,
  appearance: APPEARANCE[0],
};

Daterange_Picker.argTypes = {
  color: {
    options: COLORS,
    control: { type: 'select' },
  },
  startView: {
    options: START_VIEWS,
    control: { type: 'select' },
  },
  appearance: {
    options: APPEARANCE,
    control: { type: 'select' },
  },
};
