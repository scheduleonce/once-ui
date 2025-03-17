import { Direction, Directionality } from '@angular/cdk/bidi';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OuiNativeDateModule } from './native-date.module';
import { By } from '@angular/platform-browser';
import { OuiCalendarBody } from './calendar-body';
import { OuiYearView } from './year-view';
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
    <oui-year-view
      [(activeDate)]="date"
      [(selected)]="selected"
      (monthSelected)="selectedMonth = $event"
    ></oui-year-view>
  `,
    standalone: false
})
class StandardYearView {
  date = new Date(2017, JAN, 5);
  selected = new Date(2017, MAR, 10);
  selectedMonth: Date;

  @ViewChild(OuiYearView) yearView: OuiYearView<Date>;
}

@Component({
    template: `
    <oui-year-view
      [activeDate]="activeDate"
      [dateFilter]="dateFilter"
    ></oui-year-view>
  `,
    standalone: false
})
class YearViewWithDateFilter {
  activeDate = new Date(2017, JAN, 1);
  dateFilter(date: Date) {
    if (date.getMonth() === JAN) {
      return date.getDate() === 10;
    }
    if (date.getMonth() === FEB) {
      return false;
    }
    return true;
  }
}

describe('OuiYearView', () => {
  let dir: { value: Direction };
  console.log(dir);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiNativeDateModule],
      declarations: [
        OuiCalendarBody,
        OuiYearView,

        // Test components.
        StandardYearView,
        YearViewWithDateFilter,
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

  describe('standard year view', () => {
    let fixture: ComponentFixture<StandardYearView>;
    let testComponent: StandardYearView;
    let yearViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardYearView);
      fixture.detectChanges();

      const yearViewDebugElement = fixture.debugElement.query(
        By.directive(OuiYearView)
      );
      yearViewNativeElement = yearViewDebugElement.nativeElement;
      testComponent = fixture.componentInstance;
    });

    it('has correct year label', () => {
      const labelEl = yearViewNativeElement.querySelector(
        '.oui-calendar-body-label'
      )!;
      expect(labelEl.innerHTML.trim()).toBe('2017');
    });

    it('has 12 months', () => {
      const cellEls = yearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      )!;
      expect(cellEls.length).toBe(12);
    });

    it('shows selected month if in same year', () => {
      const selectedEl = yearViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('MAR');
    });

    it('does not show selected month if in different year', () => {
      testComponent.selected = new Date(2016, MAR, 10);
      fixture.detectChanges();

      const selectedEl = yearViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      );
      expect(selectedEl).toBeNull();
    });

    it('fires selected change event on cell clicked', () => {
      const cellEls = yearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      const selectedEl = yearViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('DEC');
    });

    it('should emit the selected month on cell clicked', () => {
      const cellEls = yearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );

      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      const normalizedMonth: Date = fixture.componentInstance.selectedMonth;
      expect(normalizedMonth.getMonth()).toEqual(11);
    });

    it('should mark active date', () => {
      const cellEls = yearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      expect((cellEls[0] as HTMLElement).innerText.trim()).toBe('JAN');
      expect(cellEls[0].classList).toContain('oui-calendar-body-active');
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
        '.oui-calendar-body-cell'
      );
      expect(cells[0].classList).not.toContain('oui-calendar-body-disabled');
      expect(cells[1].classList).toContain('oui-calendar-body-disabled');
    });
  });
});
