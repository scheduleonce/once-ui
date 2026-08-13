import {
  AfterViewInit,
  Directive,
  inject,
  OnDestroy,
  ProviderToken,
} from '@angular/core';
import { OuiReorderableColumnsDirective } from './oui-column-reorder.directive';

/**
 * Internal view of the OUI reorderable-columns directive we need to patch.
 * These fields are private in the library, so we access them via a typed cast
 * rather than spreading `any` through the whole function.
 */
interface ReorderDirectiveInternals {
  _ohScrollPatched?: boolean;
  _onPointerMove: (e: PointerEvent) => void;
  _scrollLoop: () => void;
  _dragging: boolean;
  _scrollContainer: HTMLElement | null;
  _scrollWanted: boolean;
  _headerCells: HTMLElement[];
  _lastClientX: number;
  _lastClientY: number;
  _scrollZoneSize: number;
  _scrollMaxSpeed: number;
  _insertionSlot: number;
  _scrollRafId: number;
  _getScrollContainer: () => HTMLElement | null;
  _getInsertionSlot: (clientX: number) => number;
  _isCursorOverHeaderCell: (clientX: number, clientY: number) => boolean;
  _positionDropIndicator: (slot: number, visible: boolean) => void;
  _startAutoScroll: () => void;
  _stopAutoScroll: () => void;
}

/**
 * Adjusts the auto-scroll behaviour of `ouiReorderableColumns` so that leftward
 * scrolling starts as soon as the dragged header touches the **first (fixed)
 * column** instead of waiting until the cursor reaches the container's left edge.
 *
 * Apply this directive on the same `<table>` element that has `ouiReorderableColumns`:
 *
 * ```html
 * <table oui-table ouiReorderableColumns ouiReorderableAutoScroll ...>
 * ```
 */
@Directive({
  selector: '[ouiReorderableAutoScroll]',
  standalone: false,
})
export class OuiReorderableAutoScrollDirective
  implements AfterViewInit, OnDestroy
{
  private readonly reorder = inject(
    OuiReorderableColumnsDirective as ProviderToken<OuiReorderableColumnsDirective>
  );

  private originalOnPointerMove: ((e: PointerEvent) => void) | null = null;
  private originalScrollLoop: (() => void) | null = null;

  ngAfterViewInit(): void {
    this.applyPatch();
  }

  ngOnDestroy(): void {
    this.removePatch();
  }

  private applyPatch(): void {
    const directive = this.reorder as unknown as ReorderDirectiveInternals;

    if (!directive || directive._ohScrollPatched) {
      return;
    }
    directive._ohScrollPatched = true;

    this.originalOnPointerMove = directive._onPointerMove.bind(directive);
    directive._onPointerMove = (e: PointerEvent) => {
      this.originalOnPointerMove!(e);

      if (!directive._dragging) {
        return;
      }

      this.updateScrollState(directive, e);
    };

    this.originalScrollLoop = directive._scrollLoop.bind(directive);
    directive._scrollLoop = () => {
      if (
        !directive._dragging ||
        !directive._scrollContainer ||
        !directive._scrollWanted
      ) {
        directive._stopAutoScroll();
        return;
      }

      const container = directive._scrollContainer;
      const rect = container.getBoundingClientRect();
      const firstHeader = directive._headerCells[0];
      const firstColRight = firstHeader
        ? firstHeader.getBoundingClientRect().right
        : rect.left;

      const distRight = rect.right - directive._lastClientX;
      const zoneSize = directive._scrollZoneSize;
      const maxSpeed = directive._scrollMaxSpeed;
      let scrollDelta = 0;

      // Left zone: scroll as soon as the cursor is anywhere over or to the
      // left of the first (fixed/sticky) column.  Speed increases the further
      // left the cursor is, up to maxSpeed.
      if (directive._lastClientX < firstColRight && container.scrollLeft > 0) {
        const dist = firstColRight - directive._lastClientX;
        const factor = Math.min(dist / zoneSize, 1);
        scrollDelta = -Math.round(factor * maxSpeed);
      } else if (
        distRight >= 0 &&
        distRight < zoneSize &&
        container.scrollLeft < container.scrollWidth - rect.width
      ) {
        const factor = 1 - distRight / zoneSize;
        scrollDelta = Math.round(factor * maxSpeed);
      }

      if (scrollDelta !== 0) {
        container.scrollLeft += scrollDelta;
      }

      directive._insertionSlot = directive._getInsertionSlot(
        directive._lastClientX
      );
      const isOverTable = directive._isCursorOverHeaderCell(
        directive._lastClientX,
        directive._lastClientY
      );
      directive._positionDropIndicator(directive._insertionSlot, isOverTable);

      directive._scrollRafId = requestAnimationFrame(directive._scrollLoop);
    };
  }

  private updateScrollState(
    directive: ReorderDirectiveInternals,
    e: PointerEvent
  ): void {
    const container =
      directive._scrollContainer ?? directive._getScrollContainer();

    if (!container) {
      directive._scrollWanted = false;
      directive._stopAutoScroll();
      return;
    }

    const rect = container.getBoundingClientRect();
    const firstHeader = directive._headerCells[0];
    const firstColRight = firstHeader
      ? firstHeader.getBoundingClientRect().right
      : rect.left;

    const distRight = rect.right - e.clientX;
    const zoneSize = directive._scrollZoneSize;

    // Left zone: activate as soon as the cursor is anywhere over or to the
    // left of the first (fixed/sticky) column.
    const nearLeft = e.clientX < firstColRight;
    const nearRight =
      distRight >= 0 &&
      distRight < zoneSize &&
      container.scrollLeft < container.scrollWidth - rect.width;

    if (nearLeft || nearRight) {
      directive._scrollContainer = container;
      directive._scrollWanted = true;
      directive._startAutoScroll();
    }
    // Don't set _scrollWanted = false here — the original _onPointerMove
    // already handles that when the cursor leaves the container's edge zone.
    // If we set it to false, we'd cancel the scroll that the original just
    // started for the container's left-edge zone (which is different from
    // the first-column-right-edge zone that this patch uses).
  }

  private removePatch(): void {
    const directive = this.reorder as unknown as ReorderDirectiveInternals;

    if (!directive?._ohScrollPatched) {
      return;
    }

    if (this.originalOnPointerMove) {
      directive._onPointerMove = this.originalOnPointerMove;
    }

    if (this.originalScrollLoop) {
      directive._scrollLoop = this.originalScrollLoop;
    }

    delete directive._ohScrollPatched;
  }
}
