import { Direction, Directionality } from '@angular/cdk/bidi';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OuiNativeDateModule } from './native-date.module';
import { By } from '@angular/platform-browser';
import { OuiCalendarBody } from './calendar-body';
import { OuiMonthView } from './month-view';

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

describe('OuiMonthView', () => {
  let dir: { value: Direction };
  console.log(dir);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OuiNativeDateModule],
      declarations: [
        OuiCalendarBody,
        OuiMonthView,

        // Test components.
        StandardMonthView,
        MonthViewWithDateFilter,
        MonthViewWithDateClass
      ],
      providers: [
        { provide: Directionality, useFactory: () => (dir = { value: 'ltr' }) }
      ]
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

      let monthViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMonthView)
      );
      monthViewNativeElement = monthViewDebugElement.nativeElement;
      testComponent = fixture.componentInstance;
    });

    it('has correct month label', () => {
      let labelEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-label'
      )!;
      expect(labelEl.innerHTML.trim()).toBe('JAN');
    });

    it('has 31 days', () => {
      let cellEls = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      )!;
      expect(cellEls.length).toBe(31);
    });

    it('shows selected date if in same month', () => {
      let selectedEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('10');
    });

    it('does not show selected date if in different month', () => {
      testComponent.selected = new Date(2017, MAR, 10);
      fixture.detectChanges();

      let selectedEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      );
      expect(selectedEl).toBeNull();
    });

    it('fires selected change event on cell clicked', () => {
      let cellEls = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      let selectedEl = monthViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('31');
    });

    it('should mark active date', () => {
      let cellEls = monthViewNativeElement.querySelectorAll(
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

      let monthViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMonthView)
      );
      monthViewNativeElement = monthViewDebugElement.nativeElement;
    });

    it('should disable filtered dates', () => {
      let cells = monthViewNativeElement.querySelectorAll(
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

      let monthViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMonthView)
      );
      monthViewNativeElement = monthViewDebugElement.nativeElement;
    });

    it('should be able to add a custom class to some dates', () => {
      let cells = monthViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      expect(cells[0].classList).not.toContain('even');
      expect(cells[1].classList).toContain('even');
    });
  });
});

@Component({
  template: `
    <oui-month-view
      [(activeDate)]="date"
      [(selected)]="selected"
    ></oui-month-view>
  `
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
  `
})
class MonthViewWithDateFilter {
  activeDate = new Date(2017, JAN, 1);
  dateFilter(date: Date) {
    return date.getDate() % 2 == 0;
  }
}

@Component({
  template: `
    <oui-month-view
      [activeDate]="activeDate"
      [dateClass]="dateClass"
    ></oui-month-view>
  `
})
class MonthViewWithDateClass {
  activeDate = new Date(2017, JAN, 1);
  dateClass(date: Date) {
    return date.getDate() % 2 == 0 ? 'even' : undefined;
  }
}
