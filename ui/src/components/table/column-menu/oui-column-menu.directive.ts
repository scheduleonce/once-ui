import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ProviderToken,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OuiSort, OuiSortable } from '../../sort/sort';
import {
  ColumnMenuAction,
  ColumnMenuActionType,
  OuiColumnMenuPanelComponent,
} from './oui-column-menu-panel.component';

export type {
  ColumnMenuAction,
  ColumnMenuActionType,
} from './oui-column-menu-panel.component';

@Directive({
  // Applied directly on the rendered oui-header-cell th element
  selector:
    'th[oui-header-cell][ouiColumnMenu], [oui-header-cell][ouiColumnMenu]',
  standalone: false,
})
export class OuiColumnMenuDirective
  implements AfterViewInit, OnChanges, OnDestroy
{
  /** Pass the current displayedColumns so the directive knows first/last position. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ouiColumnMenu') displayedColumns: string[] = [];

  /**
   * Explicitly control whether sort items appear in the menu.
   * When null (default), auto-detects by checking for the [oui-sort-header] attribute.
   * Set to true to show sort items even when oui-sort-header is not on the host element.
   */
  @Input() ouiColumnMenuHasSort: boolean | null = null;

  /** Emitted when the user selects an action from the column menu. */
  @Output() columnMenuAction = new EventEmitter<ColumnMenuAction>();

  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _renderer = inject(Renderer2);
  private _viewContainerRef = inject(ViewContainerRef);

  /** Optional: OuiSort on the ancestor table — used to show/hide sort menu items. */
  private _sort = inject(OuiSort, { optional: true });

  /** OuiColumnDef provides the column name via the token used by OuiSortHeader. */
  private _columnDef = inject<{ name: string }>(
    'OUI_SORT_HEADER_COLUMN_DEF' as unknown as ProviderToken<{ name: string }>,
    {
      optional: true,
    }
  );

  private _panelRef: ComponentRef<OuiColumnMenuPanelComponent> | null = null;
  private _panelActionSub: Subscription = Subscription.EMPTY;
  private _sortClickSub: Subscription = Subscription.EMPTY;
  private _sortChangeSub: Subscription = Subscription.EMPTY;

  /**
   * Static map to track how many columns have the menu enabled per table.
   * This allows us to remove the 'oui-table-column-menu-enabled' class
   * only when the last menu is destroyed.
   */
  private static readonly _enabledCountMap = new Map<HTMLElement, number>();

  ngAfterViewInit(): void {
    // Add marker class to the table host so enhanced styles (separators, etc.) apply.
    const tableEl = this._elementRef.nativeElement.closest(
      'oui-table, table[oui-table]'
    ) as HTMLElement;
    if (tableEl) {
      const currentCount =
        OuiColumnMenuDirective._enabledCountMap.get(tableEl) ?? 0;
      OuiColumnMenuDirective._enabledCountMap.set(tableEl, currentCount + 1);
      this._renderer.addClass(tableEl, 'oui-table-column-menu-enabled');
    }

    // Make the host th position:relative so the trigger button can be absolutely positioned.
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'position',
      'relative'
    );

    // Dynamically create the panel component (contains sort indicator + trigger button + oui-menu).
    this._panelRef = this._viewContainerRef.createComponent(
      OuiColumnMenuPanelComponent
    );
    this._panelRef.setInput('columnId', this._columnId);
    this._panelRef.setInput('displayedColumns', [...this.displayedColumns]);
    this._panelRef.setInput('hasSort', this._hasSortHeader());
    this._panelRef.setInput('sortDirection', this._currentSortDirection());

    // Move the panel component host element into the header cell and keep its
    // rendered children attached so Angular continues to manage the DOM tree.
    const hostEl = this._panelRef.location.nativeElement as HTMLElement;
    // Make the host transparent to layout so its rendered children behave as before.
    this._renderer.setStyle(hostEl, 'display', 'contents');
    this._renderer.appendChild(this._elementRef.nativeElement, hostEl);

    // Subscribe to menu actions (move left/right, hide).
    this._panelActionSub = this._panelRef.instance.actionSelected.subscribe(
      (action: ColumnMenuActionType) => {
        this.columnMenuAction.emit({ columnId: this._columnId, action });
      }
    );

    // Subscribe to sort indicator clicks — delegate to OuiSort to cycle direction.
    this._sortClickSub = this._panelRef.instance.sortClicked.subscribe(() => {
      if (this._sort) {
        const sortable = this._sort.sortables.get(this._columnId) ?? {
          id: this._columnId,
          start: this._sort.start,
          disableClear: this._sort.disableClear,
        };
        this._sort.sort(sortable as OuiSortable);
      }
    });

    // Subscribe to OuiSort.sortChange to keep the panel's sort indicator in sync.
    // This also ensures only the active column shows the sorted state.
    if (this._sort) {
      this._sortChangeSub = this._sort.sortChange.subscribe(() => {
        if (this._panelRef) {
          this._panelRef.setInput(
            'sortDirection',
            this._currentSortDirection()
          );
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayedColumns'] && this._panelRef) {
      this._panelRef.setInput('displayedColumns', [...this.displayedColumns]);
    }
  }

  private get _columnId(): string {
    return this._columnDef?.name ?? '';
  }

  private _hasSortHeader(): boolean {
    if (this.ouiColumnMenuHasSort !== null) {
      return !!this._sort && this.ouiColumnMenuHasSort;
    }
    return (
      !!this._sort &&
      this._elementRef.nativeElement.hasAttribute('oui-sort-header')
    );
  }

  /** Returns the current sort direction for this column, or '' if not sorted. */
  private _currentSortDirection(): '' | 'asc' | 'desc' {
    if (!this._sort || this._sort.active !== this._columnId) {
      return '';
    }
    return (this._sort.direction as 'asc' | 'desc') || '';
  }

  ngOnDestroy(): void {
    const tableEl = this._elementRef.nativeElement.closest(
      'oui-table, table[oui-table]'
    ) as HTMLElement;
    if (tableEl) {
      const count =
        (OuiColumnMenuDirective._enabledCountMap.get(tableEl) ?? 1) - 1;
      if (count <= 0) {
        OuiColumnMenuDirective._enabledCountMap.delete(tableEl);
        this._renderer.removeClass(tableEl, 'oui-table-column-menu-enabled');
      } else {
        OuiColumnMenuDirective._enabledCountMap.set(tableEl, count);
      }
    }

    this._panelActionSub.unsubscribe();
    this._sortClickSub.unsubscribe();
    this._sortChangeSub.unsubscribe();
    this._panelRef?.destroy();
    this._panelRef = null;
  }
}
