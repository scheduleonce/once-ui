import { Directionality } from '@angular/cdk/bidi';
import { Component, NgZone, EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { DateAdapter, OuiNativeDateModule } from './native-date.module';
import { By } from '@angular/platform-browser';
import { OuiCalendar } from './calendar';
import { OuiDatepickerIntl } from './datepicker-intl';
import { OuiDatepickerModule } from './datepicker-module';

const JAN = 0;
const FEB = 1;
const JUL = 6;
const NOV = 10;
const DEC = 11;

@Component({
  template: `
    <oui-calendar
      [startAt]="startDate"
      [(selected)]="selected"
      (yearSelected)="selectedYear = $event"
      (monthSelected)="selectedMonth = $event"
    >
    </oui-calendar>
  `,
  standalone: false,
})
class StandardCalendar {
  selected: Date;
  selectedYear: Date;
  selectedMonth: Date;
  startDate = new Date(2017, JAN, 31);
}

@Component({
  template: `
    <oui-calendar
      [startAt]="startAt"
      [minDate]="minDate"
      [maxDate]="maxDate"
    ></oui-calendar>
  `,
  standalone: false,
})
class CalendarWithMinMax {
  startAt: Date;
  minDate = new Date(2016, JAN, 1);
  maxDate = new Date(2018, JAN, 1);
}

@Component({
  template: `
    <oui-calendar
      [startAt]="startDate"
      [(selected)]="selected"
      [dateFilter]="dateFilter"
    >
    </oui-calendar>
  `,
  standalone: false,
})
class CalendarWithDateFilter {
  selected: Date;
  startDate = new Date(2017, JAN, 1);

  dateFilter(date: Date) {
    return !(date.getDate() % 2) && date.getMonth() !== NOV;
  }
}

@Component({
  template: `
    <oui-calendar
      [startAt]="startAt"
      (selectedChange)="select($event)"
      [selected]="selected"
      [minDate]="selected"
    >
    </oui-calendar>
  `,
  standalone: false,
})
class CalendarWithSelectableMinDate {
  startAt = new Date(2018, JUL, 0);
  selected: Date;
  minDate: Date;

  constructor() {
    this.select(new Date(2018, JUL, 10));
  }

  select(value: Date) {
    this.minDate = this.selected = value;
  }
}

export class MockNgZone extends NgZone {
  onStable: EventEmitter<any> = new EventEmitter(false);

  constructor() {
    super({ enableLongStackTrace: false });
  }

  run(fn: Function): any {
    return fn();
  }

  runOutsideAngular(fn: Function): any {
    return fn();
  }

  simulateZoneExit(): void {
    this.onStable.emit(null);
  }
}

describe('OuiCalendar', () => {
  // @ts-ignore: Used in provider factory below
  let zone: MockNgZone;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiNativeDateModule, OuiDatepickerModule],
      declarations: [
        // Test components.
        StandardCalendar,
        CalendarWithMinMax,
        CalendarWithDateFilter,
        CalendarWithSelectableMinDate,
      ],
      providers: [
        OuiDatepickerIntl,
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        { provide: Directionality, useFactory: () => ({ value: 'ltr' }) },
      ],
    });

    TestBed.compileComponents();
  }));

  describe('standard calendar', () => {
    let fixture: ComponentFixture<StandardCalendar>;
    let testComponent: StandardCalendar;
    let calendarElement: HTMLElement;
    let periodButton: HTMLElement;
    let calendarInstance: OuiCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardCalendar);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(
        By.directive(OuiCalendar)
      );
      calendarElement = calendarDebugElement.nativeElement;
      periodButton = calendarElement.querySelector(
        '.oui-calendar-period-button'
      ) as HTMLElement;

      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it(`should update today's date`, inject(
      [DateAdapter],
      (adapter: DateAdapter<Date>) => {
        let fakeToday = new Date(2018, 0, 1);
        spyOn(adapter, 'today').and.callFake(() => fakeToday);

        calendarInstance.activeDate = fakeToday;
        calendarInstance.updateTodaysDate();
        fixture.detectChanges();

        let todayCell = calendarElement.querySelector(
          '.oui-calendar-body-today'
        )!;
        expect(todayCell).not.toBeNull();
        expect(todayCell.innerHTML.trim()).toBe('1');

        fakeToday = new Date(2018, 0, 10);
        calendarInstance.updateTodaysDate();
        fixture.detectChanges();

        todayCell = calendarElement.querySelector('.oui-calendar-body-today')!;
        expect(todayCell).not.toBeNull();
        expect(todayCell.innerHTML.trim()).toBe('10');
      }
    ));

    it('should be in month view with specified month active', () => {
      expect(calendarInstance.currentView).toBe('month');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));
    });

    it('should select date in month view', () => {
      const monthCells = calendarElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      (monthCells[monthCells.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('month');
      expect(testComponent.selected).toEqual(new Date(2017, JAN, 31));
    });

    it('should emit the selected month on cell clicked in year view', () => {
      periodButton.click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('multi-year');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));

      (
        calendarElement.querySelector(
          '.oui-calendar-body-active'
        ) as HTMLElement
      ).click();

      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('year');

      (
        calendarElement.querySelector(
          '.oui-calendar-body-active'
        ) as HTMLElement
      ).click();

      const normalizedMonth: Date = fixture.componentInstance.selectedMonth;
      expect(normalizedMonth.getMonth()).toEqual(0);
    });

    it('should emit the selected year on cell clicked in multiyear view', () => {
      periodButton.click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('multi-year');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));

      (
        calendarElement.querySelector(
          '.oui-calendar-body-active'
        ) as HTMLElement
      ).click();

      fixture.detectChanges();

      const normalizedYear: Date = fixture.componentInstance.selectedYear;
      expect(normalizedYear.getFullYear()).toEqual(2017);
    });

    it('should re-render when the i18n labels have changed', inject(
      [OuiDatepickerIntl],
      (intl: OuiDatepickerIntl) => {
        const button = fixture.debugElement.nativeElement.querySelector(
          '.oui-calendar-period-button'
        );

        intl.switchToMultiYearViewLabel = 'Go to multi-year view?';
        intl.changes.next();
        fixture.detectChanges();

        expect(button.getAttribute('aria-label')).toBe(
          'Go to multi-year view?'
        );
      }
    ));

    it('should set all buttons to be `type="button"`', () => {
      const invalidButtons = calendarElement.querySelectorAll(
        'button:not([type="button"])'
      );
      expect(invalidButtons.length).toBe(0);
    });

    it('should complete the stateChanges stream', () => {
      const spy = jasmine.createSpy('complete spy');
      const subscription = calendarInstance.stateChanges.subscribe({
        complete: spy,
      });

      fixture.destroy();

      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  describe('calendar with min and max date', () => {
    let fixture: ComponentFixture<CalendarWithMinMax>;
    let testComponent: CalendarWithMinMax;
    let calendarElement: HTMLElement;
    let calendarInstance: OuiCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarWithMinMax);

      const calendarDebugElement = fixture.debugElement.query(
        By.directive(OuiCalendar)
      );
      calendarElement = calendarDebugElement.nativeElement;
      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should clamp startAt value below min date', () => {
      testComponent.startAt = new Date(2000, JAN, 1);
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));
    });

    it('should clamp startAt value above max date', () => {
      testComponent.startAt = new Date(2020, JAN, 1);
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));
    });

    it('should not go back past min date', () => {
      testComponent.startAt = new Date(2016, FEB, 1);
      fixture.detectChanges();

      const prevButton = calendarElement.querySelector(
        '.oui-calendar-previous-button'
      ) as HTMLButtonElement;

      expect(prevButton.disabled).toBe(
        false,
        'previous button should not be disabled'
      );
      expect(calendarInstance.activeDate).toEqual(new Date(2016, FEB, 1));

      prevButton.click();
      fixture.detectChanges();

      expect(prevButton.disabled).toBe(
        true,
        'previous button should be disabled'
      );
      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));

      prevButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 1));
    });

    it('should not go forward past max date', () => {
      testComponent.startAt = new Date(2017, DEC, 1);
      fixture.detectChanges();

      const nextButton = calendarElement.querySelector(
        '.oui-calendar-next-button'
      ) as HTMLButtonElement;

      expect(nextButton.disabled).toBe(
        false,
        'next button should not be disabled'
      );
      expect(calendarInstance.activeDate).toEqual(new Date(2017, DEC, 1));

      nextButton.click();
      fixture.detectChanges();

      expect(nextButton.disabled).toBe(true, 'next button should be disabled');
      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));

      nextButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 1));
    });

    it('should re-render the month view when the minDate changes', () => {
      fixture.detectChanges();
      spyOn(calendarInstance.monthView, '_init').and.callThrough();

      testComponent.minDate = new Date(2017, NOV, 1);
      fixture.detectChanges();

      expect(calendarInstance.monthView._init).toHaveBeenCalled();
    });

    it('should re-render the month view when the maxDate changes', () => {
      fixture.detectChanges();
      spyOn(calendarInstance.monthView, '_init').and.callThrough();

      testComponent.maxDate = new Date(2017, DEC, 1);
      fixture.detectChanges();

      expect(calendarInstance.monthView._init).toHaveBeenCalled();
    });

    it('should re-render the year view when the minDate changes', () => {
      fixture.detectChanges();
      const periodButton = calendarElement.querySelector(
        '.oui-calendar-period-button'
      ) as HTMLElement;
      periodButton.click();
      fixture.detectChanges();

      (
        calendarElement.querySelector(
          '.oui-calendar-body-active'
        ) as HTMLElement
      ).click();
      fixture.detectChanges();

      spyOn(calendarInstance.yearView, '_init').and.callThrough();

      testComponent.minDate = new Date(2017, NOV, 1);
      fixture.detectChanges();

      expect(calendarInstance.yearView._init).toHaveBeenCalled();
    });

    it('should re-render the year view when the maxDate changes', () => {
      fixture.detectChanges();
      const periodButton = calendarElement.querySelector(
        '.oui-calendar-period-button'
      ) as HTMLElement;
      periodButton.click();
      fixture.detectChanges();

      (
        calendarElement.querySelector(
          '.oui-calendar-body-active'
        ) as HTMLElement
      ).click();
      fixture.detectChanges();

      spyOn(calendarInstance.yearView, '_init').and.callThrough();

      testComponent.maxDate = new Date(2017, DEC, 1);
      fixture.detectChanges();

      expect(calendarInstance.yearView._init).toHaveBeenCalled();
    });

    it('should re-render the multi-year view when the minDate changes', () => {
      fixture.detectChanges();
      const periodButton = calendarElement.querySelector(
        '.oui-calendar-period-button'
      ) as HTMLElement;
      periodButton.click();
      fixture.detectChanges();

      spyOn(calendarInstance.multiYearView, '_init').and.callThrough();

      testComponent.minDate = new Date(2017, NOV, 1);
      fixture.detectChanges();

      expect(calendarInstance.multiYearView._init).toHaveBeenCalled();
    });

    it('should re-render the multi-year view when the maxDate changes', () => {
      fixture.detectChanges();
      const periodButton = calendarElement.querySelector(
        '.oui-calendar-period-button'
      ) as HTMLElement;
      periodButton.click();
      fixture.detectChanges();

      spyOn(calendarInstance.multiYearView, '_init').and.callThrough();

      testComponent.maxDate = new Date(2017, DEC, 1);
      fixture.detectChanges();

      expect(calendarInstance.multiYearView._init).toHaveBeenCalled();
    });

    it('should update the minDate in the child view if it changed after an interaction', () => {
      fixture.destroy();

      const dynamicFixture = TestBed.createComponent(
        CalendarWithSelectableMinDate
      );
      dynamicFixture.detectChanges();

      const calendarDebugElement = dynamicFixture.debugElement.query(
        By.directive(OuiCalendar)
      );
      const disabledClass = 'oui-calendar-body-disabled';
      calendarElement = calendarDebugElement.nativeElement;
      calendarInstance = calendarDebugElement.componentInstance;

      let cells = Array.from(
        calendarElement.querySelectorAll('.oui-calendar-body-cell')
      );

      expect(
        cells.slice(0, 9).every((c) => c.classList.contains(disabledClass))
      ).toBe(true, 'Expected dates up to the 10th to be disabled.');

      expect(
        cells.slice(9).every((c) => c.classList.contains(disabledClass))
      ).toBe(false, 'Expected dates after the 10th to be enabled.');

      (cells[14] as HTMLElement).click();
      dynamicFixture.detectChanges();
      cells = Array.from(
        calendarElement.querySelectorAll('.oui-calendar-body-cell')
      );

      expect(
        cells.slice(0, 14).every((c) => c.classList.contains(disabledClass))
      ).toBe(true, 'Expected dates up to the 14th to be disabled.');

      expect(
        cells.slice(14).every((c) => c.classList.contains(disabledClass))
      ).toBe(false, 'Expected dates after the 14th to be enabled.');
    });
  });

  describe('calendar with date filter', () => {
    let fixture: ComponentFixture<CalendarWithDateFilter>;
    let testComponent: CalendarWithDateFilter;
    let calendarElement: HTMLElement;
    // @ts-ignore: Used in beforeEach
    let calendarInstance: OuiCalendar<Date>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CalendarWithDateFilter);
      fixture.detectChanges();

      const calendarDebugElement = fixture.debugElement.query(
        By.directive(OuiCalendar)
      );
      calendarElement = calendarDebugElement.nativeElement;
      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should disable and prevent selection of filtered dates', () => {
      const cells = calendarElement.querySelectorAll('.oui-calendar-body-cell');
      (cells[0] as HTMLElement).click();
      fixture.detectChanges();

      expect(testComponent.selected).toBeFalsy();

      (cells[1] as HTMLElement).click();
      fixture.detectChanges();

      expect(testComponent.selected).toEqual(new Date(2017, JAN, 2));
    });
  });
});
