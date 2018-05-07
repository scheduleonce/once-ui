/** Component for tool-tip */
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Renderer2,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Interface for tool-tip
 */
@Component({
  selector: 'app-info-bubble-tool-tip',
  templateUrl: 'info-bubble-tool-tip.component.html',
  styleUrls: ['info-bubble-tool-tip.component.scss'],
  encapsulation: ViewEncapsulation.None
})

/**
 * ToolTipComponent for init. localization editor
 */
export class InfoToolTipComponent implements OnInit {
  @Input() htmll: any;
  @ViewChild('toolTipOuterPane') oneChild: any;
  windowWidth = 0;
  insideDiv = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document
  ) {}

  ngOnInit() {}

  /**
   * Fired on mouse movement in/out
   * of tool-tip
   * @param isTimeOut
   */
  fireEvent(isTimeOut) {
    const self = this;
    this.windowWidth = window.innerWidth;
    if (isTimeOut) {
      setTimeout(function() {
        if (!self.insideDiv) {
          self.oneChild.nativeElement.innerHTML = '';
        }
      }, 200);
    } else {
      if (
        this.oneChild.nativeElement &&
        !this.oneChild.nativeElement.children.length
      ) {
        const child = this.document.createElement('div');
        let t: any;
        this.renderer.appendChild(this.oneChild.nativeElement, child);
        child.setAttribute('class', 'tooltipDivBig in right');
        child.innerHTML = this.htmll;
        child.addEventListener(
          'mouseenter',
          this.mouseEnterCallback.bind(this)
        );
        child.addEventListener(
          'mouseleave',
          this.mouselLeaveCallback.bind(this)
        );
        t = this.oneChild.nativeElement.getBoundingClientRect();
        const toolTipLeftOffset = t.left + child.offsetWidth + 40;
        if (window.innerWidth < toolTipLeftOffset) {
          child.setAttribute('class', 'tooltipDivBig in left');
        }
      }
    }
  }

  /**
   * Mouse enter event to make
   * tool-tip visible onhover
   */
  mouseEnterCallback() {
    this.insideDiv = true;
  }

  /**
   * hide tool-tip on mouse leave
   */
  mouselLeaveCallback() {
    this.insideDiv = false;
  }
}
