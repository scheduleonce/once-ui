import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  NgZone,
  OnChanges,
  SimpleChanges,
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
export class OuiCalendarBody implements OnChanges {
  /** The label for the table. (e.g. "Jan 2017"). */
  @Input() label: string;

  /** The cells to display in the table. */
  @Input() rows: OuiCalendarCell[][];

  /** The value in the table that corresponds to today. */
  @Input() todayValue: number;

  /** The value in the table that is currently selected. */
  @Input() selectedValue: number;

  /** The minimum number of free cells needed to fit the label in the first row. */
  @Input() labelMinRequiredCells: number;

  /** The number of columns in the table. */
  @Input() numCols = 7;

  /** The cell number of the active cell in the table. */
  @Input() activeCell = 0;

  /**
   * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
   * maintained even as the table resizes.
   */
  @Input() cellAspectRatio = 1;

  /** Emits when a new value is selected. */
  @Output()
  readonly selectedValueChange: EventEmitter<number> =
    new EventEmitter<number>();

  /** The number of blank cells to put at the beginning for the first row. */
  _firstRowOffset: number;

  /** Padding for the individual date cells. */
  _cellPadding: string;

  /** Width of an individual cell. */
  _cellWidth: string;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone
  ) {}

  _cellClicked(cell: OuiCalendarCell): void {
    if (cell.enabled) {
      this.selectedValueChange.emit(cell.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const columnChanges = changes.numCols;
    const { rows, numCols } = this;

    if (changes.rows || columnChanges) {
      this._firstRowOffset =
        rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
    }

    if (changes.cellAspectRatio || columnChanges || !this._cellPadding) {
      this._cellPadding = `${(50 * this.cellAspectRatio) / numCols}%`;
    }

    if (columnChanges || !this._cellWidth) {
      this._cellWidth = `${100 / numCols}%`;
    }
  }

  _isActiveCell(rowIndex: number, colIndex: number): boolean {
    let cellNumber = rowIndex * this.numCols + colIndex;

    // Account for the fact that the first row may not have as many cells.
    if (rowIndex) {
      cellNumber -= this._firstRowOffset;
    }

    return cellNumber === this.activeCell;
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
