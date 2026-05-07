import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  NgZone,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ColumnOrderChangedEvent {
  /** Original column index (before drag). */
  previousIndex: number;
  /** Target column index (where it was dropped). */
  currentIndex: number;
  /**
   * Full ordered array of column IDs after the move.
   * Consumer should assign this to displayedColumns.
   */
  columnIds: string[];
}

@Directive({
  selector:
    'oui-table[ouiReorderableColumns], table[oui-table][ouiReorderableColumns]',
  standalone: false,
})
export class OuiReorderableColumnsDirective
  implements AfterViewInit, OnDestroy
{
  /** Emitted when a column is dropped in a new position. */
  @Output() columnOrderChanged = new EventEmitter<ColumnOrderChangedEvent>();

  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _renderer = inject(Renderer2);
  private _ngZone = inject(NgZone);
  private _platformId = inject(PLATFORM_ID);

  // ─── Live state ──────────────────────────────────────────────────────────────
  private _headerCells: HTMLElement[] = [];

  // ─── Per-drag state ───────────────────────────────────────────────────────────
  private _dragging = false;
  /** True from pointerdown until full cleanup — guards MutationObserver re-attach. */
  private _dragActive = false;
  /** True while _onPointerUp is running — prevents lostpointercapture from re-entering cleanup. */
  private _pointerUpInProgress = false;
  private _sourceIndex = -1;
  private _startX = 0;
  private _startY = 0;
  /** Offset from cursor to cell left edge at pointerdown — keeps ghost pinned under cursor horizontally. */
  private _cursorOffsetX = 0;
  /** Offset from cursor to cell top edge at pointerdown — keeps ghost pinned under cursor vertically. */
  private _cursorOffsetY = 0;
  private _columnIds: string[] = [];
  /** CDK column ID of the currently highlighted target column. */
  private _highlightedTargetColumnId = '';
  /**
   * The insertion slot index: the column will be inserted BEFORE this index.
   * A value equal to _headerCells.length means "insert at the very end".
   */
  private _insertionSlot = -1;
  private _ghost: HTMLElement | null = null;
  private _dropIndicator: HTMLElement | null = null;

  // ─── Per-drag cell-level listeners (set once per drag, cleaned up on pointerup) ─
  private _dragMoveUnlisten: (() => void) | null = null;
  private _dragUpUnlisten: (() => void) | null = null;
  private _dragCancelUnlisten: (() => void) | null = null;
  private _dragLostCaptureUnlisten: (() => void) | null = null;
  private _dragSelectStartUnlisten: (() => void) | null = null;
  private _dragNativeDragUnlisten: (() => void) | null = null;

  // ─── Document-level pointerup fallback (always fires, even if cell listeners fail) ─
  private _docPointerUpHandler: ((e: PointerEvent) => void) | null = null;

  // ─── Persistent pointerdown listeners (one per header cell) ──────────────────
  private _cellUnlisteners: (() => void)[] = [];

  // ─── MutationObserver to auto-refresh when columns re-render ─────────────────
  private _mutationObserver: MutationObserver | null = null;

  // ─── ResizeObserver to detect table overflow and toggle shadow class ─────────
  private _overflowObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._attachCellListeners();
        this._watchHeaderRow();
        this._watchOverflow();
      }, 0);
    });
  }

  // ─── Cell listener management ─────────────────────────────────────────────────

  private _attachCellListeners(): void {
    this._detachCellListeners();
    this._headerCells = Array.from(
      this._elementRef.nativeElement.querySelectorAll<HTMLElement>(
        'oui-header-cell, th[oui-header-cell]'
      )
    );

    this._headerCells.forEach((cell, idx) => {
      const unlisten = this._renderer.listen(
        cell,
        'pointerdown',
        (e: PointerEvent) => {
          // First column is locked — never allow dragging it.
          if (idx === 0) {
            return;
          }
          // Skip resize handle, ⋮ menu trigger, and sort indicator —
          // those have their own click handlers. setPointerCapture must not
          // be called on these targets or the browser re-routes the click to
          // the <th> (the captured element), preventing their handlers from firing.
          const target = e.target as HTMLElement;
          if (
            target.closest('.oui-col-resize-handle') ||
            target.closest('.oui-column-menu-trigger') ||
            target.closest('.oui-column-sort-indicator')
          ) {
            return;
          }
          this._onPointerDown(e, cell, idx);
        }
      );
      this._cellUnlisteners.push(unlisten);
    });
  }

  private _detachCellListeners(): void {
    this._cellUnlisteners.forEach((fn) => fn());
    this._cellUnlisteners = [];
  }

  // ─── MutationObserver: re-attach after column re-render ──────────────────────

  private _watchHeaderRow(): void {
    const host = this._elementRef.nativeElement;
    // Observe the direct children of the table host; CDK re-stamps header cells
    // into the header row when displayedColumns changes.
    this._mutationObserver = new MutationObserver(() => {
      // Debounce: CDK may fire multiple mutations in one tick.
      // Skip re-attaching while a drag is active — it would tear down listeners
      // on the cell that currently holds pointer capture.
      if (this._dragActive) {
        return;
      }
      setTimeout(() => {
        if (!this._dragActive) {
          this._attachCellListeners();
        }
      }, 0);
    });
    this._mutationObserver.observe(host, { childList: true, subtree: true });
  }

  // ─── Drag lifecycle ───────────────────────────────────────────────────────────

  private _onPointerDown(
    e: PointerEvent,
    cell: HTMLElement,
    cellIndex: number
  ): void {
    this._dragging = false;
    this._dragActive = true;
    this._sourceIndex = cellIndex;
    this._startX = e.clientX;
    this._startY = e.clientY;

    // Capture cursor offset within the cell so the ghost stays pinned under the cursor.
    const cellRect = cell.getBoundingClientRect();
    this._cursorOffsetX = e.clientX - cellRect.left;
    this._cursorOffsetY = e.clientY - cellRect.top;

    // Snapshot column IDs now — they won't change mid-drag.
    this._columnIds = this._headerCells.map((c) => this._getColumnId(c));

    // Pointer capture: all subsequent pointermove / pointerup events are
    // delivered to `cell` regardless of where the pointer moves — same
    // pattern used by the resize directive.
    cell.setPointerCapture(e.pointerId);

    this._dragMoveUnlisten = this._renderer.listen(
      cell,
      'pointermove',
      (ev: PointerEvent) => this._onPointerMove(ev)
    );
    this._dragUpUnlisten = this._renderer.listen(
      cell,
      'pointerup',
      (ev: PointerEvent) => this._onPointerUp(ev)
    );
    this._dragCancelUnlisten = this._renderer.listen(
      cell,
      'pointercancel',
      () => this._cancelDrag()
    );
    // lostpointercapture fires whenever the browser releases capture for any reason
    // (long-hold OS gesture, context menu, native drag takeover, etc.).
    // Treat it as a cancel — ghost snaps back, no reorder emitted.
    this._dragLostCaptureUnlisten = this._renderer.listen(
      cell,
      'lostpointercapture',
      () => this._cancelDrag()
    );
    // Suppress text-selection during hold+drag — browsers fire selectstart on
    // long presses which can steal the pointer stream away from our handlers.
    this._dragSelectStartUnlisten = this._renderer.listen(
      cell,
      'selectstart',
      (ev: Event) => ev.preventDefault()
    );
    // Suppress native HTML5 drag — it fires 'dragstart' after a long hold and
    // can swallow the subsequent pointerup, leaving the ghost stranded.
    this._dragNativeDragUnlisten = this._renderer.listen(
      cell,
      'dragstart',
      (ev: Event) => ev.preventDefault()
    );

    // Document-level pointerup: guaranteed to fire regardless of pointer capture
    // state. This is the safety net that ensures highlights are always removed.
    this._removeDocPointerUp();
    this._docPointerUpHandler = (ev: PointerEvent) => this._onPointerUp(ev);
    document.addEventListener('pointerup', this._docPointerUpHandler, {
      once: true,
    });
  }

  private _onPointerMove(e: PointerEvent): void {
    const dx = e.clientX - this._startX;
    const dy = e.clientY - this._startY;

    if (!this._dragging) {
      // Wait for 5px movement before committing to a drag.
      if (Math.sqrt(dx * dx + dy * dy) < 5) {
        return;
      }
      this._dragging = true;
      this._createGhost();
      this._createDropIndicator();
      this._renderer.addClass(
        this._elementRef.nativeElement,
        'oui-table-reordering'
      );
      // Highlight only the source header cell (not the whole column).
      if (this._sourceIndex >= 0 && this._headerCells[this._sourceIndex]) {
        this._renderer.addClass(
          this._headerCells[this._sourceIndex],
          'oui-col-reorder-source'
        );
      }
    }

    // Ghost follows the cursor freely in both X and Y.
    // Only the height is pinned to the table height.
    if (this._ghost) {
      const tableRect = this._elementRef.nativeElement.getBoundingClientRect();
      const bounds = this._getVisibleBounds(tableRect);
      // Ghost follows the cursor freely in both X and Y —
      // only its height is locked to the visible table height.
      const ghostX = e.clientX - this._cursorOffsetX;
      const ghostY = e.clientY - this._cursorOffsetY;

      this._renderer.setStyle(
        this._ghost,
        'transform',
        `translate(${ghostX}px, ${ghostY}px)`
      );
      // Keep ghost height equal to the visible table height.
      this._renderer.setStyle(
        this._ghost,
        'height',
        `${bounds.bottom - bounds.top}px`
      );
    }

    this._insertionSlot = this._getInsertionSlot(e.clientX);
    const isOverTable = this._isCursorOverHeaderCell(e.clientX, e.clientY);
    this._positionDropIndicator(this._insertionSlot, isOverTable);
  }

  private _onPointerUp(_e: PointerEvent): void {
    // Guard: prevent double-entry (cell pointerup + document pointerup both fire)
    // and prevent lostpointercapture from re-entering cleanup.
    if (this._pointerUpInProgress || !this._dragActive) {
      return;
    }
    this._pointerUpInProgress = true;

    const wasDragging = this._dragging;
    this._dragging = false;

    // Remove ALL drag listeners first so releasePointerCapture won't
    // trigger lostpointercapture → _cancelDrag.
    this._cleanupDragListeners();

    // Now safe to release pointer capture.
    if (this._sourceIndex >= 0 && this._headerCells[this._sourceIndex]) {
      try {
        this._headerCells[this._sourceIndex].releasePointerCapture(
          _e.pointerId
        );
      } catch {
        // Already released by the browser.
      }
    }

    // Always clean up ALL visual artifacts.
    this._clearAllHighlights();
    this._destroyGhost();
    this._destroyDropIndicator();
    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'oui-table-reordering'
    );

    this._pointerUpInProgress = false;

    if (!wasDragging) {
      return;
    }

    // After a real drag, suppress the click event that the browser fires
    // immediately after pointerup. Without this, releasing the pointer
    // over the sort indicator fires onSortClick and triggers an unintended sort.
    // Use document-level capture to intercept regardless of which element
    // the click is dispatched to (varies by browser / capture state).
    const suppressDragClick = (evt: MouseEvent) => {
      evt.stopImmediatePropagation();
      evt.preventDefault();
    };
    document.addEventListener('click', suppressDragClick, {
      capture: true,
      once: true,
    });
    // Safety: remove the suppressor if no click fires within 300ms.
    setTimeout(
      () => document.removeEventListener('click', suppressDragClick, true),
      300
    );

    const prev = this._sourceIndex;

    // Valid drop: cursor is over a header cell and the insertion slot would
    // actually move the column (not a no-op).
    const isNoOp =
      this._insertionSlot === prev || this._insertionSlot === prev + 1;
    const validDrop =
      !isNoOp && this._isCursorOverHeaderCell(_e.clientX, _e.clientY);

    if (validDrop) {
      // Convert the insertion slot to a final index in the original array.
      // _insertionSlot is the slot index in the current column order.
      // When the source is before the slot, removing it shifts all later
      // indices down by one, so we subtract 1 from the slot.
      let finalIndex = this._insertionSlot;
      if (prev < finalIndex) {
        finalIndex -= 1;
      }
      // Clamp to valid range after removal.
      finalIndex = Math.max(
        0,
        Math.min(finalIndex, this._columnIds.length - 1)
      );

      if (prev !== finalIndex) {
        const newOrder = [...this._columnIds];
        const [moved] = newOrder.splice(prev, 1);
        newOrder.splice(finalIndex, 0, moved);

        this._ngZone.run(() => {
          this.columnOrderChanged.emit({
            previousIndex: prev,
            currentIndex: finalIndex,
            columnIds: newOrder,
          });
        });
      }
    }
  }

  private _cancelDrag(): void {
    // If _onPointerUp is already handling cleanup, do nothing.
    if (this._pointerUpInProgress) {
      return;
    }
    this._dragging = false;
    this._cleanupDragListeners();
    // Always clean up visual artifacts — even if _dragging was not yet true
    // (e.g. lostpointercapture during a long hold).
    this._clearAllHighlights();
    this._destroyGhost();
    this._destroyDropIndicator();
    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'oui-table-reordering'
    );
  }

  private _cleanupDragListeners(): void {
    this._dragMoveUnlisten?.();
    this._dragUpUnlisten?.();
    this._dragCancelUnlisten?.();
    this._dragLostCaptureUnlisten?.();
    this._dragSelectStartUnlisten?.();
    this._dragNativeDragUnlisten?.();
    this._dragMoveUnlisten = null;
    this._dragUpUnlisten = null;
    this._dragCancelUnlisten = null;
    this._dragLostCaptureUnlisten = null;
    this._dragSelectStartUnlisten = null;
    this._dragNativeDragUnlisten = null;
    this._removeDocPointerUp();
    this._dragActive = false;
  }

  private _removeDocPointerUp(): void {
    if (this._docPointerUpHandler) {
      document.removeEventListener('pointerup', this._docPointerUpHandler);
      this._docPointerUpHandler = null;
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  /**
   * Returns the visible bounds of the table, intersected with the nearest
   * scroll ancestor AND the viewport so drag visuals never escape the
   * visible area — even when the page itself is the scroll context.
   */
  private _getVisibleBounds(tableRect: DOMRect): {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } {
    const bounds = {
      left: tableRect.left,
      top: tableRect.top,
      right: tableRect.right,
      bottom: tableRect.bottom,
    };

    // Walk up to find the nearest scroll ancestor and clamp to its rect.
    const scrollParent = this._findScrollParent(this._elementRef.nativeElement);
    if (scrollParent) {
      const sr = scrollParent.getBoundingClientRect();
      bounds.left = Math.max(bounds.left, sr.left);
      bounds.top = Math.max(bounds.top, sr.top);
      bounds.right = Math.min(bounds.right, sr.right);
      bounds.bottom = Math.min(bounds.bottom, sr.bottom);
    }

    // Always clamp to the viewport as a final safety net (handles
    // page-level scrolling where no scroll ancestor exists).
    bounds.left = Math.max(bounds.left, 0);
    bounds.top = Math.max(bounds.top, 0);
    bounds.right = Math.min(bounds.right, globalThis.innerWidth);
    bounds.bottom = Math.min(bounds.bottom, globalThis.innerHeight);

    return bounds;
  }

  /** Walk up the DOM to find the nearest ancestor with overflow scrolling. */
  private _findScrollParent(el: HTMLElement): HTMLElement | null {
    let parent = el.parentElement;
    while (parent && parent !== document.documentElement) {
      const style = globalThis.getComputedStyle(parent);
      if (/(auto|scroll|hidden)/.test(style.overflowY)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  private _getColumnId(cell: HTMLElement): string {
    const cls = Array.from(cell.classList).find((c) =>
      c.startsWith('cdk-column-')
    );
    return cls ? cls.replace('cdk-column-', '') : '';
  }

  /** Returns true if the cursor is within any header cell's bounding rect. */
  private _isCursorOverHeaderCell(clientX: number, clientY: number): boolean {
    return this._headerCells.some((cell) => {
      const r = cell.getBoundingClientRect();
      return (
        clientX >= r.left &&
        clientX <= r.right &&
        clientY >= r.top &&
        clientY <= r.bottom
      );
    });
  }

  /**
   * Calculate the insertion slot index — the position BEFORE which the
   * dragged column will be inserted. This is edge-based, not center-based:
   * the cursor position relative to each column boundary determines the slot.
   *
   * Returns a value in [1, _headerCells.length] (slot 0 = before the locked
   * first column, which is never valid).
   */
  private _getInsertionSlot(clientX: number): number {
    const tableRect = this._elementRef.nativeElement.getBoundingClientRect();
    const bounds = this._getVisibleBounds(tableRect);
    const clampedX = Math.max(bounds.left, Math.min(clientX, bounds.right));

    // Walk the header cells and find which gap the cursor falls into.
    // A "gap" is between the midpoint of column N and the midpoint of column N+1.
    // If cursor is left of the first movable column's midpoint → slot = 1.
    // If cursor is right of the last column's midpoint → slot = length.
    for (let i = 1; i < this._headerCells.length; i++) {
      const rect = this._headerCells[i].getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      if (clampedX < mid) {
        return i;
      }
    }
    return this._headerCells.length;
  }

  // ─── Ghost ────────────────────────────────────────────────────────────────────

  private _createGhost(): void {
    const source = this._headerCells[this._sourceIndex];
    const cellRect = source.getBoundingClientRect();
    const tableRect = this._elementRef.nativeElement.getBoundingClientRect();
    const bounds = this._getVisibleBounds(tableRect);

    this._ghost = this._renderer.createElement('div') as HTMLElement;
    this._renderer.addClass(this._ghost, 'oui-col-reorder-ghost');
    // Full column size: same width as source header, height clipped to visible table area.
    this._renderer.setStyle(this._ghost, 'width', `${cellRect.width}px`);
    this._renderer.setStyle(
      this._ghost,
      'height',
      `${bounds.bottom - bounds.top}px`
    );
    // Start at source column, top of visible table area.
    this._renderer.setStyle(
      this._ghost,
      'transform',
      `translate(${cellRect.left}px, ${bounds.top}px)`
    );
    this._renderer.appendChild(document.body, this._ghost);
  }

  private _destroyGhost(): void {
    if (this._ghost) {
      this._ghost.remove();
      this._ghost = null;
    }
  }

  // ─── Drop indicator ───────────────────────────────────────────────────────────

  private _createDropIndicator(): void {
    this._dropIndicator = this._renderer.createElement('div') as HTMLElement;
    this._renderer.addClass(this._dropIndicator, 'oui-col-reorder-indicator');
    this._renderer.appendChild(document.body, this._dropIndicator);
  }

  /**
   * Position the drop indicator at the insertion slot boundary.
   * The slot index points BEFORE a column, so we use the left edge of
   * that column — or the right edge of the last column for the end slot.
   */
  private _positionDropIndicator(slot: number, visible: boolean): void {
    if (!this._dropIndicator) {
      return;
    }
    // Hide when cursor is outside the table header area, or when the
    // insertion slot equals the source (no-op drop).
    const isNoOp = slot === this._sourceIndex || slot === this._sourceIndex + 1;
    if (!visible || isNoOp) {
      this._renderer.setStyle(this._dropIndicator, 'display', 'none');
      return;
    }
    this._renderer.setStyle(this._dropIndicator, 'display', '');

    const tableRect = this._elementRef.nativeElement.getBoundingClientRect();
    const bounds = this._getVisibleBounds(tableRect);
    const indicatorWidth = 2;

    let rawX: number;
    if (slot >= this._headerCells.length) {
      // Insert at the very end — use right edge of last column.
      const lastCell = this._headerCells[this._headerCells.length - 1];
      rawX = lastCell.getBoundingClientRect().right;
    } else {
      // Insert before column at `slot` — use its left edge.
      rawX = this._headerCells[slot].getBoundingClientRect().left;
    }

    const xPos = Math.max(
      bounds.left,
      Math.min(rawX, bounds.right - indicatorWidth)
    );

    this._renderer.setStyle(
      this._dropIndicator,
      'transform',
      `translate(${xPos}px, ${bounds.top}px)`
    );
    this._renderer.setStyle(
      this._dropIndicator,
      'height',
      `${bounds.bottom - bounds.top}px`
    );
  }

  private _destroyDropIndicator(): void {
    if (this._dropIndicator) {
      this._renderer.removeChild(document.body, this._dropIndicator);
      this._dropIndicator = null;
    }
  }

  // ─── Column highlight helpers ─────────────────────────────────────────────────────────────────

  /** Add or remove a CSS class on every cell (header + body) in the given column. */
  private _applyColumnClass(columnId: string, cls: string, add: boolean): void {
    if (!columnId) {
      return;
    }
    this._elementRef.nativeElement
      .querySelectorAll<HTMLElement>(`.cdk-column-${columnId}`)
      .forEach((cell) =>
        add
          ? this._renderer.addClass(cell, cls)
          : this._renderer.removeClass(cell, cls)
      );
  }

  /** Remove all drag-related highlight classes from the table. */
  private _clearAllHighlights(): void {
    // Clear via tracked state (fast path).
    if (this._highlightedTargetColumnId) {
      this._applyColumnClass(
        this._highlightedTargetColumnId,
        'oui-col-reorder-target',
        false
      );
      this._highlightedTargetColumnId = '';
    }
    // Source highlight is only on the header cell.
    if (this._sourceIndex >= 0 && this._headerCells[this._sourceIndex]) {
      this._headerCells[this._sourceIndex].classList.remove(
        'oui-col-reorder-source'
      );
    }

    // Safety-net: sweep the ENTIRE table for any stale highlight classes.
    // Use direct classList instead of Renderer2 to guarantee synchronous removal.
    this._elementRef.nativeElement
      .querySelectorAll('.oui-col-reorder-source, .oui-col-reorder-target')
      .forEach((el: Element) => {
        el.classList.remove('oui-col-reorder-source');
        el.classList.remove('oui-col-reorder-target');
      });

    // Also sweep document.body for any ghost/indicator elements that may have leaked.
    document
      .querySelectorAll('.oui-col-reorder-ghost, .oui-col-reorder-indicator')
      .forEach((el) => el.remove());
    this._ghost = null;
    this._dropIndicator = null;
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────────────────────

  // ─── Overflow detection ──────────────────────────────────────────────────────

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

  ngOnDestroy(): void {
    this._detachCellListeners();
    this._clearAllHighlights();
    this._cleanupDragListeners();
    this._mutationObserver?.disconnect();
    this._overflowObserver?.disconnect();
    this._overflowObserver = null;
    this._destroyGhost();
    this._destroyDropIndicator();
  }
}
