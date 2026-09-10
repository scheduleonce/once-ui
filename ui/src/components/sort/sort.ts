import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
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
} from './sort-errors';

/** Interface for a directive that holds sorting state consumed by `OuiSortHeader`. */
export interface OuiSortable {
  /** The id of the column being sorted. */
  id: any;

  /** Starting sort direction. */
  start: any;

  /** Whether to disable clearing the sorting state. */
  disableClear: any;
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
  standalone: false,
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
  readonly active = model<string>();

  /**
   * The direction to set when an OuiSortable is initially sorted.
   * May be overriden by the OuiSortable's sort start.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly start = input<'asc' | 'desc'>('asc', { alias: 'ouiSortStart' });

  /** The sort direction of the currently active OuiSortable. */
  readonly direction = model<SortDirection>('', { alias: 'ouiSortDirection' });

  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overriden by the OuiSortable's disable clear input.
   */
  readonly disableClear = input(false, {
    alias: 'ouiSortDisableClear',
    transform: coerceBooleanProperty,
  });

  /** Event emitted when the user changes either the active sort or sort direction. */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  readonly sortChange = output<Sort>({ alias: 'ouiSortChange' });

  /**
   * Register function to be used by the contained OuiSortables. Adds the OuiSortable to the
   * collection of OuiSortables.
   */
  register(sortable: OuiSortable): void {
    const id = typeof sortable.id === 'function' ? sortable.id() : sortable.id;
    if (!id) {
      throw getSortHeaderMissingIdError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (this.sortables.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw getSortDuplicateSortableIdError(id);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.sortables.set(id, sortable);
  }

  /**
   * Unregister function to be used by the contained OuiSortables. Removes the OuiSortable from the
   * collection of contained OuiSortables.
   */
  deregister(sortable: OuiSortable): void {
    const id = typeof sortable.id === 'function' ? sortable.id() : sortable.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.sortables.delete(id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: OuiSortable): void {
    const id = typeof sortable.id === 'function' ? sortable.id() : sortable.id;
    if (this.active() !== id) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.active.set(id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.direction.set(sortable.start ? sortable.start : this.start());
    } else {
      this.direction.set(this.getNextSortDirection(sortable));
    }

    this.sortChange.emit({
      active: this.active(),
      direction: this.direction(),
    });
  }

  /** Returns the next sort direction of the active sortable, checking for potential overrides. */
  getNextSortDirection(sortable: OuiSortable): SortDirection {
    if (!sortable) {
      return '';
    }

    const sortDirectionCycle = getSortDirectionCycle(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      sortable.start || this.start()
    );

    // Get and return the next direction in the cycle
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction()) + 1;
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
