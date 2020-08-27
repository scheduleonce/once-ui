import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { date, select, boolean } from '@storybook/addon-knobs';
import { COLORS, APPEARANCE } from '../const';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import markdownText from '../../components/datepicker/README.md';
import {
  OuiDatepickerModule,
  OuiDatepickerInputEvent,
} from '../../components/datepicker';
import {
  OuiFormFieldModule,
  OuiInputModule,
  OuiDateFormats,
  OUI_DATE_FORMATS,
} from '../../components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

export const OUI_CUSTOM_DATE_FORMATS: OuiDateFormats = {
  parse: {
    dateInput: null,
  },
  display: {
    dateInput: {
      year: 'numeric',
      day: '2-digit',
      month: '2-digit',
    },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Component({
  selector: 'oui-datepicker-storybook',
  template: `
    <div style="max-width: 170px;">
      <oui-form-field [appearance]="appearance">
        <input
          oui-input
          [ouiDatepicker]="picker"
          [min]="minDate"
          [max]="maxDate"
          [value]="_value"
          (dateChange)="dateChange($event)"
          placeholder="Please select"
        />
        <oui-datepicker-toggle ouiSuffix [for]="picker"></oui-datepicker-toggle>
        <oui-datepicker
          [disabled]="disabled"
          [startView]="startView"
          [opened]="opened"
          [color]="color"
          (closed)="closed($event)"
          (monthSelected)="monthSelected($event)"
          (opened)="datepickeropened($event)"
          (yearSelected)="yearSelected($event)"
          #picker
        ></oui-datepicker>
      </oui-form-field>
    </div>
  `,
})
export class OuiDatepickerStorybook implements OnInit {
  @Input() appearance = 'standard';
  @Input() color = 'primary';
  @Input() startView = 'primary';
  @Input() opened = false;
  @Input() disabled = false;
  @Input() mindate: Date = new Date();
  minDate: Date = new Date();
  @Input() value: Date = new Date();
  _value: Date = new Date();
  @Input() maxdate: Date = new Date();
  maxDate: Date = new Date();
  @Output()
  readonly _closed: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _monthSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _opened: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _yearSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _dateChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}
  ngOnInit() {
    this.minDate = new Date(this.mindate);
    this.maxDate = new Date(this.maxdate);
    this._value = new Date(this.value);
  }
  closed(e) {
    this._closed.emit(e);
  }
  monthSelected(e) {
    this._monthSelected.emit(e);
  }
  datepickeropened(e) {
    this._opened.emit(e);
  }
  yearSelected(e) {
    this._yearSelected.emit(e);
  }
  dateChange(e) {
    this._dateChange.emit(e);
  }
}

@Component({
  selector: 'oui-datepicker-custom-storybook',
  template: `
    <div style="max-width: 170px;">
      <oui-form-field [appearance]="appearance">
        <input
          oui-input
          [ouiDatepicker]="picker"
          [min]="minDate"
          [max]="maxDate"
          [value]="_value"
          (dateChange)="dateChange($event)"
          placeholder="Please select"
        />
        <oui-datepicker-toggle ouiSuffix [for]="picker"></oui-datepicker-toggle>
        <oui-datepicker
          [disabled]="disabled"
          [startView]="startView"
          [opened]="opened"
          [color]="color"
          (closed)="closed($event)"
          (monthSelected)="monthSelected($event)"
          (opened)="datepickeropened($event)"
          (yearSelected)="yearSelected($event)"
          #picker
        ></oui-datepicker>
      </oui-form-field>
    </div>
  `,
  providers: [{ provide: OUI_DATE_FORMATS, useValue: OUI_CUSTOM_DATE_FORMATS }],
})
export class OuiDatepickerCustomStorybook implements OnInit {
  @Input() appearance = 'standard';
  @Input() color = 'primary';
  @Input() startView = 'primary';
  @Input() opened = false;
  @Input() disabled = false;
  @Input() mindate: Date = new Date();
  minDate: Date = new Date();
  @Input() value: Date = new Date();
  _value: Date = new Date();
  @Input() maxdate: Date = new Date();
  maxDate: Date = new Date();
  @Output()
  readonly _closed: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _monthSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _opened: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _yearSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _dateChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}
  ngOnInit() {
    this.minDate = new Date(this.mindate);
    this.maxDate = new Date(this.maxdate);
    this._value = new Date(this.value);
  }
  closed(e) {
    this._closed.emit(e);
  }
  monthSelected(e) {
    this._monthSelected.emit(e);
  }
  datepickeropened(e) {
    this._opened.emit(e);
  }
  yearSelected(e) {
    this._yearSelected.emit(e);
  }
  dateChange(e) {
    this._dateChange.emit(e);
  }
}

@Component({
  selector: 'oui-daterangepicker-storybook',
  template: `
    <div style="display: inline-flex;">
      <div style="max-width: 170px;">
        <oui-form-field [appearance]="appearance">
          <input
            oui-input
            [ouiDatepicker]="minpicker"
            [min]="minRangeDate"
            [max]="maxDate"
            (dateChange)="mindateChange($event)"
            placeholder="Please select"
          />
          <oui-datepicker-toggle
            ouiSuffix
            [for]="minpicker"
          ></oui-datepicker-toggle>
          <oui-datepicker
            [disabled]="disabled"
            [startView]="startView"
            [color]="color"
            #minpicker
          ></oui-datepicker>
        </oui-form-field>
      </div>
      <div style="max-width: 170px;margin-left: 20px;">
        <oui-form-field [appearance]="appearance">
          <input
            oui-input
            [ouiDatepicker]="maxpicker"
            [min]="minDate"
            [max]="maxRangeDate"
            (dateChange)="maxdateChange($event)"
            placeholder="Please select"
          />
          <oui-datepicker-toggle
            ouiSuffix
            [for]="maxpicker"
          ></oui-datepicker-toggle>
          <oui-datepicker
            [disabled]="disabled"
            [startView]="startView"
            [color]="color"
            #maxpicker
          ></oui-datepicker>
        </oui-form-field>
      </div>
    </div>
  `,
})
export class OuiDaterangepickerStorybook implements OnInit {
  @Input() appearance = 'standard';
  @Input() color = 'primary';
  @Input() startView = 'primary';
  @Input() opened = false;
  @Input() disabled = false;
  @Input() mindate: Date;
  minDate: Date = new Date();
  minRangeDate: Date;
  @Input() maxdate: Date;
  maxRangeDate: Date;
  maxDate: Date;
  @Output()
  readonly _dateChange: EventEmitter<{}> = new EventEmitter<{}>();
  constructor() {}
  ngOnInit() {
    this.minRangeDate = new Date(this.mindate);
    this.maxRangeDate = new Date(this.maxdate);
  }
  mindateChange(e: OuiDatepickerInputEvent<Date>) {
    this.minDate = new Date(e.value);
    console.log(this.minDate);
    if (this.maxDate) {
      this._dateChange.emit({
        min: this.minDate,
        max: this.maxDate,
      });
    }
    // this._dateChange.emit(e);
  }
  maxdateChange(e: OuiDatepickerInputEvent<Date>) {
    this.maxDate = new Date(e.value);
    console.log(this.maxDate);
    if (this.minDate) {
      this._dateChange.emit({
        min: this.minDate,
        max: this.maxDate,
      });
    }
    // this._dateChange.emit(e);
  }
}

storiesOf('Form Field/Datepicker', module)
  .add(
    'Regular',
    () => ({
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
        ),
      },
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Custom format',
    () => ({
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
        ),
      },
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Daterange picker',
    () => ({
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
        ),
      },
    }),
    { notes: { markdown: markdownText } }
  );
