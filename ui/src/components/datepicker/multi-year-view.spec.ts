import { Direction, Directionality } from '@angular/cdk/bidi';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OuiNativeDateModule } from './native-date.module';
import { By } from '@angular/platform-browser';
import { OuiCalendarBody } from './calendar-body';
import { OuiMultiYearView, yearsPerPage } from './multi-year-view';

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
    <oui-multi-year-view
      [(activeDate)]="date"
      [(selected)]="selected"
      (yearSelected)="selectedYear = $event"
    ></oui-multi-year-view>
  `,
  standalone: false,
})
class StandardMultiYearView {
  date = new Date(2017, JAN, 1);
  selected = new Date(2020, JAN, 1);
  selectedYear: Date;

  @ViewChild(OuiMultiYearView)
  multiYearView: OuiMultiYearView<Date>;
}

@Component({
  template: `
    <oui-multi-year-view
      [activeDate]="activeDate"
      [dateFilter]="dateFilter"
    ></oui-multi-year-view>
  `,
  standalone: false,
})
class MultiYearViewWithDateFilter {
  activeDate = new Date(2017, JAN, 1);
  dateFilter(date: Date) {
    return date.getFullYear() !== 2017;
  }
}

describe('OuiMultiYearView', () => {
  let dir: { value: Direction };
  console.log(dir);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiNativeDateModule],
      declarations: [
        OuiCalendarBody,
        OuiMultiYearView,

        // Test components.
        StandardMultiYearView,
        MultiYearViewWithDateFilter,
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

  describe('standard multi-year view', () => {
    let fixture: ComponentFixture<StandardMultiYearView>;
    let testComponent: StandardMultiYearView;
    let multiYearViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardMultiYearView);
      fixture.detectChanges();

      const multiYearViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMultiYearView)
      );
      multiYearViewNativeElement = multiYearViewDebugElement.nativeElement;
      testComponent = fixture.componentInstance;
    });

    it('has correct number of years', () => {
      const cellEls = multiYearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      )!;
      expect(cellEls.length).toBe(yearsPerPage);
    });

    it('shows selected year if in same range', () => {
      const selectedEl = multiYearViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('2020');
    });

    it('does not show selected year if in different range', () => {
      testComponent.selected = new Date(2040, JAN, 10);
      fixture.detectChanges();

      const selectedEl = multiYearViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      );
      expect(selectedEl).toBeNull();
    });

    it('fires selected change event on cell clicked', () => {
      const cellEls = multiYearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      (cellEls[cellEls.length - 1] as HTMLElement).click();
      fixture.detectChanges();

      const selectedEl = multiYearViewNativeElement.querySelector(
        '.oui-calendar-body-selected'
      )!;
      expect(selectedEl.innerHTML.trim()).toBe('2039');
    });

    it('should emit the selected year on cell clicked', () => {
      const cellEls = multiYearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );

      (cellEls[1] as HTMLElement).click();
      fixture.detectChanges();

      const normalizedYear: Date = fixture.componentInstance.selectedYear;
      expect(normalizedYear.getFullYear()).toEqual(2017);
    });

    it('should mark active date', () => {
      const cellEls = multiYearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      expect((cellEls[1] as HTMLElement).innerText.trim()).toBe('2017');
      expect(cellEls[1].classList).toContain('oui-calendar-body-active');
    });
  });

  describe('multi year view with date filter', () => {
    let fixture: ComponentFixture<MultiYearViewWithDateFilter>;
    let multiYearViewNativeElement: Element;

    beforeEach(() => {
      fixture = TestBed.createComponent(MultiYearViewWithDateFilter);
      fixture.detectChanges();

      const multiYearViewDebugElement = fixture.debugElement.query(
        By.directive(OuiMultiYearView)
      );
      multiYearViewNativeElement = multiYearViewDebugElement.nativeElement;
    });

    it('should disablex years with no enabled days', () => {
      const cells = multiYearViewNativeElement.querySelectorAll(
        '.oui-calendar-body-cell'
      );
      expect(cells[0].classList).not.toContain('oui-calendar-body-disabled');
      expect(cells[1].classList).toContain('oui-calendar-body-disabled');
    });
  });
});
