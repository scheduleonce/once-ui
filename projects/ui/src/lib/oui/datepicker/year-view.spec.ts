import { Direction, Directionality } from '@angular/cdk/bidi';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OuiNativeDateModule } from './native-date.module';
import { By } from '@angular/platform-browser';
import { OuiCalendarBody } from './calendar-body';
import { OuiYearView } from './year-view';
export const JAN = 0,
  FEB = 1,
  MAR = 2,
  APR = 3,
  MAY = 4,
  JUN = 5,
  JUL = 6,
  AUG = 7,
  SEP = 8,
  OCT = 9,
  NOV = 10,
  DEC = 11;

describe('OuiYearView', () => {
  let dir: { value: Direction };
  console.log(dir);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OuiNativeDateModule],
      declarations: [
        OuiCalendarBody,
        OuiYearView,

        // Test components.
        StandardYearView,
        YearViewWithDateFilter
      ],
      providers: [
        { provide: Directionality, useFactory: () => (dir = { value: 'ltr' }) }
      ]
    });

    TestBed.compileComponents();
  }));

  describe('standard year view', () => {
    let fixture: ComponentFixture<StandardYearView>;
    let testComponent: StandardYearView;
    let yearViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardYearView);
      fixture.detectChanges();

      let yearViewDebugElement = fixture.debugElement.query(
        By.directive(OuiYearView)
      );
      yearViewNativeElement = yearViewDebugElement.nativeElement;
      testComponent = fixture.componentInstance;
    });

    it('has correct year label', () => {
      let labelEl = yearViewNativeElement.querySelector(
        '.mat-calendar-body-label'
      )!;
      expect(labelEl.innerHTML.trim()).toBe('2017');
    });

    it('has 12 months', () => {
      let cellEls = yearViewNativeElement.querySelectorAll(
        '.mat-calendar-body-cell'
      )!;
      expect(cellEls.length).toBe(12);
    });

    it('shows selected month if in same year', () => {
      let selectedEl = yearViewNativeElement.querySelector(
        '.mat-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('MAR');
    });

    it('does not show selected month if in different year', () => {
      testComponent.selected = new Date(2016, MAR, 10);
      fixture.detectChanges();

      let selectedEl = yearViewNativeElement.querySelector(
        '.mat-calendar-body-selected'
      );
      expect(selectedEl).toBeNull();
    });

    it('fires selected change event on cell clicked', () => {
      let cellEls = yearViewNativeElement.querySelectorAll(
        '.mat-calendar-body-cell'
      );
      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      let selectedEl = yearViewNativeElement.querySelector(
        '.mat-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('DEC');
    });

    it('should emit the selected month on cell clicked', () => {
      let cellEls = yearViewNativeElement.querySelectorAll(
        '.mat-calendar-body-cell'
      );

      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      const normalizedMonth: Date = fixture.componentInstance.selectedMonth;
      expect(normalizedMonth.getMonth()).toEqual(11);
    });

    it('should mark active date', () => {
      let cellEls = yearViewNativeElement.querySelectorAll(
        '.mat-calendar-body-cell'
      );
      expect((cellEls[0] as HTMLElement).innerText.trim()).toBe('JAN');
      expect(cellEls[0].classList).toContain('mat-calendar-body-active');
    });

    it('should allow selection of month with less days than current active date', () => {
      testComponent.date = new Date(2017, JUL, 31);
      fixture.detectChanges();

      expect(testComponent.yearView._monthSelected(JUN));
      fixture.detectChanges();

      expect(testComponent.selected).toEqual(new Date(2017, JUN, 30));
    });
  });

  describe('year view with date filter', () => {
    let fixture: ComponentFixture<YearViewWithDateFilter>;
    let yearViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(YearViewWithDateFilter);
      fixture.detectChanges();

      const yearViewDebugElement = fixture.debugElement.query(
        By.directive(OuiYearView)
      );
      yearViewNativeElement = yearViewDebugElement.nativeElement;
    });

    it('should disable months with no enabled days', () => {
      const cells = yearViewNativeElement.querySelectorAll(
        '.mat-calendar-body-cell'
      );
      expect(cells[0].classList).not.toContain('mat-calendar-body-disabled');
      expect(cells[1].classList).toContain('mat-calendar-body-disabled');
    });
  });
});

@Component({
  template: `
    <mat-year-view
      [(activeDate)]="date"
      [(selected)]="selected"
      (monthSelected)="selectedMonth = $event"
    ></mat-year-view>
  `
})
class StandardYearView {
  date = new Date(2017, JAN, 5);
  selected = new Date(2017, MAR, 10);
  selectedMonth: Date;

  @ViewChild(OuiYearView) yearView: OuiYearView<Date>;
}

@Component({
  template: `
    <mat-year-view
      [activeDate]="activeDate"
      [dateFilter]="dateFilter"
    ></mat-year-view>
  `
})
class YearViewWithDateFilter {
  activeDate = new Date(2017, JAN, 1);
  dateFilter(date: Date) {
    if (date.getMonth() == JAN) {
      return date.getDate() == 10;
    }
    if (date.getMonth() == FEB) {
      return false;
    }
    return true;
  }
}
