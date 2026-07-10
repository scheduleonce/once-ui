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
  Renderer2,
  RendererStyleFlags2,
} from '@angular/core';
import { ColumnResizeEvent } from './oui-column-resize.directive';

/**
 * Makes a single table header cell resizable by dragging its right edge.
 *
 * This directive is intentionally scoped to exactly ONE column: it only ever
 * reads/writes the width of the cells that belong to its own column (the
 * header cell it's attached to, plus every body cell sharing the same
 * `cdk-column-<id>` class within the closest ancestor `<table>`). It never
 * inspects or mutates any other column's state, and it holds no cross-column
 * bookkeeping (no shared width map, no MutationObserver watching the whole
 * table for column add/remove/reorder).
 *
 * This is the key difference from `OuiResizableColumnsDirective` (table-wide
 * `ouiResizableColumns`), which has to track every column's width centrally
 * and reconcile that state whenever columns are added, removed, or
 * reordered — the source of most of the flakiness this directive avoids.
 * Because each column instance manages only itself, and Angular
 * creates/destroys one directive instance per header cell as columns come
 * and go (`*ouiHeaderCellDef`), adding or removing sibling columns (e.g. via
 * a column-visibility picker) has zero effect on this directive; there is
 * nothing to reconcile.
 *
 * Usage — add directly to the header cell for a column:
 * ```html
 * <th
 *   oui-header-cell
 *   ouiResizableColumn
 *   [columnId]="col.key"
 *   [minWidth]="140"
 *   [width]="columnWidths[col.key]"
 *   (columnResized)="onColumnResized($event)"
 * >
 * ```
 */
@Directive({
  selector:
    'th[oui-header-cell][ouiResizableColumn], oui-header-cell[ouiResizableColumn]',
  standalone: false,
})
export class OuiResizableColumnDirective implements AfterViewInit, OnDestroy {
  /**
   * CDK column id for this header cell. Optional — when omitted it is
   * auto-detected from the host's `cdk-column-<id>` class.
   */
  @Input() columnId = '';

  /** Minimum width (px) this column can be resized to. */
  @Input() minWidth = 100;

  /**
   * Initial width (px) to apply once, when the handle is first created —
   * e.g. a previously persisted width restored after a page refresh. Ignored
   * (falls back to the column's natural/CSS width) when omitted or <= 0.
   */
  @Input() width?: number;

  /** Emitted once the user releases the pointer after actually resizing this column. */
  @Output() columnResized = new EventEmitter<ColumnResizeEvent>();

  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _ngZone = inject(NgZone);

  private _handle: HTMLElement | null = null;
  private _handlePointerDownUnlisten: (() => void) | null = null;
  private _moveUnlisten: (() => void) | null = null;
  private _upUnlisten: (() => void) | null = null;
  private _cancelUnlisten: (() => void) | null = null;

  private _isDragging = false;
  /** True once the pointer has actually moved during the current drag (delta > 2px). */
  private _hasMoved = false;
  private _startX = 0;
  private _startWidth = 0;
  /** Minimum width the column may reach (content + padding, measured at drag-start). */
  private _minCellWidth = 0;
  /** Header + body cells belonging to this column (scoped to the closest ancestor table). */
  private _columnCells: HTMLElement[] = [];

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this._createHandle();
    });
  }

  ngOnDestroy(): void {
    this._removeDragListeners();
    this._handlePointerDownUnlisten?.();
    this._handle?.remove();
    this._handle = null;
  }

  private _createHandle(): void {
    const host = this._elementRef.nativeElement;
    if (!this.columnId) {
      this.columnId = this._detectColumnId(host);
    }

    this._renderer.setStyle(host, 'position', 'relative');
    this._renderer.setStyle(host, 'overflow', 'visible');

    // Restore a previously persisted width, if one was provided.
    if (this.width && this.width > 0) {
      const table = host.closest('table');
      if (table) {
        this._renderer.setStyle(
          table,
          'table-layout',
          'fixed',
          RendererStyleFlags2.Important
        );
      }
      this._setCellsWidth(this.width, this._getColumnCells(host));
    }

    const handle = this._renderer.createElement('div') as HTMLElement;
    this._renderer.addClass(handle, 'oui-col-resize-handle');
    this._renderer.setAttribute(handle, 'aria-hidden', 'true');
    this._renderer.setStyle(handle, 'touch-action', 'none');
    this._renderer.setStyle(handle, 'cursor', 'col-resize');
    this._renderer.appendChild(host, handle);
    this._handle = handle;

    this._handlePointerDownUnlisten = this._renderer.listen(
      handle,
      'pointerdown',
      (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this._onPointerDown(e, host, handle);
      }
    );
  }

  private _detectColumnId(cell: HTMLElement): string {
    const colClass = Array.from(cell.classList).find((c) =>
      c.startsWith('cdk-column-')
    );
    return colClass ? colClass.replace('cdk-column-', '') : '';
  }

  private _getColumnCells(host: HTMLElement): HTMLElement[] {
    if (!this.columnId) {
      return [host];
    }
    const table = host.closest('table');
    const scope: ParentNode = table ?? host.ownerDocument;
    return Array.from(
      scope.querySelectorAll<HTMLElement>(`.cdk-column-${this.columnId}`)
    );
  }

  private _onPointerDown(
    e: PointerEvent,
    host: HTMLElement,
    handle: HTMLElement
  ): void {
    this._isDragging = true;
    this._hasMoved = false;
    this._startX = e.clientX;
    this._startWidth = host.getBoundingClientRect().width;
    this._columnCells = this._getColumnCells(host);

    // Fixed layout keeps pixel widths from being fought by the browser's
    // auto-layout algorithm. Idempotent — harmless to set on every drag.
    const table = host.closest('table');
    if (table) {
      this._renderer.setStyle(
        table,
        'table-layout',
        'fixed',
        RendererStyleFlags2.Important
      );
    }

    // scrollWidth/measured content width sets the true floor so text is
    // never clipped, even when that's bigger than `minWidth`.
    let contentWidth = 0;
    Array.from(host.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node !== handle) {
        contentWidth += node.scrollWidth;
      } else if (node.nodeType === Node.TEXT_NODE) {
        const range = host.ownerDocument.createRange();
        range.selectNodeContents(node);
        contentWidth += range.getBoundingClientRect().width;
      }
    });
    const style = globalThis.getComputedStyle(host);
    const padding =
      Number.parseFloat(style.paddingLeft) +
      Number.parseFloat(style.paddingRight);
    this._minCellWidth = Math.max(this.minWidth, contentWidth + padding);

    try {
      handle.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture can fail in browsers without full support; drag still
      // works because listeners are attached directly to the handle.
    }

    this._renderer.addClass(handle, 'oui-col-resize-handle--active');
    this._renderer.addClass(host.ownerDocument.body, 'oui-table-resize-cursor');
    this._columnCells.forEach((cell) =>
      this._renderer.addClass(cell, 'oui-col-resize-active')
    );

    this._moveUnlisten = this._renderer.listen(
      handle,
      'pointermove',
      (ev: PointerEvent) => this._onPointerMove(ev)
    );
    this._upUnlisten = this._renderer.listen(
      handle,
      'pointerup',
      (ev: PointerEvent) => this._onPointerUp(ev, host)
    );
    this._cancelUnlisten = this._renderer.listen(handle, 'pointercancel', () =>
      this._onPointerCancel(host)
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
    this._applyWidth(newWidth);
  }

  private _onPointerUp(_e: PointerEvent, host: HTMLElement): void {
    if (!this._isDragging) {
      return;
    }
    const hasMoved = this._hasMoved;
    this._isDragging = false;
    this._hasMoved = false;
    this._removeDragListeners();
    this._endDragVisuals(host);

    if (!hasMoved) {
      return;
    }

    // Swallow the click the browser fires right after pointerup so it
    // doesn't land on the sort-header button and trigger an unwanted sort.
    const suppressClick = (ev: MouseEvent) => ev.stopPropagation();
    host.addEventListener('click', suppressClick, {
      capture: true,
      once: true,
    });
    setTimeout(
      () => host.removeEventListener('click', suppressClick, true),
      300
    );

    const finalWidth =
      this._columnCells[0]?.getBoundingClientRect().width ?? this._startWidth;
    this._applyWidth(finalWidth);

    this._ngZone.run(() => {
      this.columnResized.emit({ columnId: this.columnId, width: finalWidth });
    });
  }

  private _onPointerCancel(host: HTMLElement): void {
    if (!this._isDragging) {
      return;
    }
    this._isDragging = false;
    this._hasMoved = false;
    this._removeDragListeners();
    this._endDragVisuals(host);
    // Roll back to the pre-drag width.
    this._applyWidth(this._startWidth);
  }

  private _endDragVisuals(host: HTMLElement): void {
    this._renderer.removeClass(
      host.ownerDocument.body,
      'oui-table-resize-cursor'
    );
    if (this._handle) {
      this._renderer.removeClass(this._handle, 'oui-col-resize-handle--active');
    }
    this._columnCells.forEach((cell) =>
      this._renderer.removeClass(cell, 'oui-col-resize-active')
    );
  }

  private _applyWidth(width: number): void {
    this._setCellsWidth(width, this._columnCells);
  }

  private _setCellsWidth(width: number, cells: HTMLElement[]): void {
    const px = `${width}px`;
    cells.forEach((cell) => {
      this._renderer.setStyle(cell, 'width', px, RendererStyleFlags2.Important);
      this._renderer.setStyle(
        cell,
        'min-width',
        px,
        RendererStyleFlags2.Important
      );
      this._renderer.setStyle(
        cell,
        'max-width',
        px,
        RendererStyleFlags2.Important
      );
      this._renderer.setStyle(cell, 'box-sizing', 'border-box');
    });
  }

  private _removeDragListeners(): void {
    this._moveUnlisten?.();
    this._upUnlisten?.();
    this._cancelUnlisten?.();
    this._moveUnlisten = null;
    this._upUnlisten = null;
    this._cancelUnlisten = null;
  }
}
