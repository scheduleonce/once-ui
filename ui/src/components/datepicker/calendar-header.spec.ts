import { Directionality } from '@angular/cdk/bidi';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OuiNativeDateModule } from './native-date.module';
import { By } from '@angular/platform-browser';
import { OuiCalendar } from './calendar';
import { OuiDatepickerIntl } from './datepicker-intl';
import { OuiDatepickerModule } from './datepicker-module';
import { yearsPerPage } from './multi-year-view';

const JAN = 0;
const FEB = 1;
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
})
class StandardCalendar {
  selected: Date;
  selectedYear: Date;
  selectedMonth: Date;
  startDate = new Date(2017, JAN, 31);
}

describe('OuiCalendarHeader', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiNativeDateModule, OuiDatepickerModule],
      declarations: [
        // Test components.
        StandardCalendar,
      ],
      providers: [
        OuiDatepickerIntl,
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
    let prevButton: HTMLElement;
    let nextButton: HTMLElement;
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
      prevButton = calendarElement.querySelector(
        '.oui-calendar-previous-button'
      ) as HTMLElement;
      nextButton = calendarElement.querySelector(
        '.oui-calendar-next-button'
      ) as HTMLElement;

      calendarInstance = calendarDebugElement.componentInstance;
      testComponent = fixture.componentInstance;
    });

    it('should be in month view with specified month active', () => {
      expect(calendarInstance.currentView).toBe('month');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));
    });

    it('should toggle view when period clicked', () => {
      expect(calendarInstance.currentView).toBe('month');

      periodButton.click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('multi-year');

      periodButton.click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('month');
    });

    it('should go to next and previous month', () => {
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));

      nextButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2017, FEB, 28));

      prevButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 28));
    });

    it('should go to previous and next year', () => {
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

      nextButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2018, JAN, 31));

      prevButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));
    });

    it('should go to previous and next multi-year range', () => {
      periodButton.click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('multi-year');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));

      nextButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(
        new Date(2017 + yearsPerPage, JAN, 31)
      );

      prevButton.click();
      fixture.detectChanges();

      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));
    });

    it('should go back to month view after selecting year and month', () => {
      periodButton.click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('multi-year');
      expect(calendarInstance.activeDate).toEqual(new Date(2017, JAN, 31));

      const yearCells = calendarElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      (yearCells[0] as HTMLElement).click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('year');
      expect(calendarInstance.activeDate).toEqual(new Date(2016, JAN, 31));

      const monthCells = calendarElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      (monthCells[monthCells.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      expect(calendarInstance.currentView).toBe('month');
      expect(calendarInstance.activeDate).toEqual(new Date(2016, DEC, 31));
      expect(testComponent.selected).toBeFalsy(
        'no date should be selected yet'
      );
    });
  });
});
