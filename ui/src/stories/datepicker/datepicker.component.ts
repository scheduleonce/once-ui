import {
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { OuiDatepickerInputEvent } from '../../components/datepicker';
import { OuiDateFormats, OUI_DATE_FORMATS } from '../../components';

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
      <oui-form-field [appearance]="appearance()">
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
          [disabled]="disabled()"
          [startView]="startView()"
          [opened]="opened()"
          [color]="color()"
          (closed)="closed($event)"
          (monthSelected)="monthSelected($event)"
          (opened)="datepickeropened($event)"
          (yearSelected)="yearSelected($event)"
          #picker
        ></oui-datepicker>
      </oui-form-field>
    </div>
  `,
  standalone: false,
})
export class OuiDatepickerStorybook {
  readonly appearance = input('standard');
  readonly color = input('primary');
  readonly startView = input<any>(['month', 'year', 'multi-year']);
  readonly opened = input(false);
  readonly disabled = input(false);
  readonly mindate = input<Date>(new Date());
  minDate: Date = new Date();
  readonly value = input<Date>(new Date());
  _value: Date = new Date();
  readonly maxdate = input<Date>(new Date());
  maxDate: Date = new Date();
  readonly _closed = output<string>();
  readonly _monthSelected = output<string>();
  readonly _opened = output<string>();
  readonly _yearSelected = output<string>();
  readonly _dateChange = output<string>();
  constructor() {
    effect(() => {
      this.minDate = new Date(this.mindate());
      this.maxDate = new Date(this.maxdate());
      this._value = new Date(this.value());
      if (this.opened()) {
        (document.querySelector('.oui-datepicker-toggle') as HTMLElement).focus();
      }
    });
  }

  closed(e?: string) {
    this._closed.emit(e);
  }
  monthSelected(e?: string) {
    this._monthSelected.emit(e);
  }
  datepickeropened(e?: string) {
    this._opened.emit(e);
  }
  yearSelected(e?: string) {
    this._yearSelected.emit(e);
  }
  dateChange(e?: string) {
    this._dateChange.emit(e);
  }
}

@Component({
  selector: 'oui-datepicker-custom-storybook',
  template: `
    <div style="max-width: 170px;">
      <oui-form-field [appearance]="appearance()">
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
          [disabled]="disabled()"
          [startView]="startView()"
          [opened]="opened()"
          [color]="color()"
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
  standalone: false,
})
export class OuiDatepickerCustomStorybook {
  readonly appearance = input('standard');
  readonly color = input('primary');
  readonly startView = input<any>(['month', 'year', 'multi-year']);
  readonly opened = input(false);
  readonly disabled = input(false);
  readonly mindate = input<Date>(new Date());
  minDate: Date = new Date();
  readonly value = input<Date>(new Date());
  _value: Date = new Date();
  readonly maxdate = input<Date>(new Date());
  maxDate: Date = new Date();
  readonly _closed = output<string>();
  readonly _monthSelected = output<string>();
  readonly _opened = output<string>();
  readonly _yearSelected = output<string>();
  readonly _dateChange = output<string>();
  constructor() {
    effect(() => {
      this.minDate = new Date(this.mindate());
      this.maxDate = new Date(this.maxdate());
      this._value = new Date(this.value());
      if (this.opened()) {
        (document.querySelector('.oui-datepicker-toggle') as HTMLElement).focus();
      }
    });
  }
  closed(e?: string) {
    this._closed.emit(e);
  }
  monthSelected(e?: string) {
    this._monthSelected.emit(e);
  }
  datepickeropened(e?: string) {
    this._opened.emit(e);
  }
  yearSelected(e?: string) {
    this._yearSelected.emit(e);
  }
  dateChange(e?: string) {
    this._dateChange.emit(e);
  }
}

@Component({
  selector: 'oui-daterangepicker-storybook',
  template: `
    <div style="display: inline-flex;">
      <div style="max-width: 170px;">
        <oui-form-field [appearance]="appearance()">
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
            [disabled]="disabled()"
            [startView]="startView()"
            [color]="color()"
            #minpicker
          ></oui-datepicker>
        </oui-form-field>
      </div>
      <div style="max-width: 170px;margin-left: 20px;">
        <oui-form-field [appearance]="appearance()">
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
            [disabled]="disabled()"
            [startView]="startView()"
            [color]="color()"
            #maxpicker
          ></oui-datepicker>
        </oui-form-field>
      </div>
    </div>
  `,
  standalone: false,
})
export class OuiDaterangepickerStorybook {
  readonly appearance = input('standard');
  readonly color = input('primary');
  readonly startView = input('primary');
  readonly opened = input(false);
  readonly disabled = input(false);
  readonly mindate = input<Date>();
  minDate: Date = new Date();
  minRangeDate: Date;
  readonly maxdate = input<Date>();
  maxRangeDate: Date;
  maxDate: Date;
  readonly _dateChange = output<{}>();
  constructor() {
    effect(() => {
      if (this.mindate()) this.minRangeDate = new Date(this.mindate());
      if (this.maxdate()) this.maxRangeDate = new Date(this.maxdate());
    });
  }
  mindateChange(e: OuiDatepickerInputEvent<Date>) {
    this.minDate = new Date(e.value);
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
    if (this.minDate) {
      this._dateChange.emit({
        min: this.minDate,
        max: this.maxDate,
      });
    }
    // this._dateChange.emit(e);
  }
}
