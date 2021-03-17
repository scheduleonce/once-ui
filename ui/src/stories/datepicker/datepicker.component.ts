import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import { OuiDatepickerInputEvent } from '../../components/datepicker';
import { OuiDateFormats, OUI_DATE_FORMATS } from '../../components';

import { NativeDateAdapter } from '../../components/datepicker/native-date-adapter';
import {DateAdapter} from '../../components/datepicker/date-adapter';

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
export class OuiDatepickerStorybook implements OnChanges {
  @Input() appearance = 'standard';
  @Input() color = 'primary';
  @Input() startView = ['month', 'year', 'multi-year'];
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
  ngOnChanges() {
    this.minDate = new Date(this.mindate);
    this.maxDate = new Date(this.maxdate);
    this._value = new Date(this.value);
    if (this.opened) {
      (document.querySelector('.oui-datepicker-toggle') as HTMLElement).focus();
    }
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

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Satuarday'];
export class AppDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  format(date: Date, displayFormat: string): string {

    let daate = date.getDate();
    let day = date.getDay();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return weekDays[day].substring(0,3) + ',' + this._to2digit(daate) + '/' + this._to2digit(month) + '/' + year;


    //
    if (displayFormat == 'input') {
      let daate = date.getDate();
      let day = date.getDay();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      return weekDays[day] + ',' + this._to2digit(daate) + '/' + this._to2digit(month) + '/' + year;
    } else if (displayFormat == 'inputMonth') {
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(month) + '/' + year;
    } else {
      return date.toDateString();
    }
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}

///


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
  providers: [{ provide: OUI_DATE_FORMATS, useValue: OUI_CUSTOM_DATE_FORMATS },    {
    provide: DateAdapter,
    useClass: AppDateAdapter,
  },],
})
export class OuiDatepickerCustomStorybook implements OnChanges {
  @Input() appearance = 'standard';
  @Input() color = 'primary';
  @Input() startView = ['month', 'year', 'multi-year'];
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
  ngOnChanges() {
    this.minDate = new Date(this.mindate);
    this.maxDate = new Date(this.maxdate);
    this._value = new Date(this.value);
    if (this.opened) {
      (document.querySelector('.oui-datepicker-toggle') as HTMLElement).focus();
    }
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
export class OuiDaterangepickerStorybook implements OnChanges {
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
  ngOnChanges() {
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
