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
   * Minimum column width in pixels. Defaults to 0 (natural min-content width is the floor).
   * Consumers can pass a specific value to prevent columns from becoming too narrow.
   */
  @Input() minColumnWidth = 0;

  /** Emitted when the user finishes resizing a column. */
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
  private _mutationObserver: MutationObserver | null = null;
  private _reinitScheduled = false;
  /** Listeners returned by Renderer2.listen for each handle's pointerdown. */
  private _handleUnlisteners: (() => void)[] = [];
  /** Whether initial column widths have already been snapshotted. */
  private _initialised = false;

  // ─── ResizeObserver to detect table overflow and toggle shadow class ─────────
  private _overflowObserver: ResizeObserver | null = null;

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

    if (isNativeTable) {
      this._renderer.setStyle(host, 'table-layout', 'fixed');
      // Use min-width so the table fills its container but can overflow
      // when columns are resized to exceed the container width.
      this._renderer.setStyle(host, 'min-width', '100%');
      this._renderer.setStyle(host, 'width', 'auto');
    }

    // Snapshot current rendered widths of every column so they are pinned
    // before any user interaction. This prevents the browser from re-flowing
    // columns when one column is resized.
    const headerCells = Array.from(
      host.querySelectorAll<HTMLElement>('oui-header-cell, th[oui-header-cell]')
    );
    headerCells.forEach((cell) => {
      const columnId = this._getColumnId(cell);
      if (columnId && !this._columnWidths.has(columnId)) {
        const width = cell.getBoundingClientRect().width;
        const cells = this._getColumnCells(columnId);
        this._applyWidthToCells(width, cells);
        this._columnWidths.set(columnId, width);
      }
    });
    // Set an explicit pixel width on the table equal to the sum of all
    // snapshotted column widths so further resizes that grow beyond the
    // container can set the table wider than the container.
    this._syncNativeTableWidth();
  }

  /**
   * Watch the table host for any child-list changes in the subtree.
   * We observe `host` (not the header row) because CDK may destroy and
   * recreate the entire `<oui-header-row>` when `displayedColumns` changes,
   * which would leave an observer on a detached element.
   *
   * To prevent infinite loops (our own handle additions trigger subtree
   * mutations), we disconnect before reinit and reconnect after.
   */
  private _watchHeaderRow(): void {
    const host = this._elementRef.nativeElement;
    this._mutationObserver = new MutationObserver(() => {
      if (this._reinitScheduled) {
        return;
      }
      this._reinitScheduled = true;
      this._mutationObserver?.disconnect();
      setTimeout(() => {
        this._reinitScheduled = false;
        this._reinitHandles();
        // Reconnect after handles are added.
        this._mutationObserver?.observe(host, {
          childList: true,
          subtree: true,
        });
      }, 0);
    });
    this._mutationObserver.observe(host, { childList: true, subtree: true });
  }

  /** Called when CDK re-stamps header cells; re-appends handles and restores widths. */
  private _reinitHandles(): void {
    // Remove stale handles that may survive on reused cells.
    this._handles.forEach((h) => h.remove());
    this._handles = [];
    // Detach old pointerdown listeners.
    this._handleUnlisteners.forEach((fn) => fn());
    this._handleUnlisteners = [];
    this._initHandles();
    this._reapplyStoredWidths();
  }

  /** Re-applies every previously-set column width to freshly-rendered cells. */
  private _reapplyStoredWidths(): void {
    this._columnWidths.forEach((width, columnId) => {
      const cells = this._getColumnCells(columnId);
      this._applyWidthToCells(width, cells);
    });
    // Restore the table's explicit width so it matches the stored column widths.
    this._syncNativeTableWidth();
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

    // Clamp to at least minColumnWidth input (if provided) so both constraints apply.
    // The padding already includes the 40px reserved for the menu button.
    this._minCellWidth = Math.max(this.minColumnWidth, contentWidth + padding);
    this._columnId = this._getColumnId(headerCell);
    this._columnCells = this._getColumnCells(this._columnId);

    handle.setPointerCapture(e.pointerId);

    // Mark only this handle as active (not the whole table — avoids coloring all handles).
    this._activeHandle = handle;
    this._renderer.addClass(handle, 'oui-col-resize-handle--active');

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

    // For native <table> elements, grow (or shrink) the table's explicit width
    // to match the new sum of all column widths. Without this the browser
    // re-distributes all columns within the fixed container width, making it
    // impossible to resize beyond the container boundary.
    this._syncNativeTableWidth(this._columnId, newWidth);

    this._applyWidth(newWidth);
  }

  private _onPointerUp(_e: PointerEvent): void {
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
    // Keep the table's explicit width in sync with the final column widths.
    this._syncNativeTableWidth();

    // Emit inside zone so Angular can run change detection if needed.
    this._ngZone.run(() => {
      this.columnResized.emit({ columnId: this._columnId, width: finalWidth });
    });
  }

  private _cancelResize(): void {
    if (!this._isDragging) {
      return;
    }
    this._isDragging = false;
    this._cleanupDragListeners();
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
   * For native `<table>` elements, sets the table's inline `width` to the
   * sum of all column widths so the table can overflow its container and
   * the scroll container shows a horizontal scrollbar.
   *
   * Pass `overrideColumnId` + `overrideWidth` to preview a width that
   * hasn't been committed to `_columnWidths` yet (e.g. during a live drag).
   * Without arguments the stored widths are summed as-is.
   *
   * Has no effect on non-native (CDK/flex) tables.
   */
  private _syncNativeTableWidth(
    overrideColumnId?: string,
    overrideWidth?: number
  ): void {
    const host = this._elementRef.nativeElement;
    if (host.tagName !== 'TABLE') {
      return;
    }
    let total = 0;
    this._columnWidths.forEach((w, id) => {
      total +=
        id === overrideColumnId && overrideWidth !== undefined
          ? overrideWidth
          : w;
    });
    // If overrideColumnId is being dragged but not yet in the map (edge case
    // during very first move), add overrideWidth once.
    if (
      overrideColumnId !== undefined &&
      overrideWidth !== undefined &&
      !this._columnWidths.has(overrideColumnId)
    ) {
      total += overrideWidth;
    }
    if (total > 0) {
      // Use max so the table stays at least as wide as its container.
      const containerWidth = host.parentElement
        ? host.parentElement.clientWidth
        : 0;
      const tableWidth = Math.max(total, containerWidth);
      this._renderer.setStyle(host, 'width', `${tableWidth}px`);
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
    this._cleanupDragListeners();
    this._handleUnlisteners.forEach((fn) => fn());
    this._handles.forEach((h) => h.remove());
    this._handles = [];
    this._mutationObserver?.disconnect();
    this._overflowObserver?.disconnect();
    this._overflowObserver = null;
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
