import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ColumnResizeEvent {
  /** CDK column name (value of ouiColumnDef). */
  columnId: string;
  /** New column width in pixels. */
  width: number;
}

@Directive({
  selector:
    'oui-table[ouiResizableColumns], table[oui-table][ouiResizableColumns]',
  standalone: false,
})
export class OuiResizableColumnsDirective implements AfterViewInit, OnDestroy {
  /**
   * Minimum column width in pixels. Must be a positive number; if 0 or negative
   * the directive falls back to 200px.
   */
  @Input() minColumnWidth = 0;

  /**
   * Optional initial column widths keyed by CDK column ID.
   * Supports two-way binding: `[(columnWidths)]="widthMap"` keeps the parent
   * in sync as the user resizes columns or columns are added/removed.
   */
  @Input() columnWidths: Record<string, number> = {};
  @Output() columnWidthsChange = new EventEmitter<Record<string, number>>();

  /** Emitted when the user finishes resizing a single column. */
  @Output() columnResized = new EventEmitter<ColumnResizeEvent>();

  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _renderer = inject(Renderer2);
  private _ngZone = inject(NgZone);
  private _platformId = inject(PLATFORM_ID);

  // Drag state
  private _isDragging = false;
  /** True if the pointer actually moved during the current drag (delta > 2 px). */
  private _hasMoved = false;
  private _startX = 0;
  private _startWidth = 0;
  /** Minimum width the column is allowed to reach (content + padding, measured at drag-start). */
  private _minCellWidth = 0;
  private _columnId = '';
  private _columnCells: HTMLElement[] = [];
  /** The header cell being resized — needed to suppress the post-drag click. */
  private _activeHeaderCell: HTMLElement | null = null;

  private _mouseMoveUnlisten: (() => void) | null = null;
  private _mouseUpUnlisten: (() => void) | null = null;
  private _mouseCancelUnlisten: (() => void) | null = null;
  private _handles: HTMLElement[] = [];
  private _activeHandle: HTMLElement | null = null;
  /** Persists user-resized widths by column ID so they survive column reorder. */
  private _columnWidths = new Map<string, number>();
  /** Tracks columns that the user has explicitly resized (vs auto-snapshotted at render). */
  private _userResizedColumns = new Set<string>();
  private _mutationObserver: MutationObserver | null = null;
  private _reinitScheduled = false;
  /** Listeners returned by Renderer2.listen for each handle's pointerdown. */
  private _handleUnlisteners: (() => void)[] = [];
  /** Whether initial column widths have already been snapshotted. */
  private _initialised = false;
  /** rAF handle for the pending double-rAF retry inside _reapplyStoredWidths. */
  private _pendingApplyRaf: number | null = null;
  /**
   * The rightmost column that is NOT being dragged. During a drag it acts as
   * an elastic column: it shrinks when the dragged column expands (absorbing
   * overflow) and grows when the dragged column shrinks (filling the freed
   * space), keeping the table at exactly containerWidth in both directions.
   * Only active when the table initially fits the container (_elasticEnabled).
   */
  private _elasticColumnId = '';
  private _elasticColumnStartWidth = 0;
  private _elasticColumnWasUserResized = false;
  /** True when table fits container at drag-start (no scrollbar). */
  private _elasticEnabled = false;
  /**
   * The measured content+padding minimum for the elastic column, computed at
   * drag-start. Used as the floor instead of effectiveMinWidth when the elastic
   * column started below effectiveMinWidth (e.g. equal-division columns).
   */
  private _elasticColumnMinWidth = 0;
  /**
   * Columns that the user has explicitly drag-resized during this session.
   * Only these are included in `columnWidthsChange` emissions so that the
   * parent's persisted map never gets overwritten by auto-calculated widths
   * (last-column fill, equal-division, column add/remove redistribution).
   */
  private _dragResizedColumns = new Set<string>();
  /** Unique ID stamped on the table host to scope the injected stylesheet. */
  private _tableId = `oui-table-${Math.random().toString(36).slice(2, 9)}`;
  /** <style> element that holds per-column CSS rules, eliminating render flicker. */
  private _styleEl: HTMLStyleElement | null = null;

  // ─── ResizeObserver to detect table overflow and toggle shadow class ─────────
  private _overflowObserver: ResizeObserver | null = null;

  /** Effective minimum width: the input value when positive, otherwise 200px. */
  private get _effectiveMinWidth(): number {
    return this.minColumnWidth > 0 ? this.minColumnWidth : 200;
  }
  private _lastPointerId = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    // Defer to allow CDK table to render all header cells.
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._lockTableLayout();
        this._initHandles();
        this._watchHeaderRow();
        this._watchOverflow();
      }, 0);
    });
  }

  /**
   * For native `<table>` elements, switch to `table-layout: fixed` and
   * snapshot every column's rendered width. Without this the browser
   * auto-distributes widths and resize drags are fought by the layout engine.
   */
  private _lockTableLayout(): void {
    if (this._initialised) {
      return;
    }
    this._initialised = true;
    const host = this._elementRef.nativeElement;
    const isNativeTable = host.tagName === 'TABLE';

    // Stamp a unique ID so the injected stylesheet can be scoped to this table.
    this._renderer.setAttribute(host, 'data-oui-resize-id', this._tableId);
    this._initStyleSheet();

    // Measure all header cells BEFORE switching to table-layout:fixed.
    // After the switch the browser may compute 0px for columns with no
    // intrinsic content width (e.g. a single-column table), so we always
    // take the measurement from the auto-layout pass.
    const headerCells = Array.from(
      host.querySelectorAll<HTMLElement>('oui-header-cell, th[oui-header-cell]')
    );

    if (isNativeTable) {
      this._renderer.setStyle(host, 'table-layout', 'fixed');
      // Use min-width so the table fills its container but can overflow
      // when columns are resized to exceed the container width.
      this._renderer.setStyle(host, 'min-width', '100%');
      this._renderer.setStyle(host, 'width', 'auto');
    }

    // Apply widths using consumer-supplied overrides or effectiveMinWidth.
    // The last column is intentionally left for _fillRemainingToLastColumn to
    // expand so it covers all unused container space.
    // Fallback chain per column (highest → lowest priority):
    //   1. Consumer-supplied `columnWidths` input (if positive)
    //   2. _effectiveMinWidth  (no equal-division; last column fills the rest)
    headerCells.forEach((cell) => {
      const columnId = this._getColumnId(cell);
      if (columnId && !this._columnWidths.has(columnId)) {
        const inputWidth = this.columnWidths[columnId];
        const width =
          inputWidth != null && inputWidth > 0
            ? inputWidth
            : this._effectiveMinWidth;
        // Mark every initially-rendered column as user-resized so that a
        // later dynamic column addition does not shrink any of them back to
        // effectiveMinWidth. The last column will still be expanded by
        // _fillRemainingToLastColumn, but that extra space is tracked via
        // _columnWidths and stays stable across add/remove cycles.
        this._userResizedColumns.add(columnId);
        const cells = this._getColumnCells(columnId);
        this._applyWidthToCells(width, cells);
        this._columnWidths.set(columnId, width);
      }
    });
    // If the total of snapshotted widths is less than the container width,
    // absorb the remainder into the last column so the table fills exactly.
    this._fillRemainingToLastColumn(headerCells);
    // Set an explicit pixel width on the table equal to the sum of all
    // snapshotted column widths so further resizes that grow beyond the
    // container can set the table wider than the container.
    this._syncTableWidth();
    // Remove min-width now that we have an explicit pixel width on the table.
    // Keeping min-width: 100% would override the explicit width whenever the
    // column sum drops below the container width, causing table-layout:fixed
    // to redistribute the surplus pixels across ALL columns — exactly the
    // bidirectional-shift bug. The scroll container handles overflow instead.
    // if (isNativeTable) {
    //   this._renderer.removeStyle(host, 'min-width');
    // }
    this._updateStyleSheet();
    // Do not emit here — init widths are auto-calculated, not user-driven.
  }

  /**
   * Distributes any unused container space to the last column in DOM order.
   * Called after snapshotting (or reconciling) column widths to ensure the
   * table always fills its container without leaving a gap on the right.
   */
  private _fillRemainingToLastColumn(headerCells: HTMLElement[]): void {
    const host = this._elementRef.nativeElement;
    const containerWidth = host.parentElement
      ? host.parentElement.clientWidth
      : 0;
    if (containerWidth === 0) {
      return;
    }
    let total = 0;
    this._columnWidths.forEach((w) => (total += w));
    const remaining = containerWidth - total;
    if (remaining <= 0) {
      return;
    }
    let lastColumnId = '';
    for (let i = headerCells.length - 1; i >= 0; i--) {
      const id = this._getColumnId(headerCells[i]);
      if (id && this._columnWidths.has(id)) {
        lastColumnId = id;
        break;
      }
    }
    if (!lastColumnId) {
      return;
    }
    const newWidth = (this._columnWidths.get(lastColumnId) ?? 0) + remaining;
    const cells = this._getColumnCells(lastColumnId);
    this._applyWidthToCells(newWidth, cells);
    this._columnWidths.set(lastColumnId, newWidth);
  }

  /**
   * Watch the table host for any child-list changes in the subtree.
   * We observe `host` (not the header row) because CDK may destroy and
   * recreate the entire `<oui-header-row>` when `displayedColumns` changes,
   * which would leave an observer on a detached element.
   *
   * Only triggers a reinit when the set of header cell column IDs actually
   * changes — body row additions/removals (infinite scroll, pagination) fire
   * the same MutationObserver but must not cause a reinit loop.
   */

  private _watchHeaderRow(): void {
    const host = this._elementRef.nativeElement;

    this._mutationObserver = new MutationObserver(() => {
      if (this._reinitScheduled) return;

      if (host.querySelector('.oui-col-resize-handle')) {
        return;
      }

      this._reinitScheduled = true;

      setTimeout(() => {
        const headerRow = host.querySelector(
          'oui-header-row, tr[oui-header-row]'
        );

        if (!headerRow) {
          this._reinitScheduled = false;
          return;
        }

        this._reinitHandles();
        this._reinitScheduled = false;
      }, 0);
    });

    this._mutationObserver.observe(host, {
      childList: true,
      subtree: true,
    });
  }

  /** Called when CDK re-stamps header cells; re-appends handles and restores widths. */
  private _reinitHandles(): void {
    if (this._handles.length > 0) {
      this._handles.forEach((h) => h.remove());
      this._handles = [];
    }
    // Remove stale handles that may survive on reused cells.
    setTimeout(() => {
      this._handles.forEach((h) => h.remove());
      this._handles = [];

      this._handleUnlisteners.forEach((fn) => fn());
      this._handleUnlisteners = [];

      this._reconcileRemovedColumns();
      this._initHandles();
      this._snapshotNewColumns();
      this._reapplyStoredWidths();
    }, 0);
  }

  /**
   * Detects columns that have been removed from the DOM since the last reinit,
   * deletes them from state, and redistributes the freed space to the last
   * remaining column so the table continues to fill its container.
   */
  private _reconcileRemovedColumns(): void {
    const host = this._elementRef.nativeElement;
    const headerCells = Array.from(
      host.querySelectorAll<HTMLElement>('oui-header-cell, th[oui-header-cell]')
    );
    const currentIds = new Set(
      headerCells.map((c) => this._getColumnId(c)).filter(Boolean)
    );

    // If CDK is in the middle of rebuilding the header row, all cells are
    // momentarily absent. Deleting all stored widths here would cause
    // _snapshotNewColumns to re-initialise every column at effectiveMinWidth.
    // Guard: skip reconciliation when no header cells are present but we have
    // stored widths — that's a transient state, not a real removal.
    if (currentIds.size === 0 && this._columnWidths.size > 0) {
      return;
    }

    const removedIds: string[] = [];
    this._columnWidths.forEach((_, columnId) => {
      if (!currentIds.has(columnId)) {
        removedIds.push(columnId);
      }
    });

    if (removedIds.length === 0) {
      return;
    }

    removedIds.forEach((id) => {
      this._columnWidths.delete(id);
      this._userResizedColumns.delete(id);
      this._dragResizedColumns.delete(id);
    });

    // Redistribute the freed space to the last remaining column.
    this._fillRemainingToLastColumn(headerCells);
    // Do not emit — removal redistribution is auto-calculated, not user-driven.
  }

  /**
   * Scans header cells that have no entry in `_columnWidths` (i.e. columns
   * added after initial render) and pins widths for them.
   *
   * Strategy:
   * - Existing columns that were never user-resized are shrunk to `minColumnWidth`,
   *   freeing up space for the incoming column(s).
   * - Existing columns that the user explicitly resized keep their width.
   * - New columns share the remaining container space equally
   *   (clamped to at least `minColumnWidth`).
   */
  private _snapshotNewColumns(): void {
    const host = this._elementRef.nativeElement;
    const headerCells = Array.from(
      host.querySelectorAll<HTMLElement>('oui-header-cell, th[oui-header-cell]')
    );

    const newColumnIds: string[] = [];
    headerCells.forEach((cell) => {
      const columnId = this._getColumnId(cell);
      if (!columnId || this._columnWidths.has(columnId)) {
        return;
      }
      newColumnIds.push(columnId);
    });

    if (newColumnIds.length === 0) {
      return;
    }

    // Find the last existing column in DOM order (rightmost column that already
    // has a stored width, i.e. was present before this batch of additions).
    let lastExistingColumnId = '';
    for (let i = headerCells.length - 1; i >= 0; i--) {
      const id = this._getColumnId(headerCells[i]);
      if (id && this._columnWidths.has(id)) {
        lastExistingColumnId = id;
        break;
      }
    }

    // Shrink only the last existing column to _effectiveMinWidth (if the user
    // never explicitly resized it) so the new column(s) can claim the freed
    // space. All other columns remain untouched.
    if (
      lastExistingColumnId &&
      !this._userResizedColumns.has(lastExistingColumnId)
    ) {
      const cells = this._getColumnCells(lastExistingColumnId);
      this._applyWidthToCells(this._effectiveMinWidth, cells);
      this._columnWidths.set(lastExistingColumnId, this._effectiveMinWidth);
    }

    // New column(s) share the remaining container space equally,
    // clamped to at least _effectiveMinWidth.
    const containerWidth = host.parentElement
      ? host.parentElement.clientWidth
      : 0;
    let occupiedWidth = 0;
    this._columnWidths.forEach((w) => (occupiedWidth += w));
    const remaining = Math.max(0, containerWidth - occupiedWidth);
    const newColWidth = Math.max(
      this._effectiveMinWidth,
      Math.floor(remaining / newColumnIds.length)
    );

    // For each new column, prefer a consumer-supplied width from the
    // `columnWidths` input when available and positive.
    newColumnIds.forEach((columnId) => {
      const inputWidth = this.columnWidths[columnId];
      if (inputWidth != null && inputWidth > 0) {
        this._columnWidths.set(columnId, inputWidth);
        this._userResizedColumns.add(columnId);
      } else {
        this._columnWidths.set(columnId, newColWidth);
      }
    });

    // Update the stylesheet immediately so CDK-created body cells receive
    // the correct width via CSS as soon as they appear in the DOM.
    this._updateStyleSheet();
    this._syncTableWidth();
    // Do not emit — new-column widths are auto-calculated, not user-driven.
  }

  /** Re-applies every previously-set column width to freshly-rendered cells. */
  private _reapplyStoredWidths(): void {
    this._doApply();
    if (this._pendingApplyRaf !== null) {
      cancelAnimationFrame(this._pendingApplyRaf);
    }
    this._pendingApplyRaf = requestAnimationFrame(() => {
      this._doApplyInline();
      this._pendingApplyRaf = requestAnimationFrame(() => {
        this._pendingApplyRaf = null;
        this._doApplyInline();
      });
    });
  }

  /**
   * Full apply: updates the stylesheet (primary mechanism for flicker prevention)
   * and also stamps inline styles for cells already in the DOM.
   * Called once synchronously at reinit time.
   */
  private _doApply(): void {
    this._updateStyleSheet();
    this._doApplyInline();
  }

  /**
   * Inline-only apply: stamps width styles on cells currently in the DOM.
   * Used in the rAF retry passes where the stylesheet is already up-to-date
   * (updated synchronously in _doApply) — avoids redundant stylesheet rewrites.
   */
  private _doApplyInline(): void {
    this._columnWidths.forEach((width, columnId) => {
      const cells = this._getColumnCells(columnId);
      this._applyWidthToCells(width, cells);
    });
    this._syncTableWidth();
  }

  /**
   * Creates a <style> element in the document <head> scoped to this table via
   * a unique `data-oui-resize-id` attribute. CSS rules applied here take effect
   * on any cell CDK creates with a matching `cdk-column-*` class — including
   * cells rendered after our synchronous code runs — eliminating render flicker.
   */
  private _initStyleSheet(): void {
    if (this._styleEl) {
      return;
    }
    this._styleEl = document.createElement('style');
    this._styleEl.setAttribute('data-oui-resize-id', this._tableId);
    document.head.appendChild(this._styleEl);
  }

  /** Regenerates the scoped stylesheet from the current `_columnWidths` map. */
  private _updateStyleSheet(): void {
    if (!this._styleEl) {
      return;
    }
    const isNativeTable = this._elementRef.nativeElement.tagName === 'TABLE';
    const scope = `[data-oui-resize-id="${this._tableId}"]`;
    const rules: string[] = [];
    this._columnWidths.forEach((width, columnId) => {
      const px = `${width}px`;
      const sel = `${scope} .cdk-column-${columnId}`;
      const flex = isNativeTable ? '' : ` flex: 0 0 ${px} !important;`;
      rules.push(
        `${sel} { width: ${px} !important; min-width: ${px} !important;` +
          ` max-width: ${px} !important; box-sizing: border-box !important;${flex} }`
      );
    });
    this._styleEl.textContent = rules.join('\n');
  }

  /** Emits only explicitly drag-resized column widths to `columnWidthsChange`.
   * Auto-calculated widths (init, last-column fill, add/remove redistribution)
   * are intentionally excluded so the parent's persisted map is never
   * overwritten by transient layout computations.
   */
  private _emitColumnWidths(): void {
    if (this._dragResizedColumns.size === 0) {
      return;
    }
    const out: Record<string, number> = {};
    this._dragResizedColumns.forEach((id) => {
      const w = this._columnWidths.get(id);
      if (w !== undefined) {
        out[id] = w;
      }
    });
    this._ngZone.run(() => {
      this.columnWidthsChange.emit(out);
    });
  }

  private _initHandles(): void {
    const host = this._elementRef.nativeElement;
    const headerCells = Array.from(
      host.querySelectorAll<HTMLElement>('oui-header-cell, th[oui-header-cell]')
    );

    headerCells.forEach((cell) => {
      const handle = this._renderer.createElement('div') as HTMLElement;
      this._renderer.addClass(handle, 'oui-col-resize-handle');
      this._renderer.setAttribute(handle, 'aria-hidden', 'true');
      this._renderer.appendChild(cell, handle);
      this._handles.push(handle);

      this._renderer.setStyle(cell, 'position', 'relative');
      this._renderer.setStyle(cell, 'overflow', 'visible');
      this._renderer.setStyle(handle, 'touch-action', 'none');
      this._renderer.setStyle(handle, 'cursor', 'col-resize');
      this._renderer.setStyle(cell, 'user-select', 'none');

      // pointerdown on handle — run outside zone to avoid unnecessary CD cycles.
      const unlisten = this._renderer.listen(
        handle,
        'pointerdown',
        (e: PointerEvent) => {
          e.preventDefault();
          e.stopPropagation();
          this._onPointerDown(e, cell, handle);
        }
      );
      this._handleUnlisteners.push(unlisten);
    });
  }

  private _getColumnId(cell: HTMLElement): string {
    const classes = Array.from(cell.classList);
    const colClass = classes.find((c) => c.startsWith('cdk-column-'));
    return colClass ? colClass.replace('cdk-column-', '') : '';
  }

  private _getColumnCells(columnId: string): HTMLElement[] {
    return Array.from(
      this._elementRef.nativeElement.querySelectorAll<HTMLElement>(
        `.cdk-column-${columnId}`
      )
    );
  }

  private _onPointerDown(
    e: PointerEvent,
    headerCell: HTMLElement,
    handle: HTMLElement
  ): void {
    this._lastPointerId = e.pointerId;
    this._isDragging = true;
    this._hasMoved = false;
    this._activeHeaderCell = headerCell;
    this._startX = e.clientX;
    this._startWidth = headerCell.getBoundingClientRect().width;
    // scrollWidth = minimum space needed to render content without clipping.
    // However, some browsers report scrollWidth = boundingClientRect.width for flex items
    // if content doesn't overflow. We check children to find the true content width.
    let contentWidth = 0;
    Array.from(headerCell.childNodes).forEach((node) => {
      if (
        node instanceof HTMLElement &&
        !node.classList.contains('oui-col-resize-handle')
      ) {
        contentWidth += node.scrollWidth;
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Text nodes don't have scrollWidth; we need a range to measure.
        const range = document.createRange();
        range.selectNodeContents(node);
        contentWidth += range.getBoundingClientRect().width;
      }
    });

    // Add back the padding (36px for menu, 12.5px default).
    const style = globalThis.getComputedStyle(headerCell);
    const padding =
      Number.parseFloat(style.paddingLeft) +
      Number.parseFloat(style.paddingRight);

    // Minimum drag floor:
    //   - Must be at least contentWidth + padding (content must fit).
    //   - If the column was initialised BELOW _effectiveMinWidth (e.g. equal-
    //     division gave 133px with a 200px minimum), we honour the smaller
    //     initial width so the first drag move doesn't immediately snap the
    //     column up to 200. In all other cases the floor is _effectiveMinWidth.
    this._minCellWidth = Math.max(
      contentWidth + padding,
      Math.min(this._startWidth, this._effectiveMinWidth)
    );
    this._columnId = this._getColumnId(headerCell);
    this._columnCells = this._getColumnCells(this._columnId);
    this._activeHeaderCell = headerCell;
    this._activeHandle = handle;
    // Find the elastic column: the rightmost column that is NOT the dragged
    // one. If the dragged column IS the rightmost, disable elastic entirely
    // (dragging the last column's handle should grow/shrink the table freely).
    this._elasticColumnId = '';
    this._elasticColumnStartWidth = 0;
    this._elasticColumnWasUserResized = false;
    this._elasticEnabled = false;
    const allHeaderCells = Array.from(
      this._elementRef.nativeElement.querySelectorAll<HTMLElement>(
        'oui-header-cell, th[oui-header-cell]'
      )
    );
    // Find the actual last column (rightmost) in DOM order.
    let lastColumnId = '';
    for (let i = allHeaderCells.length - 1; i >= 0; i--) {
      const id = this._getColumnId(allHeaderCells[i]);
      if (id && this._columnWidths.has(id)) {
        lastColumnId = id;
        break;
      }
    }
    // Only enable elastic when dragging a non-last column and the table
    // currently fits the container (no horizontal scroll present).
    if (lastColumnId && lastColumnId !== this._columnId) {
      this._elasticColumnId = lastColumnId;
      this._elasticColumnStartWidth = this._columnWidths.get(lastColumnId) ?? 0;
      this._elasticColumnWasUserResized =
        this._userResizedColumns.has(lastColumnId);
      let startTotal = 0;
      this._columnWidths.forEach((w) => (startTotal += w));
      const cw = this._elementRef.nativeElement.parentElement
        ? this._elementRef.nativeElement.parentElement.clientWidth
        : 0;
      // Allow 1 px of rounding slack.
      this._elasticEnabled = cw > 0 && startTotal <= cw + 1;

      // Compute the elastic column's true minimum: measure its header cell's
      // content + padding the same way we do for the dragged column.
      // When the elastic column started ABOVE effectiveMinWidth we use
      // effectiveMinWidth as the floor (normal case).
      // When it started BELOW (e.g. equal-division gave 133px with 200px
      // default minimum) we fall back to content+padding so the elastic column
      // can still absorb the drag instead of pinning immediately.
      const elasticHeaderCell = allHeaderCells.find(
        (c) => this._getColumnId(c) === lastColumnId
      );
      let elasticContentWidth = 0;
      if (elasticHeaderCell) {
        Array.from(elasticHeaderCell.childNodes).forEach((node) => {
          if (
            node instanceof HTMLElement &&
            !node.classList.contains('oui-col-resize-handle')
          ) {
            elasticContentWidth += node.scrollWidth;
          } else if (node.nodeType === Node.TEXT_NODE) {
            const range = document.createRange();
            range.selectNodeContents(node);
            elasticContentWidth += range.getBoundingClientRect().width;
          }
        });
        const ecs = globalThis.getComputedStyle(elasticHeaderCell);
        const elasticPadding =
          Number.parseFloat(ecs.paddingLeft) +
          Number.parseFloat(ecs.paddingRight);
        const contentFloor = Math.max(1, elasticContentWidth + elasticPadding);
        this._elasticColumnMinWidth =
          this._elasticColumnStartWidth >= this._effectiveMinWidth
            ? this._effectiveMinWidth // started above min → honour min
            : contentFloor; // started below min → shrink to content
      } else {
        this._elasticColumnMinWidth = this._effectiveMinWidth;
      }
    }
    try {
      handle.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture can fail in browsers that do not fully support it.
    }

    // Mark only this handle as active (not the whole table — avoids coloring all handles).
    this._activeHandle = handle;
    this._renderer.addClass(handle, 'oui-col-resize-handle--active');
    this._renderer.addClass(document.body, 'oui-table-resize-cursor');

    // Highlight the right border of the column being resized.
    this._columnCells.forEach((cell) =>
      this._renderer.addClass(cell, 'oui-col-resize-active')
    );

    // Add active class so resize is visible even when not hovering.
    this._renderer.addClass(
      this._elementRef.nativeElement,
      'oui-table-resizing'
    );
    this._mouseMoveUnlisten = this._renderer.listen(
      handle,
      'pointermove',
      (ev: PointerEvent) => this._onPointerMove(ev)
    );
    this._mouseUpUnlisten = this._renderer.listen(
      handle,
      'pointerup',
      (ev: PointerEvent) => this._onPointerUp(ev)
    );
    this._mouseCancelUnlisten = this._renderer.listen(
      handle,
      'pointercancel',
      () => this._cancelResize()
    );
  }

  private _onPointerMove(e: PointerEvent): void {
    if (!this._isDragging) {
      return;
    }
    const delta = e.clientX - this._startX;
    if (Math.abs(delta) > 2) {
      this._hasMoved = true;
    }
    const newWidth = Math.max(this._minCellWidth, this._startWidth + delta);

    // Elastic column logic: keep the table at exactly containerWidth by
    // adjusting the rightmost non-dragged column in both directions.
    //   • Shrink dragged column → elastic column grows to fill freed space.
    //   • Expand dragged column → elastic column compresses to absorb overflow.
    // A scrollbar only appears when the elastic column hits _effectiveMinWidth.
    // Re-evaluate whether elastic should be active on every move: if the table
    // was scrolling at drag-start but the user has since shrunk columns enough
    // that the total now fits, we engage elastic from that point forward.
    if (this._elasticColumnId) {
      const containerWidth = this._elementRef.nativeElement.parentElement
        ? this._elementRef.nativeElement.parentElement.clientWidth
        : 0;

      // Compute what the total would be with the new drag width but without
      // any elastic adjustment, to decide whether elastic should activate.
      if (containerWidth > 0) {
        let currentTotal = newWidth;
        this._columnWidths.forEach((w, id) => {
          if (id !== this._columnId) currentTotal += w;
        });
        // Engage elastic when the projected total fits (or the table already fits).
        if (!this._elasticEnabled && currentTotal <= containerWidth + 1) {
          this._elasticEnabled = true;
          // Refresh elastic start width to the current stored value so the
          // transition into elastic mode is seamless.
          this._elasticColumnStartWidth =
            this._columnWidths.get(this._elasticColumnId) ??
            this._elasticColumnStartWidth;
          this._elasticColumnWasUserResized = this._userResizedColumns.has(
            this._elasticColumnId
          );
        }
      }
    }

    if (this._elasticEnabled && this._elasticColumnId) {
      const containerWidth = this._elementRef.nativeElement.parentElement
        ? this._elementRef.nativeElement.parentElement.clientWidth
        : 0;

      if (containerWidth > 0) {
        // Sum of every column except the dragged one and the elastic one.
        let fixedTotal = 0;
        this._columnWidths.forEach((w, id) => {
          if (id !== this._columnId && id !== this._elasticColumnId) {
            fixedTotal += w;
          }
        });
        // The elastic column gets whatever space is left after the dragged
        // column and all fixed columns are accounted for.
        const targetElasticWidth = containerWidth - fixedTotal - newWidth;
        if (targetElasticWidth >= this._elasticColumnMinWidth) {
          // Elastic column fills the gap; it is not considered user-resized.
          this._columnWidths.set(this._elasticColumnId, targetElasticWidth);
          this._userResizedColumns.delete(this._elasticColumnId);
        } else {
          // Hit minimum — pin it and let the table overflow (scrollbar appears).
          this._columnWidths.set(
            this._elasticColumnId,
            this._elasticColumnMinWidth
          );
          this._userResizedColumns.add(this._elasticColumnId);
        }
        const elasticWidth = this._columnWidths.get(this._elasticColumnId) ?? 0;
        this._applyWidthToCells(
          elasticWidth,
          this._getColumnCells(this._elasticColumnId)
        );
      }
    }

    // Update the stylesheet for this column so the !important CSS rule
    // reflects the live drag width — inline styles alone lose to !important.
    // We write directly to _columnWidths here only as a temporary preview;
    // _onPointerUp will set the final committed value.
    this._columnWidths.set(this._columnId, newWidth);
    this._updateStyleSheet();
    this._syncTableWidth();
    this._applyWidth(newWidth);
  }

  private _onPointerUp(_e: PointerEvent): void {
    this._renderer.removeClass(document.body, 'oui-table-resize-cursor');
    if (!this._isDragging) {
      return;
    }
    const hasMoved = this._hasMoved;
    const headerCell = this._activeHeaderCell;
    this._hasMoved = false;
    this._activeHeaderCell = null;
    this._isDragging = false;
    this._cleanupDragListeners();

    // If the user actually dragged, suppress the click the browser fires after
    // pointerup — otherwise it would land on the sort header button and
    // trigger an unwanted sort.
    if (hasMoved && headerCell) {
      const suppressClick = (e: MouseEvent) => e.stopPropagation();
      headerCell.addEventListener('click', suppressClick, {
        capture: true,
        once: true,
      });
      // Safety: remove if no click follows within 300 ms (pointer left element).
      setTimeout(
        () => headerCell.removeEventListener('click', suppressClick, true),
        300
      );
    }

    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'oui-table-resizing'
    );

    if (this._activeHandle) {
      this._renderer.removeClass(
        this._activeHandle,
        'oui-col-resize-handle--active'
      );
      this._activeHandle = null;
    }

    // Remove right border highlight from column cells.
    this._columnCells.forEach((cell) =>
      this._renderer.removeClass(cell, 'oui-col-resize-active')
    );

    const finalWidth =
      this._columnCells.length > 0
        ? this._columnCells[0].getBoundingClientRect().width
        : this._startWidth;

    // Persist so we can restore the width if columns are reordered later.
    this._columnWidths.set(this._columnId, finalWidth);
    // Mark as explicitly user-resized so future dynamic column additions
    // do not shrink this column back to _effectiveMinWidth.
    this._userResizedColumns.add(this._columnId);
    // Track as drag-resized so this column is included in the next emit.
    this._dragResizedColumns.add(this._columnId);
    // Keep the table's explicit width and the stylesheet in sync.
    this._updateStyleSheet();
    this._syncTableWidth();
    this._emitColumnWidths();

    // Emit the single-column event inside zone so Angular can run CD.
    this._ngZone.run(() => {
      this.columnResized.emit({ columnId: this._columnId, width: finalWidth });
    });
  }

  private _cancelResize(): void {
    this._renderer.removeClass(document.body, 'oui-table-resize-cursor');
    if (!this._isDragging) {
      return;
    }
    this._isDragging = false;
    this._cleanupDragListeners();

    // Roll back the temporary drag-preview width written to _columnWidths
    // during pointermove. Without this, cancelling a drag leaves the in-progress
    // width permanently stored and corrupts future column add/remove calculations.
    this._columnWidths.set(this._columnId, this._startWidth);
    // Restore the elastic column to its exact pre-drag state.
    if (this._elasticColumnId) {
      this._columnWidths.set(
        this._elasticColumnId,
        this._elasticColumnStartWidth
      );
      if (this._elasticColumnWasUserResized) {
        this._userResizedColumns.add(this._elasticColumnId);
      } else {
        this._userResizedColumns.delete(this._elasticColumnId);
      }
      this._applyWidthToCells(
        this._elasticColumnStartWidth,
        this._getColumnCells(this._elasticColumnId)
      );
    }
    this._updateStyleSheet();
    this._syncTableWidth();
    // Restore the cells to the pre-drag width.
    this._applyWidthToCells(this._startWidth, this._columnCells);

    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'oui-table-resizing'
    );
    if (this._activeHandle) {
      this._renderer.removeClass(
        this._activeHandle,
        'oui-col-resize-handle--active'
      );
      this._activeHandle = null;
    }
    // Remove right border highlight from column cells.
    this._columnCells.forEach((cell) =>
      this._renderer.removeClass(cell, 'oui-col-resize-active')
    );
  }

  private _cleanupDragListeners(): void {
    this._mouseMoveUnlisten?.();
    this._mouseUpUnlisten?.();
    this._mouseCancelUnlisten?.();
    this._mouseMoveUnlisten = null;
    this._mouseUpUnlisten = null;
    this._mouseCancelUnlisten = null;
  }

  /**
   * Sets the table host's inline `width` to the sum of all column widths.
   * Applies to both native `<table>` and CDK flex tables (`oui-table`).
   *
   * When the sum exceeds the container width the scroll container shows a
   * horizontal scrollbar. When the sum is less than the container the table
   * is narrower and the container background is visible to the right —
   * matching the same behaviour as when the scrollbar is visible.
   */
  private _syncTableWidth(): void {
    let total = 0;
    this._columnWidths.forEach((w) => (total += w));
    if (total > 0) {
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'width',
        `${total}px`
      );
    }
  }

  /**
   * Apply an explicit width to all cells (header + body) in the column.
   * Since oui-table rows are display:flex, we pin flex properties so that
   * the cell does not grow/shrink beyond the resized width.
   */
  private _applyWidth(width: number): void {
    this._applyWidthToCells(width, this._columnCells);
  }

  private _applyWidthToCells(width: number, cells: HTMLElement[]): void {
    const px = `${width}px`;
    const isNativeTable = this._elementRef.nativeElement.tagName === 'TABLE';
    cells.forEach((cell) => {
      this._renderer.setStyle(cell, 'width', px);
      this._renderer.setStyle(cell, 'min-width', px);
      this._renderer.setStyle(cell, 'max-width', px);
      this._renderer.setStyle(cell, 'box-sizing', 'border-box');
      if (!isNativeTable) {
        // Flex-based rows (oui-table / oui-row) need explicit flex sizing.
        this._renderer.setStyle(cell, 'flex', `0 0 ${px}`);
      }
    });
  }

  ngOnDestroy(): void {
    try {
      if (this._activeHandle && this._lastPointerId !== 0) {
        this._activeHandle.releasePointerCapture(this._lastPointerId);
      }
    } catch {
      // Ignore cleanup failures during teardown.
    }
    this._cleanupDragListeners();
    this._handleUnlisteners.forEach((fn) => fn());
    this._handles.forEach((h) => h.remove());
    this._handles = [];
    this._mutationObserver?.disconnect();
    this._overflowObserver?.disconnect();
    this._overflowObserver = null;
    if (this._pendingApplyRaf !== null) {
      cancelAnimationFrame(this._pendingApplyRaf);
      this._pendingApplyRaf = null;
    }
    if (this._styleEl) {
      this._styleEl.remove();
      this._styleEl = null;
    }
    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'oui-table-resizing'
    );
  }

  private _watchOverflow(): void {
    const tableEl = this._elementRef.nativeElement;
    const container = tableEl.parentElement;
    if (!container) {
      return;
    }

    const update = () => {
      const overflows = container.scrollWidth > container.clientWidth;
      if (overflows) {
        this._renderer.addClass(tableEl, 'oui-table-col-overflow');
      } else {
        this._renderer.removeClass(tableEl, 'oui-table-col-overflow');
      }
    };

    this._overflowObserver = new ResizeObserver(update);
    this._overflowObserver.observe(container);
    this._overflowObserver.observe(tableEl);
    update();
  }
}
