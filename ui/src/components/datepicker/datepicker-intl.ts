import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Datepicker data that requires internationalization. */
@Injectable({ providedIn: 'root' })
export class OuiDatepickerIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** A label for the calendar popup (used by screen readers). */
  calendarLabel = 'Calendar';

  /** A label for the button used to open the calendar popup (used by screen readers). */
  openCalendarLabel = 'Open calendar';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Previous month';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Next month';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'Previous year';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'Next year';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = 'Previous 20 years';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Next 20 years';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Choose date';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Choose month and year';
}
