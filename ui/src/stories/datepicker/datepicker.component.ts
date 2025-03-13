import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
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
    standalone: false
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
    standalone: false
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
    standalone: false
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
