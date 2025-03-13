import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  EventEmitter,
  Input,
  isDevMode,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  CanDisable,
  CanDisableCtor,
  HasInitialized,
  HasInitializedCtor,
  mixinDisabled,
  mixinInitialized,
} from '../core';
import { Subject } from 'rxjs';
import { SortDirection } from './sort-direction';
import {
  getSortDuplicateSortableIdError,
  getSortHeaderMissingIdError,
  getSortInvalidDirectionError,
} from './sort-errors';

/** Interface for a directive that holds sorting state consumed by `OuiSortHeader`. */
export interface OuiSortable {
  /** The id of the column being sorted. */
  id: string;

  /** Starting sort direction. */
  start: 'asc' | 'desc';

  /** Whether to disable clearing the sorting state. */
  disableClear: boolean;
}

/** The current sort state. */
export interface Sort {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: SortDirection;
}

// Boilerplate for applying mixins to OuiSort.
/** @docs-private */
export class OuiSortBase {}
export const _OuiSortMixinBase: HasInitializedCtor &
  CanDisableCtor &
  typeof OuiSortBase = mixinInitialized(mixinDisabled(OuiSortBase));

/** Container for OuiSortables to manage the sort state and provide default sort parameters. */
@Directive({
    selector: '[ouiSort]',
    exportAs: 'ouiSort',
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    inputs: ['disabled: ouiSortDisabled'],
    standalone: false
})
export class OuiSort
  extends _OuiSortMixinBase
  implements CanDisable, HasInitialized, OnChanges, OnDestroy, OnInit
{
  /** Collection of all registered sortables that this directive manages. */
  sortables = new Map<string, OuiSortable>();

  /** Used to notify any child components listening to state changes. */
  readonly _stateChanges = new Subject<void>();

  /** The id of the most recently sorted OuiSortable. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ouiSortActive') active: string;

  /**
   * The direction to set when an OuiSortable is initially sorted.
   * May be overriden by the OuiSortable's sort start.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ouiSortStart') start: 'asc' | 'desc' = 'asc';

  /** The sort direction of the currently active OuiSortable. */
  @Input('ouiSortDirection')
  get direction(): SortDirection {
    return this._direction;
  }
  set direction(direction: SortDirection) {
    if (
      isDevMode() &&
      direction &&
      direction !== 'asc' &&
      direction !== 'desc'
    ) {
      throw getSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  private _direction: SortDirection = '';

  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overriden by the OuiSortable's disable clear input.
   */
  @Input('ouiSortDisableClear')
  get disableClear(): boolean {
    return this._disableClear;
  }
  set disableClear(v: boolean) {
    this._disableClear = coerceBooleanProperty(v);
  }
  private _disableClear: boolean;

  /** Event emitted when the user changes either the active sort or sort direction. */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('ouiSortChange')
  readonly sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();

  /**
   * Register function to be used by the contained OuiSortables. Adds the OuiSortable to the
   * collection of OuiSortables.
   */
  register(sortable: OuiSortable): void {
    if (!sortable.id) {
      throw getSortHeaderMissingIdError();
    }

    if (this.sortables.has(sortable.id)) {
      throw getSortDuplicateSortableIdError(sortable.id);
    }
    this.sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained OuiSortables. Removes the OuiSortable from the
   * collection of contained OuiSortables.
   */
  deregister(sortable: OuiSortable): void {
    this.sortables.delete(sortable.id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: OuiSortable): void {
    if (this.active !== sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }

    this.sortChange.emit({ active: this.active, direction: this.direction });
  }

  /** Returns the next sort direction of the active sortable, checking for potential overrides. */
  getNextSortDirection(sortable: OuiSortable): SortDirection {
    if (!sortable) {
      return '';
    }

    const sortDirectionCycle = getSortDirectionCycle(
      sortable.start || this.start
    );

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }

  ngOnInit() {
    this._markInitialized();
  }

  ngOnChanges() {
    this._stateChanges.next();
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(start: 'asc' | 'desc'): SortDirection[] {
  const sortOrder: SortDirection[] = ['asc', 'desc'];
  if (start === 'desc') {
    sortOrder.reverse();
  }

  return sortOrder;
}
