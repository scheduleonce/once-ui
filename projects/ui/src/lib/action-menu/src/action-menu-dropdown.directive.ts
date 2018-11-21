import {
  Directive,
  Input,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  HostListener
} from '@angular/core';
import { ActionMenuDropdownComponent } from './action-menu-dropdown/action-menu-dropdown.component';

@Directive({
  selector: '[onceActionMenuDropdown]'
})
export class ActionMenuDropdownDirective {
  private actionMenuDropdown: ComponentRef<ActionMenuDropdownComponent>;
  private visible: boolean;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  @Input()
  items: any;
  @Input()
  isVertical: boolean;
  @Input()
  defaultPosition: string;
  @Input()
  actionItem: any;

  timeOutEvent = null;

  @HostListener('document:click')
  documentClick() {
    this.hideActionMenuDropDown();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.actionMenuDropdown && this.actionMenuDropdown.instance) {
      this.actionMenuDropdown.instance.targetOffset = this.getHostDimensions(
        this.viewContainerRef.element.nativeElement
      );
    }
  }

  @HostListener('click', ['$event'])
  show(event: MouseEvent) {
    event.stopPropagation();
    this.clearMenuTimeOut();
    if (this.visible) {
      this.hideActionMenuDropDown();
      return;
    }

    this.visible = true;
    const factory = this.resolver.resolveComponentFactory(
      ActionMenuDropdownComponent
    );
    if (!this.visible) {
      return;
    }
    this.actionMenuDropdown = this.viewContainerRef.createComponent(factory);
    document
      .querySelector('body')
      .appendChild(this.actionMenuDropdown.location.nativeElement);
    this.actionMenuDropdown.instance.hostElement = this.viewContainerRef.element.nativeElement;
    this.actionMenuDropdown.instance.targetOffset = this.getHostDimensions(
      this.viewContainerRef.element.nativeElement
    );
    this.actionMenuDropdown.instance.isVertical = this.isVertical;
    this.actionMenuDropdown.instance.defaultPosition = this.defaultPosition;
    this.actionMenuDropdown.instance.items = this.items;
    this.actionMenuDropdown.instance.actionItem = this.actionItem;
    this.actionMenuDropdown.instance.componentRef = this.actionMenuDropdown;
  }

  @HostListener('mouseenter')
  mouseReEnter() {
    if (this.visible) {
      this.clearMenuTimeOut();
    }
  }

  @HostListener('mouseleave', ['$event'])
  hide(event: MouseEvent) {
    if (!event.relatedTarget) {
      this.visible = false;
      const actionMenuDD = document.querySelector('once-action-menu-dropdown');
      if (actionMenuDD) {
        document
          .querySelector('body')
          .removeChild(this.actionMenuDropdown.location.nativeElement);
        if (this.actionMenuDropdown) {
          this.actionMenuDropdown.destroy();
        }
      }
    } else {
      if (!this.visible) {
        return;
      }
      this.timeOutEvent = setTimeout(() => {
        this.hideActionMenuDropDown();
      }, 1000);
      if (this.actionMenuDropdown) {
        this.actionMenuDropdown.instance.timeOutEvent = this.timeOutEvent;
      }
    }
  }

  hideActionMenuDropDown(): void {
    if (!this.visible) {
      return;
    }

    this.visible = false;
    if (this.actionMenuDropdown) {
      this.actionMenuDropdown.destroy();
    }
  }

  clearMenuTimeOut() {
    clearTimeout(this.timeOutEvent);
    this.timeOutEvent = null;
  }

  private getHostDimensions(element) {
    let rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const padding = {
      left: parseInt(style['padding-left'], 10),
      right: parseInt(style['padding-right'], 10),
      top: parseInt(style['padding-top'], 10),
      bottom: parseInt(style['padding-bottom'], 10)
    };
    const border = {
      left: parseInt(style['border-left-width'], 10),
      right: parseInt(style['border-right-width'], 10),
      top: parseInt(style['border-top-width'], 10),
      bottom: parseInt(style['border-bottom-width'], 10)
    };

    rect = {
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
      left: this.isVertical
        ? rect.left - padding.left + border.left
        : rect.left + border.left,
      right: this.isVertical
        ? rect.right + padding.right - border.right
        : rect.right - border.right,
      top: rect.top - border.top,
      bottom: this.isVertical
        ? rect.bottom + border.bottom
        : rect.bottom + padding.bottom
    };
    return rect;
  }
}
