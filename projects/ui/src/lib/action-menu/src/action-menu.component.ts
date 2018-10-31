import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Input,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { ActionMenuConfig, DefaultPositionConfig } from './action-menu-config';

@Component({
  selector: 'once-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  dropdownVisible = false;
  timeOutEvent = null;
  @Input()
  items: ActionMenuConfig[];
  @Input()
  dotsMenuTooltip: string;
  @Input()
  actionItem: any;
  @Input()
  isVertical = false;
  @Input()
  defaultPosition: string;
  @ViewChild('container')
  container: ElementRef;
  @ViewChild('target')
  target: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('document:click')
  documentClick() {
    this.clickOutsideDropdown();
  }

  ngOnInit() {
    this.defaultPosition = this.defaultPosition
      ? this.defaultPosition
      : this.isVertical
        ? DefaultPositionConfig.left_bottom
        : DefaultPositionConfig.right_bottom;
  }

  ngAfterViewChecked() {
    if (this.container) {
      this.isVertical
        ? this.verticalPosition(
            this.container.nativeElement,
            this.target.nativeElement
          )
        : this.horizontalPosition(
            this.container.nativeElement,
            this.target.nativeElement
          );
    }
  }

  private horizontalPosition(element, target) {
    let right, left, top, bottom;
    const elementOuterWidth = element.offsetWidth;
    const elementOuterHeight = element.clientHeight;
    const targetOffset = target.getBoundingClientRect();
    const viewport = this.getViewport();
    right = targetOffset.left + 'px';
    left = targetOffset.right - elementOuterWidth + 'px';
    top = targetOffset.bottom - viewport.top + 'px';
    bottom = viewport.height - targetOffset.top + viewport.top + 'px';

    switch (this.defaultPosition) {
      case DefaultPositionConfig.left_bottom:
        this.showLeft(targetOffset, elementOuterWidth, element, left, right);
        this.showBottom(
          targetOffset,
          elementOuterHeight,
          viewport,
          element,
          bottom,
          top
        );
        break;
      case DefaultPositionConfig.left_top:
        this.showLeft(targetOffset, elementOuterWidth, element, left, right);
        this.showTop(targetOffset, elementOuterHeight, element, bottom, top);
        break;
      case DefaultPositionConfig.right_bottom:
        this.showRight(
          targetOffset,
          elementOuterWidth,
          viewport,
          element,
          left,
          right
        );
        this.showBottom(
          targetOffset,
          elementOuterHeight,
          viewport,
          element,
          bottom,
          top
        );
        break;
      case DefaultPositionConfig.right_top:
        this.showRight(
          targetOffset,
          elementOuterWidth,
          viewport,
          element,
          left,
          right
        );
        this.showTop(targetOffset, elementOuterHeight, element, bottom, top);
        break;
    }
  }

  private verticalPosition(element, target) {
    let right, left, top, bottom;
    const elementOuterWidth = element.offsetWidth;
    const elementOuterHeight = element.clientHeight;
    const targetOffset = target.getBoundingClientRect();
    const viewport = this.getViewport();
    right = targetOffset.right + 'px';
    left = targetOffset.left - elementOuterWidth + 'px';
    top = targetOffset.top - viewport.top + 'px';
    bottom = viewport.height - targetOffset.bottom + viewport.top + 'px';

    switch (this.defaultPosition) {
      case DefaultPositionConfig.left_bottom:
        this.showLeft(targetOffset, elementOuterWidth, element, left, right);
        this.showBottom(
          targetOffset,
          elementOuterHeight,
          viewport,
          element,
          bottom,
          top
        );
        break;
      case DefaultPositionConfig.left_top:
        this.showLeft(targetOffset, elementOuterWidth, element, left, right);
        this.showTop(targetOffset, elementOuterHeight, element, bottom, top);
        break;
      case DefaultPositionConfig.right_bottom:
        this.showRight(
          targetOffset,
          elementOuterWidth,
          viewport,
          element,
          left,
          right
        );
        this.showBottom(
          targetOffset,
          elementOuterHeight,
          viewport,
          element,
          bottom,
          top
        );
        break;
      case DefaultPositionConfig.right_top:
        this.showRight(
          targetOffset,
          elementOuterWidth,
          viewport,
          element,
          left,
          right
        );
        this.showTop(targetOffset, elementOuterHeight, element, bottom, top);
        break;
    }
  }

  private showLeft(targetOffset, elementOuterWidth, element, left, right) {
    const cannotShowOnLeft = this.isVertical
      ? targetOffset.left - elementOuterWidth < 0
      : targetOffset.right - elementOuterWidth < 0;
    if (cannotShowOnLeft) {
      this.showOnRight(element, right);
    } else {
      this.showOnLeft(element, left);
    }
  }

  private showRight(
    targetOffset,
    elementOuterWidth,
    viewport,
    element,
    left,
    right
  ) {
    if (
      targetOffset.left + targetOffset.width + elementOuterWidth >
      viewport.width
    ) {
      this.showOnLeft(element, left);
    } else {
      this.showOnRight(element, right);
    }
  }

  private showBottom(
    targetOffset,
    elementOuterHeight,
    viewport,
    element,
    bottom,
    top
  ) {
    if (targetOffset.top + elementOuterHeight > viewport.height) {
      this.showOnTop(element, bottom);
    } else {
      this.showOnBottom(element, top);
    }
  }

  private showTop(targetOffset, elementOuterHeight, element, bottom, top) {
    if (targetOffset.bottom - elementOuterHeight < 0) {
      this.showOnBottom(element, top);
    } else {
      this.showOnTop(element, bottom);
    }
  }

  private showOnTop(element, bottom) {
    element.style.bottom = bottom;
  }

  private showOnBottom(element, top) {
    element.style.top = top;
  }

  private showOnLeft(element, left) {
    element.style.left = left;
  }

  private showOnRight(element, right) {
    element.style.left = right;
  }

  private getViewport(): any {
    const win = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      w = win.innerWidth || e.clientWidth || g.clientWidth,
      h = win.innerHeight || e.clientHeight || g.clientHeight,
      l = win.screenLeft - win.scrollX,
      t = win.screenTop - win.scrollY;

    return { width: w, height: h, left: l, top: t };
  }

  onMouseClick(event) {
    event.stopPropagation();
    if (this.dropdownVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  onItemClick(event) {
    this.hide();
    event.stopPropagation();
  }

  show() {
    this.dropdownVisible = true;
  }

  hide() {
    this.dropdownVisible = false;
  }

  clickOutsideDropdown() {
    if (this.dropdownVisible) {
      this.hide();
    }
  }

  actionMenuMouseenter() {
    clearTimeout(this.timeOutEvent);
    this.timeOutEvent = null;
    this.show();
    this.cdr.detectChanges();
  }

  actionMenuMouseleave() {
    this.timeOutEvent = setTimeout(() => {
      this.hide();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    this.hide();
  }
}
