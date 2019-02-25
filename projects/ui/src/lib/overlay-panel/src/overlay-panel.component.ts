import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewChecked
} from '@angular/core';

@Component({
  selector: 'once-overlay-panel',
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss']
})
export class OverlayPanelComponent implements OnInit, AfterViewChecked {
  @Input()
  title: string;
  @Input()
  size: 'small' | 'large' = 'small';
  @Input()
  imageLink: string;
  @ViewChild('container')
  container;
  visible = false;
  canClose = true;
  target;
  constructor() {}

  ngOnInit() {
    if (this.imageLink) {
      this.preload(this.imageLink);
    }
  }

  show(event?) {
    if (event) {
      this.target = event.target;
    }
    this.visible = true;
    this.canClose = false;
  }

  hide() {
    this.canClose = true;
    setTimeout(() => {
      if (this.canClose) {
        this.visible = false;
      }
    }, 200);
  }

  ngAfterViewChecked() {
    if (this.container) {
      this.position(this.container.nativeElement, this.target);
    }
  }

  private preload(image) {
    const img = new Image();
    img.src = image;
  }

  private position(element, target) {
    let x, y, top, left;
    const offsetX = 10;
    const offsetY = -13;
    const elementOuterWidth = element.offsetWidth;
    const elementOuterHeight = element.clientHeight;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop = this.getWindowScrollTop();
    const windowScrollLeft = this.getWindowScrollLeft();
    const viewport = this.getViewport();
    x = targetOffset.left + targetOffset.width + windowScrollLeft;
    y = targetOffset.top + windowScrollTop;
    left = x + offsetX;
    top = y + offsetY;
    if (
      targetOffset.left + targetOffset.width + offsetX + elementOuterWidth >
      viewport.width
    ) {
      left = x - offsetX - elementOuterWidth;
      left = left - targetOffset.width;
    }
    if (targetOffset.top + offsetY + elementOuterHeight > viewport.height) {
      top = y - offsetY - elementOuterHeight;
      top = top + targetOffset.height;
    }

    element.style.left = left + 'px';
    element.style.top = top + 'px';
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
  private getWindowScrollTop(): number {
    const doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  private getWindowScrollLeft(): number {
    const doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }
}
