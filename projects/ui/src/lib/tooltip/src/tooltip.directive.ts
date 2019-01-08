import {
  Directive,
  HostListener,
  ComponentRef,
  ViewContainerRef,
  Input,
  ComponentFactoryResolver,
  Inject,
  OnDestroy
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[onceTooltip]'
})
export class TooltipDirective implements OnDestroy {
  private tooltip: ComponentRef<TooltipComponent>;
  private visible: boolean;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Inject(DOCUMENT) private _document: any
  ) {}

  ngOnDestroy() {
    this.tooltip.destroy();
  }

  @Input()
  onceTooltip: string | TooltipComponent;

  @Input()
  tooltipDisabled: boolean;

  @Input()
  tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @HostListener('mouseenter')
  show(): void {
    if (this.tooltipDisabled || this.visible) {
      return;
    }

    this.visible = true;
    if (typeof this.onceTooltip === 'string') {
      const factory = this.resolver.resolveComponentFactory(TooltipComponent);
      if (!this.visible) {
        return;
      }

      this.tooltip = this.viewContainerRef.createComponent(factory);
      this._document
        .querySelector('body')
        .appendChild(this.tooltip.location.nativeElement);
      this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
      this.tooltip.instance.content = this.onceTooltip as string;
      this.tooltip.instance.placement = this.tooltipPlacement;
    } else {
      const tooltip = this.onceTooltip as TooltipComponent;
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

    if (this.onceTooltip instanceof TooltipComponent) {
      (this.onceTooltip as TooltipComponent).hide();
    }
  }
}
