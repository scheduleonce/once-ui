import { action } from '@storybook/addon-actions';
import { date, select, boolean } from '@storybook/addon-knobs';
import { COLORS, APPEARANCE } from '../const';
import { OuiDatepickerModule } from '../../components/datepicker';
import {
  OuiFormFieldModule,
  OuiInputModule,
  OuiDatepicker
} from '../../components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  OuiDaterangepickerStorybook,
  OuiDatepickerStorybook,
  OuiDatepickerCustomStorybook
} from './datepicker.component';

const START_VIEWS = ['month', 'year', 'multi-year'];
const CURRENT_DATE = new Date();
const MAX_DATE = getDate(0, 0, 1);

function getDate(day: number, month: number, year: number) {
  // tslint:disable-next-line: no-shadowed-variable
  const date = new Date();
  date.setFullYear(date.getFullYear() + year);
  date.setMonth(date.getMonth() + month);
  date.setDate(date.getDate() + day);
  return date;
}
export default {
  title: 'Form Field/Datepicker',
  component: OuiDatepicker
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [
      OuiDatepickerModule,
      OuiFormFieldModule,
      OuiInputModule,
      BrowserAnimationsModule
    ],
    schemas: [],
    declarations: [OuiDatepickerStorybook]
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
    closed: action('closed'),
    monthSelected: action('monthSelected'),
    datepickeropened: action('opened'),
    yearSelected: action('yearSelected'),
    dateChange: action('dateChange'),
    color: select('color', COLORS, COLORS[0], 'OuiDatepicker'),
    startView: select(
      'start-view',
      START_VIEWS,
      START_VIEWS[0],
      'OuiDatepicker'
    ),
    opened: boolean('opened', false, 'OuiDatepicker'),
    disabled: boolean('disabled', false, 'OuiDatepicker'),
    minDate: date('minDate', CURRENT_DATE, 'OuiDatepickerInput'),
    maxDate: date('maxDate', MAX_DATE, 'OuiDatepickerInput'),
    value: date('value', CURRENT_DATE, 'OuiDatepickerInput'),
    appearance: select(
      'appearance',
      APPEARANCE,
      APPEARANCE[0],
      'OuiDatepickerInput'
    )
  }
});

export const Custom = () => ({
  moduleMetadata: {
    imports: [
      OuiDatepickerModule,
      OuiFormFieldModule,
      OuiInputModule,
      BrowserAnimationsModule
    ],
    schemas: [],

    declarations: [OuiDatepickerCustomStorybook]
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
    closed: action('closed'),
    monthSelected: action('monthSelected'),
    datepickeropened: action('opened'),
    yearSelected: action('yearSelected'),
    dateChange: action('dateChange'),
    color: select('color', COLORS, COLORS[0], 'OuiDatepicker'),
    startView: select(
      'start-view',
      START_VIEWS,
      START_VIEWS[0],
      'OuiDatepicker'
    ),
    opened: boolean('opened', false, 'OuiDatepicker'),
    disabled: boolean('disabled', false, 'OuiDatepicker'),
    minDate: date('minDate', CURRENT_DATE, 'OuiDatepickerInput'),
    maxDate: date('maxDate', MAX_DATE, 'OuiDatepickerInput'),
    value: date('value', CURRENT_DATE, 'OuiDatepickerInput'),
    appearance: select(
      'appearance',
      APPEARANCE,
      APPEARANCE[1],
      'OuiDatepickerInput'
    )
  }
});

export const Daterange = () => ({
  moduleMetadata: {
    imports: [
      OuiDatepickerModule,
      OuiFormFieldModule,
      OuiInputModule,
      BrowserAnimationsModule
    ],
    schemas: [],
    declarations: [OuiDaterangepickerStorybook]
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
    closed: action('closed'),
    monthSelected: action('monthSelected'),
    datepickeropened: action('opened'),
    yearSelected: action('yearSelected'),
    dateChange: action('dateChange'),
    color: select('color', COLORS, COLORS[0], 'OuiDatepicker'),
    startView: select(
      'start-view',
      START_VIEWS,
      START_VIEWS[0],
      'OuiDatepicker'
    ),
    disabled: boolean('disabled', false, 'OuiDatepicker'),
    minDate: date('minDate', CURRENT_DATE, 'OuiDatepickerInput'),
    maxDate: date('maxDate', MAX_DATE, 'OuiDatepickerInput'),
    appearance: select(
      'appearance',
      APPEARANCE,
      APPEARANCE[0],
      'OuiDatepickerInput'
    )
  }
});
