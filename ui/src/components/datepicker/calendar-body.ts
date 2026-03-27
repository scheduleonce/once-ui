import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  NgZone,
  computed,
  input,
  output,
  inject,
} from '@angular/core';
import { take } from 'rxjs/operators';

/**
 * Extra CSS classes that can be associated with a calendar cell.
 */
export type OuiCalendarCellCssClasses =
  | string
  | string[]
  | Set<string>
  | { [key: string]: any };

/**
 * An internal class that represents the data corresponding to a single calendar cell.
 */
export class OuiCalendarCell {
  constructor(
    public value: number,
    public displayValue: string,
    public ariaLabel: string,
    public enabled: boolean,
    public cssClasses?: OuiCalendarCellCssClasses
  ) {}
}

/**
 * An internal component used to display calendar data in a table.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[oui-calendar-body]',
  templateUrl: 'calendar-body.html',
  styleUrls: ['calendar-body.scss'],
  host: {
    class: 'oui-calendar-body',
    role: 'grid',
    'aria-readonly': 'true',
  },
  exportAs: 'ouiCalendarBody',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class OuiCalendarBody {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _ngZone = inject(NgZone);

  /** The label for the table. (e.g. "Jan 2017"). */
  readonly label = input<string>();

  /** The cells to display in the table. */
  readonly rows = input<OuiCalendarCell[][]>();

  /** The value in the table that corresponds to today. */
  readonly todayValue = input<number>();

  /** The value in the table that is currently selected. */
  readonly selectedValue = input<number>();

  /** The minimum number of free cells needed to fit the label in the first row. */
  readonly labelMinRequiredCells = input<number>();

  /** The number of columns in the table. */
  readonly numCols = input(7);

  /** The cell number of the active cell in the table. */
  readonly activeCell = input(0);

  /**
   * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
   * maintained even as the table resizes.
   */
  readonly cellAspectRatio = input(1);

  /** Emits when a new value is selected. */
  readonly selectedValueChange = output<number>();

  /** The number of blank cells to put at the beginning for the first row. */
  readonly _firstRowOffset = computed(() => {
    const rows = this.rows();
    const numCols = this.numCols();
    return rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
  });

  /** Padding for the individual date cells. */
  readonly _cellPadding = computed(
    () => `${(50 * this.cellAspectRatio()) / this.numCols()}%`
  );

  /** Width of an individual cell. */
  readonly _cellWidth = computed(() => `${100 / this.numCols()}%`);

  constructor() {}

  _cellClicked(cell: OuiCalendarCell): void {
    if (cell.enabled) {
      this.selectedValueChange.emit(cell.value);
    }
  }

  _isActiveCell(rowIndex: number, colIndex: number): boolean {
    let cellNumber = rowIndex * this.numCols() + colIndex;

    // Account for the fact that the first row may not have as many cells.
    if (rowIndex) {
      cellNumber -= this._firstRowOffset();
    }

    return cellNumber === this.activeCell();
  }

  /** Focuses the active cell after the microtask queue is empty. */
  _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable
        .asObservable()
        .pipe(take(1))
        .subscribe(() => {
          const activeCell: HTMLElement | null =
            this._elementRef.nativeElement.querySelector(
              '.oui-calendar-body-active'
            );

          if (activeCell) {
            activeCell.focus();
          }
        });
    });
  }
}
