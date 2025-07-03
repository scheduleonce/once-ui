import { Directive, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
// Removed unused portal, sanitizer, and document imports after Angular 20 migration
import { Subject } from 'rxjs';

/**
 * Menu content that will be rendered lazily once the menu is opened.
 */
@Directive({
  selector: 'ng-template[ouiMenuContent]',
  standalone: false,
})
export class OuiMenuContent implements OnDestroy {
  // Removed TemplatePortal and DomPortalOutlet for Angular 20+ migration
  private _viewRef: any = null;

  /** Emits when the menu content has been attached. */
  _attached = new Subject<void>();

  constructor(
    private _template: TemplateRef<any>,
    private _viewContainerRef: ViewContainerRef,
    // Removed unused _document and _sanitizer after migration
  ) {}

  /**
   * Attaches the content with a particular context.
   */
  attach(context: any = {}) {
    this.detach();
    this._viewRef = this._viewContainerRef.createEmbeddedView(this._template, context);
    this._attached.next();
  }

  /**
   * Detaches the content.
   */
  detach() {
    if (this._viewRef) {
      this._viewRef.destroy();
      this._viewRef = null;
    }
  }

  ngOnDestroy() {
    this.detach();
    this._attached.complete();
  }
}
