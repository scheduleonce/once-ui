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
  private _currentTargetIndex = -1;
  private _startX = 0;
  private _startY = 0;
  /** Offset from cursor to cell left edge at pointerdown — keeps ghost pinned under cursor horizontally. */
  private _cursorOffsetX = 0;
  /** Offset from cursor to cell top edge at pointerdown — keeps ghost pinned under cursor vertically. */
  private _cursorOffsetY = 0;
  private _columnIds: string[] = [];
  /** CDK column ID of the currently highlighted target column. */
  private _highlightedTargetColumnId = '';
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
          // Skip resize handle and ⋮ menu trigger — those have their own handlers.
          const target = e.target as HTMLElement;
          if (
            target.classList.contains('oui-col-resize-handle') ||
            target.classList.contains('oui-column-menu-trigger')
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
    this._currentTargetIndex = cellIndex;
    this._startX = e.clientX;
    this._startY = e.clientY;

    // Capture cursor offset within the cell so the ghost stays pinned where the user grabbed.
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

    // Ghost follows the cursor freely in both X and Y (Jira-like floating chip).
    if (this._ghost) {
      const ghostX = e.clientX - this._cursorOffsetX;
      const ghostY = e.clientY - this._cursorOffsetY;
      this._renderer.setStyle(
        this._ghost,
        'transform',
        `translate(${ghostX}px, ${ghostY}px)`
      );
    }

    this._currentTargetIndex = this._getTargetIndex(e.clientX);
    this._positionDropIndicator(this._currentTargetIndex, e.clientX);
    this._updateTargetHighlight(this._currentTargetIndex, e.clientX, e.clientY);
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

    const prev = this._sourceIndex;
    const curr = this._currentTargetIndex;

    // Only reorder if cursor is directly over a different header cell.
    const validDrop =
      prev !== curr && this._isCursorOverHeaderCell(_e.clientX, _e.clientY);

    if (validDrop) {
      const newOrder = [...this._columnIds];
      const [moved] = newOrder.splice(prev, 1);
      newOrder.splice(curr, 0, moved);

      this._ngZone.run(() => {
        this.columnOrderChanged.emit({
          previousIndex: prev,
          currentIndex: curr,
          columnIds: newOrder,
        });
      });
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

  private _getTargetIndex(clientX: number): number {
    let best = this._sourceIndex;
    let bestDist = Infinity;
    this._headerCells.forEach((cell, idx) => {
      // First column is locked — never allow dropping onto it.
      if (idx === 0) {
        return;
      }
      const rect = cell.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = idx;
      }
    });
    return best;
  }

  // ─── Ghost ────────────────────────────────────────────────────────────────────

  private _createGhost(): void {
    const source = this._headerCells[this._sourceIndex];
    const cellRect = source.getBoundingClientRect();
    const tableRect = this._elementRef.nativeElement.getBoundingClientRect();

    this._ghost = this._renderer.createElement('div') as HTMLElement;
    this._renderer.addClass(this._ghost, 'oui-col-reorder-ghost');
    // Full column size: same width as source header, full table height.
    this._renderer.setStyle(this._ghost, 'width', `${cellRect.width}px`);
    this._renderer.setStyle(this._ghost, 'height', `${tableRect.height}px`);
    // Start at source column, top of table.
    this._renderer.setStyle(
      this._ghost,
      'transform',
      `translate(${cellRect.left}px, ${tableRect.top}px)`
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

  private _positionDropIndicator(targetIndex: number, clientX: number): void {
    if (!this._dropIndicator) {
      return;
    }
    const targetCell = this._headerCells[targetIndex];
    if (!targetCell) {
      return;
    }
    const rect = targetCell.getBoundingClientRect();
    const tableRect = this._elementRef.nativeElement.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    const xPos = clientX < mid ? rect.left : rect.right;

    this._renderer.setStyle(
      this._dropIndicator,
      'transform',
      `translate(${xPos}px, ${tableRect.top}px)`
    );
    this._renderer.setStyle(
      this._dropIndicator,
      'height',
      `${tableRect.height}px`
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

  /** Update which target column is highlighted as the pointer moves. */
  private _updateTargetHighlight(
    targetIndex: number,
    clientX: number,
    clientY: number
  ): void {
    const isOverHeader = this._isCursorOverHeaderCell(clientX, clientY);
    const targetCell = targetIndex >= 0 ? this._headerCells[targetIndex] : null;
    const targetId =
      isOverHeader && targetCell ? this._getColumnId(targetCell) : '';
    const sourceId =
      this._sourceIndex >= 0 ? this._columnIds[this._sourceIndex] : '';

    if (targetId === this._highlightedTargetColumnId) {
      return;
    }

    // Clear previous target highlight.
    if (this._highlightedTargetColumnId) {
      this._applyColumnClass(
        this._highlightedTargetColumnId,
        'oui-col-reorder-target',
        false
      );
    }

    // Apply new target highlight, unless it is the source column itself or cursor is not over header.
    if (targetId && targetId !== sourceId) {
      this._applyColumnClass(targetId, 'oui-col-reorder-target', true);
      this._highlightedTargetColumnId = targetId;
    } else {
      this._highlightedTargetColumnId = '';
    }
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
