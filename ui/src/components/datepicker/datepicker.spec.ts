import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  Component,
  FactoryProvider,
  Type,
  ValueProvider,
  ViewChild,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
} from '@angular/core/testing';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  OUI_DATE_LOCALE,
  OuiNativeDateModule,
  NativeDateModule,
} from './native-date.module';
import { OuiFormFieldModule, OuiInputModule, OuiFormField } from '../';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { OuiDatepicker } from './datepicker';
import { OuiDatepickerInput } from './datepicker-input';
import { OuiDatepickerToggle } from './datepicker-toggle';
import {
  OUI_DATEPICKER_SCROLL_STRATEGY,
  OuiDatepickerIntl,
  OuiDatepickerModule,
} from './index';
export const JAN = 0;
export const FEB = 1;
export const MAR = 2;
export const APR = 3;
export const MAY = 4;
export const JUN = 5;
export const JUL = 6;
export const AUG = 7;
export const SEP = 8;
export const OCT = 9;
export const NOV = 10;
export const DEC = 11;

@Component({
  template: `
    <input [ouiDatepicker]="d" [value]="date" />
    <oui-datepicker
      #d
      [touchUi]="touch"
      [disabled]="disabled"
      [opened]="opened"
    ></oui-datepicker>
  `,
})
class StandardDatepicker {
  opened = false;
  touch = false;
  disabled = false;
  date: Date | null = new Date(2020, JAN, 1);
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput)
  datepickerInput: OuiDatepickerInput<Date>;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" /><input [ouiDatepicker]="d" /><oui-datepicker
      #d
    ></oui-datepicker>
  `,
})
class MultiInputDatepicker {}

@Component({
  template: ` <oui-datepicker #d></oui-datepicker> `,
})
class NoInputDatepicker {
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" [value]="date" />
    <oui-datepicker #d [startAt]="startDate"></oui-datepicker>
  `,
})
class DatepickerWithStartAt {
  date = new Date(2020, JAN, 1);
  startDate = new Date(2010, JAN, 1);
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" [value]="date" />
    <oui-datepicker
      #d
      startView="year"
      (monthSelected)="onYearSelection()"
    ></oui-datepicker>
  `,
})
class DatepickerWithStartViewYear {
  date = new Date(2020, JAN, 1);
  @ViewChild('d') datepicker: OuiDatepicker<Date>;

  onYearSelection() {}
}

@Component({
  template: `
    <input [ouiDatepicker]="d" [value]="date" />
    <oui-datepicker
      #d
      startView="multi-year"
      (yearSelected)="onMultiYearSelection()"
    ></oui-datepicker>
  `,
})
class DatepickerWithStartViewMultiYear {
  date = new Date(2020, JAN, 1);
  @ViewChild('d') datepicker: OuiDatepicker<Date>;

  onMultiYearSelection() {}
}

@Component({
  template: `
    <input [(ngModel)]="selected" [ouiDatepicker]="d" />
    <oui-datepicker #d></oui-datepicker>
  `,
})
class DatepickerWithNgModel {
  selected: Date | null = null;
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput)
  datepickerInput: OuiDatepickerInput<Date>;
}

@Component({
  template: `
    <input [formControl]="formControl" [ouiDatepicker]="d" />
    <oui-datepicker-toggle [for]="d"></oui-datepicker-toggle>
    <oui-datepicker #d></oui-datepicker>
  `,
})
class DatepickerWithFormControl {
  formControl = new UntypedFormControl();
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput)
  datepickerInput: OuiDatepickerInput<Date>;
  @ViewChild(OuiDatepickerToggle)
  datepickerToggle: OuiDatepickerToggle<Date>;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" />
    <oui-datepicker-toggle [for]="d"></oui-datepicker-toggle>
    <oui-datepicker #d [touchUi]="touchUI"></oui-datepicker>
  `,
})
class DatepickerWithToggle {
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput) input: OuiDatepickerInput<Date>;
  touchUI = true;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" />
    <oui-datepicker-toggle [for]="d">
      <div class="custom-icon" ouiDatepickerToggleIcon></div>
    </oui-datepicker-toggle>
    <oui-datepicker #d></oui-datepicker>
  `,
})
class DatepickerWithCustomIcon {}

@Component({
  template: `
    <oui-form-field>
      <input oui-input [ouiDatepicker]="d" />
      <oui-datepicker #d></oui-datepicker>
    </oui-form-field>
  `,
})
class FormFieldDatepicker {
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput)
  datepickerInput: OuiDatepickerInput<Date>;
  @ViewChild(OuiFormField) formField: OuiFormField;
}

@Component({
  template: `
    <input
      [ouiDatepicker]="d"
      [(ngModel)]="date"
      [min]="minDate"
      [max]="maxDate"
    />
    <oui-datepicker-toggle [for]="d"></oui-datepicker-toggle>
    <oui-datepicker #d></oui-datepicker>
  `,
})
class DatepickerWithMinAndMaxValidation {
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  date: Date | null;
  minDate = new Date(2010, JAN, 1);
  maxDate = new Date(2020, JAN, 1);
}

@Component({
  template: `
    <input
      [ouiDatepicker]="d"
      [(ngModel)]="date"
      [ouiDatepickerFilter]="filter"
    />
    <oui-datepicker-toggle [for]="d"></oui-datepicker-toggle>
    <oui-datepicker #d [touchUi]="true"></oui-datepicker>
  `,
})
class DatepickerWithFilterAndValidation {
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  date: Date;
  filter = (date: Date) => date.getDate() !== 1;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" [(ngModel)]="date" />
    <oui-datepicker #d></oui-datepicker>
  `,
})
class DatepickerWithi18n {
  date: Date | null = new Date(2010, JAN, 1);
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput)
  datepickerInput: OuiDatepickerInput<Date>;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" [(ngModel)]="value" [min]="min" [max]="max" />
    <oui-datepicker #d [startAt]="startAt"></oui-datepicker>
  `,
})
class DatepickerWithISOStrings {
  value = new Date(2017, JUN, 1).toISOString();
  min = new Date(2017, JAN, 1).toISOString();
  max = new Date(2017, DEC, 31).toISOString();
  startAt = new Date(2017, JUL, 1).toISOString();
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput)
  datepickerInput: OuiDatepickerInput<Date>;
}

@Component({
  template: `
    <input [(ngModel)]="selected" [ouiDatepicker]="d" />
    <oui-datepicker
      (opened)="openedSpy()"
      (closed)="closedSpy()"
      #d
    ></oui-datepicker>
  `,
})
class DatepickerWithEvents {
  selected: Date | null = null;
  openedSpy = jasmine.createSpy('opened spy');
  closedSpy = jasmine.createSpy('closed spy');
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
}

@Component({
  template: `
    <input (focus)="d.open()" [ouiDatepicker]="d" />
    <oui-datepicker #d="ouiDatepicker"></oui-datepicker>
  `,
})
class DatepickerOpeningOnFocus {
  @ViewChild(OuiDatepicker) datepicker: OuiDatepicker<Date>;
}

@Component({
  template: `
    <div class="custom-element">Custom element</div>
    <oui-calendar-header></oui-calendar-header>
  `,
})
class CustomHeaderForDatepicker {}
@Component({
  template: `
    <input [ouiDatepicker]="ch" />
    <oui-datepicker
      #ch
      [calendarHeaderComponent]="customHeaderForDatePicker"
    ></oui-datepicker>
  `,
})
class DatepickerWithCustomHeader {
  @ViewChild('ch') datepicker: OuiDatepicker<Date>;
  customHeaderForDatePicker = CustomHeaderForDatepicker;
}

@Component({
  template: `
    <input [ouiDatepicker]="assignedDatepicker" [value]="date" />
    <oui-datepicker #d [touchUi]="touch"></oui-datepicker>
  `,
})
class DelayedDatepicker {
  @ViewChild('d') datepicker: OuiDatepicker<Date>;
  @ViewChild(OuiDatepickerInput)
  datepickerInput: OuiDatepickerInput<Date>;
  date: Date | null;
  assignedDatepicker: OuiDatepicker<Date>;
}

@Component({
  template: `
    <input [ouiDatepicker]="d" />
    <oui-datepicker-toggle tabIndex="7" [for]="d">
      <div class="custom-icon" ouiDatepickerToggleIcon></div>
    </oui-datepicker-toggle>
    <oui-datepicker #d></oui-datepicker>
  `,
})
class DatepickerWithTabindexOnToggle {}

describe('OuiDatepicker', () => {
  // Creates a test component fixture.
  function createComponent(
    component: Type<any>,
    imports: Type<any>[] = [],
    providers: (FactoryProvider | ValueProvider)[] = [],
    entryComponents: Type<any>[] = []
  ): ComponentFixture<any> {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        OuiDatepickerModule,
        OuiFormFieldModule,
        OuiInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        ...imports,
      ],
      providers,
      declarations: [component, ...entryComponents],
    });

    return TestBed.createComponent(component);
  }

  afterEach(inject([OverlayContainer], (container: OverlayContainer) => {
    container.ngOnDestroy();
  }));

  describe('with OuiNativeDateModule', () => {
    describe('standard datepicker', () => {
      let fixture: ComponentFixture<StandardDatepicker>;
      let testComponent: StandardDatepicker;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(StandardDatepicker, [OuiNativeDateModule]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('open non-touch should open popup', () => {
        expect(
          document.querySelector('.cdk-overlay-pane.oui-datepicker-popup')
        ).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(
          document.querySelector('.cdk-overlay-pane.oui-datepicker-popup')
        ).not.toBeNull();
      });

      it('touch should open dialog', () => {
        testComponent.touch = true;
        fixture.detectChanges();

        expect(
          document.querySelector('.oui-datepicker-dialog oui-dialog-container')
        ).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(
          document.querySelector('.oui-datepicker-dialog oui-dialog-container')
        ).not.toBeNull();
      });

      it('should open datepicker if opened input is set to true', fakeAsync(() => {
        testComponent.opened = true;
        fixture.detectChanges();
        flush();

        expect(
          document.querySelector('.oui-datepicker-content')
        ).not.toBeNull();

        testComponent.opened = false;
        fixture.detectChanges();
        flush();

        expect(document.querySelector('.oui-datepicker-content')).toBeNull();
      }));

      it('open in disabled mode should not open the calendar', () => {
        testComponent.disabled = true;
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();
        expect(document.querySelector('oui-dialog-container')).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();
        expect(document.querySelector('oui-dialog-container')).toBeNull();
      });

      it('disabled datepicker input should open the calendar if datepicker is enabled', () => {
        testComponent.datepicker.disabled = false;
        testComponent.datepickerInput.disabled = true;
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane')).not.toBeNull();
      });

      it('close should close popup', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        const popup = document.querySelector('.cdk-overlay-pane')!;
        expect(popup).not.toBeNull();
        // eslint-disable-next-line radix
        expect(parseInt(getComputedStyle(popup).height as string)).not.toBe(0);

        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
        // eslint-disable-next-line radix
        expect(parseInt(getComputedStyle(popup).height as string)).toBe(0);
      }));

      it('should set the proper role on the popup', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        const popup = document.querySelector('.cdk-overlay-pane')!;
        expect(popup).toBeTruthy();
        expect(popup.getAttribute('role')).toBe('dialog');
      }));

      it('close should close dialog', fakeAsync(() => {
        testComponent.touch = true;
        fixture.detectChanges();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('oui-dialog-container')).not.toBeNull();

        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();

        expect(document.querySelector('oui-dialog-container')).toBeNull();
      }));

      it('startAt should fallback to input value', () => {
        expect(testComponent.datepicker.startAt).toEqual(
          new Date(2020, JAN, 1)
        );
      });

      it('should attach popup to native input', () => {
        const attachToRef =
          testComponent.datepickerInput.getConnectedOverlayOrigin();
        expect(attachToRef.nativeElement.tagName.toLowerCase()).toBe(
          'input',
          'popup should be attached to native input'
        );
      });

      it('input should aria-owns calendar after opened in non-touch mode', fakeAsync(() => {
        const inputEl = fixture.debugElement.query(By.css('input'))
          .nativeElement as HTMLElement;
        expect(inputEl.getAttribute('aria-owns')).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        const ownedElementId = inputEl.getAttribute('aria-owns');
        expect(ownedElementId).not.toBeNull();

        const ownedElement = document.getElementById(ownedElementId);
        expect(ownedElement).not.toBeNull();
        expect((ownedElement as Element).tagName.toLowerCase()).toBe(
          'oui-calendar'
        );
      }));

      it('input should aria-owns calendar after opened in touch mode', () => {
        testComponent.touch = true;
        fixture.detectChanges();

        const inputEl = fixture.debugElement.query(By.css('input'))
          .nativeElement as HTMLElement;
        expect(inputEl.getAttribute('aria-owns')).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();

        const ownedElementId = inputEl.getAttribute('aria-owns');
        expect(ownedElementId).not.toBeNull();

        const ownedElement = document.getElementById(ownedElementId);
        expect(ownedElement).not.toBeNull();
        expect((ownedElement as Element).tagName.toLowerCase()).toBe(
          'oui-calendar'
        );
      });

      it('should not throw when given wrong data type', () => {
        testComponent.date = '1/1/2017' as any;

        expect(() => fixture.detectChanges()).not.toThrow();
      });

      it('should clear out the backdrop subscriptions on close', fakeAsync(() => {
        for (let i = 0; i < 3; i++) {
          testComponent.datepicker.open();
          fixture.detectChanges();

          testComponent.datepicker.close();
          fixture.detectChanges();
        }

        testComponent.datepicker.open();
        fixture.detectChanges();

        const spy = jasmine.createSpy('close event spy');
        const subscription =
          testComponent.datepicker.closedStream.subscribe(spy);
        const backdrop = document.querySelector(
          '.cdk-overlay-backdrop'
        )! as HTMLElement;

        backdrop.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(testComponent.datepicker.opened).toBe(false);
        subscription.unsubscribe();
      }));

      it('should reset the datepicker when it is closed externally', fakeAsync(
        inject([OverlayContainer], (oldOverlayContainer: OverlayContainer) => {
          // Destroy the old container manually since resetting the testing module won't do it.
          oldOverlayContainer.ngOnDestroy();
          TestBed.resetTestingModule();

          const scrolledSubject: Subject<void> = new Subject();

          // Stub out a `CloseScrollStrategy` so we can trigger a detachment via the `OverlayRef`.
          fixture = createComponent(
            StandardDatepicker,
            [OuiNativeDateModule],
            [
              {
                provide: ScrollDispatcher,
                useValue: { scrolled: () => scrolledSubject },
              },
              {
                provide: OUI_DATEPICKER_SCROLL_STRATEGY,
                deps: [Overlay],
                useFactory: (overlay: Overlay) => () =>
                  overlay.scrollStrategies.close(),
              },
            ]
          );

          fixture.detectChanges();
          testComponent = fixture.componentInstance;

          testComponent.datepicker.open();
          fixture.detectChanges();

          expect(testComponent.datepicker.opened).toBe(true);

          scrolledSubject.next();
          flush();
          fixture.detectChanges();

          expect(testComponent.datepicker.opened).toBe(false);
        })
      ));
    });

    describe('datepicker with too many inputs', () => {
      it('should throw when multiple inputs registered', fakeAsync(() => {
        const fixture = createComponent(MultiInputDatepicker, [
          OuiNativeDateModule,
        ]);
        expect(() => fixture.detectChanges()).toThrow();
      }));
    });

    describe('datepicker that is assigned to input at a later point', () => {
      it('should handle value changes when a datepicker is assigned after init', fakeAsync(() => {
        const fixture = createComponent(DelayedDatepicker, [
          OuiNativeDateModule,
        ]);
        const testComponent: DelayedDatepicker = fixture.componentInstance;
        const toSelect = new Date(2017, JAN, 1);

        fixture.detectChanges();

        expect(testComponent.datepickerInput.value).toBeNull();
        expect(testComponent.datepicker._selected).toBeNull();

        testComponent.assignedDatepicker = testComponent.datepicker;
        fixture.detectChanges();

        testComponent.assignedDatepicker.select(toSelect);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(testComponent.datepickerInput.value).toEqual(toSelect);
        expect(testComponent.datepicker._selected).toEqual(toSelect);
      }));
    });

    describe('datepicker with no inputs', () => {
      let fixture: ComponentFixture<NoInputDatepicker>;
      let testComponent: NoInputDatepicker;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(NoInputDatepicker, [OuiNativeDateModule]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should not throw when accessing disabled property', () => {
        expect(() => testComponent.datepicker.disabled).not.toThrow();
      });

      it('should throw when opened with no registered inputs', fakeAsync(() => {
        expect(() => testComponent.datepicker.open()).toThrow();
      }));
    });

    describe('datepicker with startAt', () => {
      let fixture: ComponentFixture<DatepickerWithStartAt>;
      let testComponent: DatepickerWithStartAt;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithStartAt, [OuiNativeDateModule]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('explicit startAt should override input value', () => {
        expect(testComponent.datepicker.startAt).toEqual(
          new Date(2010, JAN, 1)
        );
      });
    });

    describe('datepicker with startView set to year', () => {
      let fixture: ComponentFixture<DatepickerWithStartViewYear>;
      let testComponent: DatepickerWithStartViewYear;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithStartViewYear, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('should start at the specified view', () => {
        testComponent.datepicker.open();
        fixture.detectChanges();

        const firstCalendarCell = document.querySelector(
          '.oui-calendar-body-cell'
        )!;

        // When the calendar is in year view, the first cell should be for a month rather than
        // for a date.
        expect(firstCalendarCell.textContent!.trim()).toBe(
          'JAN',
          'Expected the calendar to be in year-view'
        );
      });
    });

    describe('datepicker with startView set to multiyear', () => {
      let fixture: ComponentFixture<DatepickerWithStartViewMultiYear>;
      let testComponent: DatepickerWithStartViewMultiYear;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithStartViewMultiYear, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;

        spyOn(testComponent, 'onMultiYearSelection');
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('should start at the specified view', () => {
        testComponent.datepicker.open();
        fixture.detectChanges();

        const firstCalendarCell = document.querySelector(
          '.oui-calendar-body-cell'
        )!;

        // When the calendar is in year view, the first cell should be for a month rather than
        // for a date.
        expect(firstCalendarCell.textContent!.trim()).toBe(
          '2016',
          'Expected the calendar to be in multi-year-view'
        );
      });
    });

    describe('datepicker with ngModel', () => {
      let fixture: ComponentFixture<DatepickerWithNgModel>;
      let testComponent: DatepickerWithNgModel;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithNgModel, [OuiNativeDateModule]);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          testComponent = fixture.componentInstance;
        });
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should update datepicker when model changes', fakeAsync(() => {
        expect(testComponent.datepickerInput.value).toBeNull();
        expect(testComponent.datepicker._selected).toBeNull();

        const selected = new Date(2017, JAN, 1);
        testComponent.selected = selected;
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(testComponent.datepickerInput.value).toEqual(selected);
        expect(testComponent.datepicker._selected).toEqual(selected);
      }));

      it('should update model when date is selected', fakeAsync(() => {
        expect(testComponent.selected).toBeNull();
        expect(testComponent.datepickerInput.value).toBeNull();

        const selected = new Date(2017, JAN, 1);
        testComponent.datepicker.select(selected);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(testComponent.selected).toEqual(selected);
        expect(testComponent.datepickerInput.value).toEqual(selected);
      }));

      it('should mark input dirty after date selected', fakeAsync(() => {
        const inputEl = fixture.debugElement.query(
          By.css('input')
        ).nativeElement;

        expect(inputEl.classList).toContain('ng-pristine');

        testComponent.datepicker.select(new Date(2017, JAN, 1));
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-dirty');
      }));

      it('should not mark dirty after model change', fakeAsync(() => {
        const inputEl = fixture.debugElement.query(
          By.css('input')
        ).nativeElement;

        expect(inputEl.classList).toContain('ng-pristine');

        testComponent.selected = new Date(2017, JAN, 1);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-pristine');
      }));

      it('should mark input touched on calendar selection', fakeAsync(() => {
        const inputEl = fixture.debugElement.query(
          By.css('input')
        ).nativeElement;

        expect(inputEl.classList).toContain('ng-untouched');

        testComponent.datepicker.select(new Date(2017, JAN, 1));
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-touched');
      }));
    });

    describe('datepicker with formControl', () => {
      let fixture: ComponentFixture<DatepickerWithFormControl>;
      let testComponent: DatepickerWithFormControl;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithFormControl, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should update datepicker when formControl changes', () => {
        expect(testComponent.datepickerInput.value).toBeNull();
        expect(testComponent.datepicker._selected).toBeNull();

        const selected = new Date(2017, JAN, 1);
        testComponent.formControl.setValue(selected);
        fixture.detectChanges();

        expect(testComponent.datepickerInput.value).toEqual(selected);
        expect(testComponent.datepicker._selected).toEqual(selected);
      });

      it('should update formControl when date is selected', () => {
        expect(testComponent.formControl.value).toBeNull();
        expect(testComponent.datepickerInput.value).toBeNull();

        const selected = new Date(2017, JAN, 1);
        testComponent.datepicker.select(selected);
        fixture.detectChanges();

        expect(testComponent.formControl.value).toEqual(selected);
        expect(testComponent.datepickerInput.value).toEqual(selected);
      });
    });

    describe('datepicker with oui-datepicker-toggle', () => {
      let fixture: ComponentFixture<DatepickerWithToggle>;
      let testComponent: DatepickerWithToggle;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithToggle, [OuiNativeDateModule]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('should set `aria-haspopup` on the toggle button', () => {
        const button = fixture.debugElement.query(By.css('button'));

        expect(button).toBeTruthy();
        expect(button.nativeElement.getAttribute('aria-haspopup')).toBe('true');
      });

      it('should set the `button` type on the trigger to prevent form submissions', () => {
        const toggle = fixture.debugElement.query(
          By.css('button')
        ).nativeElement;
        expect(toggle.getAttribute('type')).toBe('button');
      });

      it('should remove the underlying SVG icon from the tab order', () => {
        const icon = fixture.debugElement.nativeElement.querySelector('svg');
        expect(icon.getAttribute('focusable')).toBe('false');
      });

      it('should restore focus to the toggle after the calendar is closed', () => {
        const toggle = fixture.debugElement.query(By.css('button'))
          .nativeElement as HTMLElement;

        fixture.componentInstance.touchUI = false;
        fixture.detectChanges();

        toggle.focus();
        expect(document.activeElement)
          .withContext('Expected toggle to be focused.')
          .toBe(toggle);

        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();

        const pane = document.querySelector('.cdk-overlay-pane')!;

        expect(pane).toBeTruthy('Expected calendar to be open.');
        expect(pane.contains(document.activeElement)).toBe(
          true,
          'Expected focus to be inside the calendar.'
        );

        fixture.componentInstance.datepicker.close();
        fixture.detectChanges();

        expect(document.activeElement).toBe(
          toggle,
          'Expected focus to be restored to toggle.'
        );
      });

      it('should re-render when the i18n labels change', inject(
        [OuiDatepickerIntl],
        (intl: OuiDatepickerIntl) => {
          const toggle = fixture.debugElement.query(
            By.css('button')
          ).nativeElement;

          intl.openCalendarLabel = 'Open the calendar, perhaps?';
          intl.changes.next();
          fixture.detectChanges();

          expect(toggle.getAttribute('aria-label')).toBe(
            'Open the calendar, perhaps?'
          );
        }
      ));

      it('should toggle the active state of the datepicker toggle', fakeAsync(() => {
        const toggle = fixture.debugElement.query(
          By.css('oui-datepicker-toggle')
        ).nativeElement;

        expect(toggle.classList).not.toContain('oui-datepicker-toggle-active');

        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();
        flush();

        expect(toggle.classList).toContain('oui-datepicker-toggle-active');

        fixture.componentInstance.datepicker.close();
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(toggle.classList).not.toContain('oui-datepicker-toggle-active');
      }));
    });

    describe('datepicker with custom oui-datepicker-toggle icon', () => {
      it('should be able to override the oui-datepicker-toggle icon', fakeAsync(() => {
        const fixture = createComponent(DatepickerWithCustomIcon, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();
        expect(
          fixture.nativeElement.querySelector(
            '.oui-datepicker-toggle .custom-icon'
          )
        ).toBeTruthy('Expected custom icon to be rendered.');

        expect(
          fixture.nativeElement.querySelector('.oui-datepicker-toggle oui-icon')
        ).toBeFalsy('Expected default icon to be removed.');
      }));
    });

    describe('datepicker with tabindex on oui-datepicker-toggle', () => {
      it('should forward the tabindex to the underlying button', () => {
        const fixture = createComponent(DatepickerWithTabindexOnToggle, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector(
          '.oui-datepicker-toggle button'
        );

        expect(button.getAttribute('tabindex')).toBe('7');
      });

      it('should clear the tabindex from the oui-datepicker-toggle host', () => {
        const fixture = createComponent(DatepickerWithTabindexOnToggle, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        const host = fixture.nativeElement.querySelector(
          '.oui-datepicker-toggle'
        );

        expect(host.getAttribute('tabindex')).toBe('-1');
      });

      it('should forward focus to the underlying button when the host is focused', () => {
        const fixture = createComponent(DatepickerWithTabindexOnToggle, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        const host = fixture.nativeElement.querySelector(
          '.oui-datepicker-toggle'
        ) as HTMLElement;
        const button = host.querySelector('button');

        expect(document.activeElement).not.toBe(button);

        host.focus();

        expect(document.activeElement).toBe(button);
      });
    });

    describe('datepicker inside oui-form-field', () => {
      let fixture: ComponentFixture<FormFieldDatepicker>;
      let testComponent: FormFieldDatepicker;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(FormFieldDatepicker, [OuiNativeDateModule]);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('should pass the form field theme color to the overlay', fakeAsync(() => {
        testComponent.formField.color = 'primary';
        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        let contentEl = document.querySelector('.oui-datepicker-content')!;

        expect(contentEl.classList).toContain('oui-primary');

        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();

        testComponent.formField.color = 'warn';
        testComponent.datepicker.open();

        contentEl = document.querySelector('.oui-datepicker-content')!;
        fixture.detectChanges();
        flush();

        expect(contentEl.classList).toContain('oui-warn');
        expect(contentEl.classList).not.toContain('oui-primary');
      }));

      it('should prefer the datepicker color over the form field one', fakeAsync(() => {
        testComponent.datepicker.color = 'accent';
        testComponent.formField.color = 'warn';
        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        const contentEl = document.querySelector('.oui-datepicker-content')!;

        expect(contentEl.classList).toContain('oui-accent');
        expect(contentEl.classList).not.toContain('oui-warn');
      }));
    });

    describe('datepicker with min and max dates and validation', () => {
      let fixture: ComponentFixture<DatepickerWithMinAndMaxValidation>;
      let testComponent: DatepickerWithMinAndMaxValidation;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithMinAndMaxValidation, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should use min and max dates specified by the input', () => {
        expect(testComponent.datepicker._minDate).toEqual(
          new Date(2010, JAN, 1)
        );
        expect(testComponent.datepicker._maxDate).toEqual(
          new Date(2020, JAN, 1)
        );
      });

      it('should mark invalid when value is before min', fakeAsync(() => {
        testComponent.date = new Date(2009, DEC, 31);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.classList
        ).toContain('ng-invalid');
      }));

      it('should mark invalid when value is after max', fakeAsync(() => {
        testComponent.date = new Date(2020, JAN, 2);
        fixture.detectChanges();
        flush();

        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.classList
        ).toContain('ng-invalid');
      }));

      it('should not mark invalid when value equals min', fakeAsync(() => {
        testComponent.date = testComponent.datepicker._minDate;
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.classList
        ).not.toContain('ng-invalid');
      }));

      it('should not mark invalid when value equals max', fakeAsync(() => {
        testComponent.date = testComponent.datepicker._maxDate;
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.classList
        ).not.toContain('ng-invalid');
      }));

      it('should not mark invalid when value is between min and max', fakeAsync(() => {
        testComponent.date = new Date(2010, JAN, 2);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.classList
        ).not.toContain('ng-invalid');
      }));
    });

    describe('datepicker with filter and validation', () => {
      let fixture: ComponentFixture<DatepickerWithFilterAndValidation>;
      let testComponent: DatepickerWithFilterAndValidation;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithFilterAndValidation, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('should mark input invalid', fakeAsync(() => {
        testComponent.date = new Date(2017, JAN, 1);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.classList
        ).toContain('ng-invalid');

        testComponent.date = new Date(2017, JAN, 2);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.classList
        ).not.toContain('ng-invalid');
      }));

      it('should disable filtered calendar cells', () => {
        fixture.detectChanges();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('oui-dialog-container')).not.toBeNull();

        const cells = document.querySelectorAll('.oui-calendar-body-cell');
        expect(cells[0].classList).toContain('oui-calendar-body-disabled');
        expect(cells[1].classList).not.toContain('oui-calendar-body-disabled');
      });
    });

    describe('with ISO 8601 strings as input', () => {
      let fixture: ComponentFixture<DatepickerWithISOStrings>;
      let testComponent: DatepickerWithISOStrings;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithISOStrings, [
          OuiNativeDateModule,
        ]);
        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should coerce ISO strings', fakeAsync(() => {
        expect(() => fixture.detectChanges()).not.toThrow();
        flush();
        fixture.detectChanges();

        expect(testComponent.datepicker.startAt).toEqual(
          new Date(2017, JUL, 1)
        );
        expect(testComponent.datepickerInput.value).toEqual(
          new Date(2017, JUN, 1)
        );
        expect(testComponent.datepickerInput.min).toEqual(
          new Date(2017, JAN, 1)
        );
        expect(testComponent.datepickerInput.max).toEqual(
          new Date(2017, DEC, 31)
        );
      }));
    });

    describe('with events', () => {
      let fixture: ComponentFixture<DatepickerWithEvents>;
      let testComponent: DatepickerWithEvents;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithEvents, [OuiNativeDateModule]);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('should dispatch an event when a datepicker is opened', () => {
        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(testComponent.openedSpy).toHaveBeenCalled();
      });

      it('should dispatch an event when a datepicker is closed', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();

        testComponent.datepicker.close();
        flush();
        fixture.detectChanges();

        expect(testComponent.closedSpy).toHaveBeenCalled();
      }));
    });

    describe('datepicker that opens on focus', () => {
      let fixture: ComponentFixture<DatepickerOpeningOnFocus>;
      let testComponent: DatepickerOpeningOnFocus;
      let input: HTMLInputElement;
      console.log(testComponent);
      console.log(input);

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerOpeningOnFocus, [
          OuiNativeDateModule,
        ]);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        input = fixture.debugElement.query(By.css('input')).nativeElement;
      }));
    });

    describe('datepicker directionality', () => {
      it('should pass along the directionality to the popup', () => {
        const fixture = createComponent(
          StandardDatepicker,
          [OuiNativeDateModule],
          [
            {
              provide: Directionality,
              useValue: { value: 'rtl' },
            },
          ]
        );

        fixture.detectChanges();
        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();

        const overlay = document.querySelector(
          '.cdk-overlay-connected-position-bounding-box'
        )!;

        expect(overlay.getAttribute('dir')).toBe('rtl');
      });

      it('should update the popup direction if the directionality value changes', fakeAsync(() => {
        const dirProvider = { value: 'ltr' };
        const fixture = createComponent(
          StandardDatepicker,
          [OuiNativeDateModule],
          [
            {
              provide: Directionality,
              useFactory: () => dirProvider,
            },
          ]
        );

        fixture.detectChanges();
        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();

        let overlay = document.querySelector(
          '.cdk-overlay-connected-position-bounding-box'
        )!;

        expect(overlay.getAttribute('dir')).toBe('ltr');

        fixture.componentInstance.datepicker.close();
        fixture.detectChanges();
        flush();

        dirProvider.value = 'rtl';
        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();

        overlay = document.querySelector(
          '.cdk-overlay-connected-position-bounding-box'
        )!;

        expect(overlay.getAttribute('dir')).toBe('rtl');
      }));

      it('should pass along the directionality to the dialog in touch mode', () => {
        const fixture = createComponent(
          StandardDatepicker,
          [OuiNativeDateModule],
          [
            {
              provide: Directionality,
              useValue: { value: 'rtl' },
            },
          ]
        );

        fixture.componentInstance.touch = true;
        fixture.detectChanges();
        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();

        const overlay = document.querySelector('.cdk-global-overlay-wrapper')!;

        expect(overlay.getAttribute('dir')).toBe('rtl');
      });
    });
  });

  describe('internationalization', () => {
    let fixture: ComponentFixture<DatepickerWithi18n>;
    let testComponent: DatepickerWithi18n;
    let input: HTMLInputElement;
    console.log(testComponent);
    console.log(input);

    beforeEach(fakeAsync(() => {
      fixture = createComponent(
        DatepickerWithi18n,
        [OuiNativeDateModule, NativeDateModule],
        [{ provide: OUI_DATE_LOCALE, useValue: 'de-DE' }]
      );
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    }));
  });

  describe('datepicker with custom header', () => {
    let fixture: ComponentFixture<DatepickerWithCustomHeader>;
    let testComponent: DatepickerWithCustomHeader;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(
        DatepickerWithCustomHeader,
        [OuiNativeDateModule],
        [],
        [CustomHeaderForDatepicker]
      );
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('should instantiate a datepicker with a custom header', fakeAsync(() => {
      expect(testComponent).toBeTruthy();
    }));

    it('should find the standard header element', fakeAsync(() => {
      testComponent.datepicker.open();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(document.querySelector('oui-calendar-header')).toBeTruthy();
    }));

    it('should find the custom element', fakeAsync(() => {
      testComponent.datepicker.open();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(document.querySelector('.custom-element')).toBeTruthy();
    }));
  });
});
