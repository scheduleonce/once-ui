import {
  coerceNumberProperty,
  coerceBooleanProperty,
} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OuiPaginatorIntl } from './paginator-intl';
import {
  HasInitialized,
  HasInitializedCtor,
  mixinInitialized,
  mixinDisabled,
  CanDisableCtor,
  CanDisable,
} from '../core';

/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 30;

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
  /** The current page index. */
  pageIndex: number;

  /**
   * Index of the page that was selected previously.
   *
   * @breaking-change 8.0.0 To be made into a required property.
   */
  previousPageIndex?: number;

  /** The current page size */
  pageSize: number;

  /** The current total number of items being paged */
  length: number;
}

// Boilerplate for applying mixins to OuiPaginator.
/** @docs-private */
export class OuiPaginatorBase {}
export const _OuiPaginatorBase: CanDisableCtor &
  HasInitializedCtor &
  typeof OuiPaginatorBase = mixinDisabled(mixinInitialized(OuiPaginatorBase));

/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
@Component({
  selector: 'oui-paginator',
  exportAs: 'ouiPaginator',
  templateUrl: 'paginator.html',
  styleUrls: ['paginator.scss'],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled'],
  host: {
    class: 'oui-paginator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class OuiPaginator
  extends _OuiPaginatorBase
  implements OnInit, OnDestroy, CanDisable, HasInitialized
{
  _intl = inject(OuiPaginatorIntl);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _initialized: boolean;
  private _intlChanges: Subscription;

  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  @Input()
  get pageIndex(): number {
    return this._pageIndex;
  }
  set pageIndex(value: number) {
    this._pageIndex = Math.max(coerceNumberProperty(value), 0);
    this._changeDetectorRef.markForCheck();
  }
  _pageIndex = 0;

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input()
  get length(): number {
    return this._length;
  }
  set length(value: number) {
    this._length = coerceNumberProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input()
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._pageSize = Math.max(coerceNumberProperty(value), 0);
  }
  private _pageSize: number = DEFAULT_PAGE_SIZE;

  /** Whether to hide the page size selection UI from the user. */
  @Input()
  get hidePageSize(): boolean {
    return this._hidePageSize;
  }
  set hidePageSize(value: boolean) {
    this._hidePageSize = coerceBooleanProperty(value);
  }
  private _hidePageSize = false;

  /** Event emitted when the paginator changes the page size or page index. */
  @Output()
  readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  /** Displayed set of page size options. Will be sorted and include current page size. */
  _displayedPageSizeOptions: number;

  constructor() {
    super();
    const _intl = this._intl;

    this._intlChanges = _intl.changes.subscribe(() =>
      this._changeDetectorRef.markForCheck()
    );
  }

  ngOnInit() {
    this._initialized = true;
    this._markInitialized();
  }

  ngOnDestroy() {
    this._intlChanges.unsubscribe();
  }

  /** Advances to the next page if it exists. */
  nextPage(): void {
    if (!this.hasNextPage() || !this._initialized) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex++;
    this._emitPageEvent(previousPageIndex);
  }

  /** Move back to the previous page if it exists. */
  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex--;
    this._emitPageEvent(previousPageIndex);
  }

  /** Move to the first page if not already there. */
  firstPage(): void {
    // hasPreviousPage being false implies at the start
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;
    this._emitPageEvent(previousPageIndex);
  }

  /** Move to the last page if not already there. */
  lastPage(): void {
    // hasNextPage being false implies at the end
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;
    this._emitPageEvent(previousPageIndex);
  }

  /** Whether there is a previous page. */
  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize !== 0;
  }

  /** Whether there is a next page. */
  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize !== 0;
  }

  /** Calculate the number of pages */
  getNumberOfPages(): number {
    if (!this.pageSize || this.length < 0) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

  /** Get current page */
  getCurrentPage(): number {
    if (!this.pageSize || this.length <= 0) {
      return 0;
    }

    return this.pageIndex + 1;
  }

  /**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19) then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   */
  _changePageSize(pageSize: number) {
    // Current page needs to be updated to reflect the new page size. Navigate to the page
    // containing the previous page's first item.
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;

    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }

  /** Checks whether the buttons for going forwards should be disabled. */
  _nextButtonsDisabled() {
    return this.disabled || !this.hasNextPage();
  }

  /** Checks whether the buttons for going backwards should be disabled. */
  _previousButtonsDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }

  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  private _emitPageEvent(previousPageIndex: number) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
