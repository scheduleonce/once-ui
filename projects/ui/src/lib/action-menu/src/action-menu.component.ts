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
import { ActionMenuConfig } from './action-menu-config';

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
  @ViewChild('container')
  container: ElementRef;
  @ViewChild('target')
  target: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('document:click')
  documentClick() {
    this.clickOutsideDropdown();
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    if (this.container) {
      this.position(this.container.nativeElement, this.target.nativeElement);
    }
  }

  private position(element, target) {
    const elementOuterWidth = element.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const viewport = this.getViewport();
    if (
      targetOffset.left + targetOffset.width + elementOuterWidth >
      viewport.width
    ) {
      element.style.right = '0px';
    } else {
      element.style.left = '21px';
    }
  }

  private getViewport(): any {
    const win = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      w = win.innerWidth || e.clientWidth || g.clientWidth,
      h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
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
    }, 500);
  }

  ngOnDestroy() {
    this.hide();
  }
}