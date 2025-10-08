import { Direction, Directionality } from '@angular/cdk/bidi';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OuiNativeDateModule } from './native-date.module';
import { By } from '@angular/platform-browser';
import { OuiCalendarBody } from './calendar-body';
import { OuiMonthView } from './month-view';

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
    <oui-month-view
      [(activeDate)]="date"
      [(selected)]="selected"
    ></oui-month-view>
  `,
  standalone: false,
})
class StandardMonthView {
  date = new Date(2017, JAN, 5);
  selected = new Date(2017, JAN, 10);
}

@Component({
  template: `
    <oui-month-view
      [activeDate]="activeDate"
      [dateFilter]="dateFilter"
    ></oui-month-view>
  `,
  standalone: false,
})
class MonthViewWithDateFilter {
  activeDate = new Date(2017, JAN, 1);
  dateFilter(date: Date) {
    return date.getDate() % 2 === 0;
  }
}

@Component({
  template: `
    <oui-month-view
      [activeDate]="activeDate"
      [dateClass]="dateClass"
    ></oui-month-view>
  `,
  standalone: false,
})
class MonthViewWithDateClass {
  activeDate = new Date(2017, JAN, 1);
  dateClass(date: Date) {
    return date.getDate() % 2 === 0 ? 'even' : undefined;
  }
}

describe('OuiMonthView', () => {
  // @ts-ignore: Used in provider factory below
  let dir: { value: Direction };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiNativeDateModule],
      declarations: [
        OuiCalendarBody,
        OuiMonthView,

        // Test components.
        StandardMonthView,
        MonthViewWithDateFilter,
        MonthViewWithDateClass,
      ],
      providers: [
        {
          provide: Directionality,
          useFactory: () => (dir = { value: 'ltr' }),
        },
      ],
    });

    TestBed.compileComponents();
  }));

  describe('standard month view', () => {
    let fixture: ComponentFixture<StandardMonthView>;
    let testComponent: StandardMonthView;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardMonthView);
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMonthView)
      );
      monthViewNativeElement = monthViewDebugElement.nativeElement;
      testComponent = fixture.componentInstance;
    });

    it('does not display month label in calendar body', () => {
      const labelEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-label'
      );
      expect(labelEl).toBeNull();
    });

    it('has 31 days', () => {
      const cellEls = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      )!;
      expect(cellEls.length).toBe(31);
    });

    it('shows selected date if in same month', () => {
      const selectedEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('10');
    });

    it('does not show selected date if in different month', () => {
      testComponent.selected = new Date(2017, MAR, 10);
      fixture.detectChanges();

      const selectedEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      );
      expect(selectedEl).toBeNull();
    });

    it('fires selected change event on cell clicked', () => {
      const cellEls = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      const selectedEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('31');
    });

    it('should mark active date', () => {
      const cellEls = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      expect((cellEls[4] as HTMLElement).innerText.trim()).toBe('5');
      expect(cellEls[4].classList).toContain('oui-calendar-body-active');
    });
  });

  describe('month view with date filter', () => {
    let fixture: ComponentFixture<MonthViewWithDateFilter>;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthViewWithDateFilter);
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMonthView)
      );
      monthViewNativeElement = monthViewDebugElement.nativeElement;
    });

    it('should disable filtered dates', () => {
      const cells = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      expect(cells[0].classList).toContain('oui-calendar-body-disabled');
      expect(cells[1].classList).not.toContain('oui-calendar-body-disabled');
    });
  });

  describe('month view with custom date classes', () => {
    let fixture: ComponentFixture<MonthViewWithDateClass>;
    let monthViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthViewWithDateClass);
      fixture.detectChanges();

      const monthViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMonthView)
      );
      monthViewNativeElement = monthViewDebugElement.nativeElement;
    });

    it('should be able to add a custom class to some dates', () => {
      const cells = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      expect(cells[0].classList).not.toContain('even');
      expect(cells[1].classList).toContain('even');
    });
  });
});
