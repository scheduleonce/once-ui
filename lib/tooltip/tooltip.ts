import {
  Directive,
  HostListener,
  ComponentRef,
  ViewContainerRef,
  Input,
  ComponentFactoryResolver,
  Inject
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { DOCUMENT } from '@angular/platform-browser';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  private tooltip: ComponentRef<TooltipComponent>;
  private visible: boolean;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Inject(DOCUMENT) private _document: any
  ) {}

  @Input() appTooltip: string | TooltipComponent;

  @Input() tooltipDisabled: boolean;

  @Input() tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @HostListener('mouseenter')
  show(): void {
    if (this.tooltipDisabled || this.visible) {
      return;
    }

    this.visible = true;
    if (typeof this.appTooltip === 'string') {
      const factory = this.resolver.resolveComponentFactory(TooltipComponent);
      if (!this.visible) {
        return;
      }

      this.tooltip = this.viewContainerRef.createComponent(factory);
      this._document
        .querySelector('body')
        .appendChild(this.tooltip.location.nativeElement);
      this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
      this.tooltip.instance.content = this.appTooltip as string;
      this.tooltip.instance.placement = this.tooltipPlacement;
    } else {
      const tooltip = this.appTooltip as TooltipComponent;
      tooltip.hostElement = this.viewContainerRef.element.nativeElement;
      tooltip.placement = this.tooltipPlacement;
      tooltip.show();
    }
  }

  @HostListener('mouseleave')
  hide(): void {
    this.hideTooltip();
  }

  @HostListener('click')
  hideOnClick(): void {
    this.hideTooltip();
  }

  hideTooltip(): void {
    if (!this.visible) {
      return;
    }

    this.visible = false;
    if (this.tooltip) {
      this.tooltip.destroy();
    }

    if (this.appTooltip instanceof TooltipComponent) {
      (this.appTooltip as TooltipComponent).hide();
    }
  }
}
