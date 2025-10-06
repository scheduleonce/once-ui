import {
  Component,
  ComponentRef,
  EmbeddedViewRef,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import {
  BasePortalOutlet,
  ComponentPortal,
  CdkPortalOutlet,
  TemplatePortal,
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { OuiDialogConfig } from './dialog-config';
import { FocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';

/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 *
 * @docs-private
 */
export function throwOuiDialogContentAlreadyAttachedError() {
  throw Error(
    'Attempting to attach dialog content after content is already attached'
  );
}

/**
 * Internal component that wraps user-provided dialog content.
 *
 * @docs-private
 */
@Component({
  selector: 'oui-dialog-container',
  templateUrl: 'dialog-container.html',
  styleUrls: ['dialog.scss'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  // eslint-disable-next-line
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'oui-dialog-container',
    tabindex: '-1',
    'aria-modal': 'true',
    '[attr.id]': '_id',
    '[attr.role]': '_config.role',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
  },
  standalone: false,
})
export class OuiDialogContainer extends BasePortalOutlet implements OnInit {
  private _focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  _config = inject(OuiDialogConfig);
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _document = inject<Document>(DOCUMENT, { optional: true })!;

  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true })
  _portalOutlet: CdkPortalOutlet;

  /** The class that traps and manages focus within the dialog. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement = null;

  /** ID of the element that should be considered as the dialog's label. */
  _ariaLabelledBy: string | null = null;

  /** ID for the container DOM element. */
  _id: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this._addMarginForDefaultScroll();
  }
  private _addMarginForDefaultScroll() {
    if (!this._config.scrollStrategy) {
      this.elementRef.nativeElement.style.marginTop = '40px';
      this.elementRef.nativeElement.style.marginBottom = '40px';
    }
  }
  /**
   * Attach a ComponentPortal as content to this dialog container.
   *
   * @param portal Portal to be attached as the dialog content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throwOuiDialogContentAlreadyAttachedError();
    }
    this._addFocusTrap();
    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   *
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throwOuiDialogContentAlreadyAttachedError();
    }
    this._addFocusTrap();
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /** Moves the focus inside the focus trap. */
  public _trapFocus() {
    // If we were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this._config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else if (!this._containsFocus()) {
      // Otherwise ensure that focus is on the dialog container. It's possible that a different
      // component tried to move focus while the open animation was running.
      // if the focus isn't inside the dialog already, because it's possible that the consumer
      // turned off `autoFocus` in order to move focus themselves.
      this.elementRef.nativeElement.focus();
    }
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  public _restoreFocus() {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (
      this._config.restoreFocus &&
      toFocus &&
      typeof toFocus.focus === 'function'
    ) {
      const activeElement = this._document.activeElement as HTMLElement;
      const element = this.elementRef.nativeElement;
      if (
        !activeElement ||
        activeElement === this._document.body ||
        activeElement === element ||
        element.contains(activeElement)
      ) {
        toFocus.focus();
      }
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /**
   * Dynamically adds or removes focus from the dialog container.
   *
   * @param addFocus Whether to add focus (true) or remove focus (false).
   */
  public _toggleFocus(addFocus: boolean): void {
    if (addFocus) {
      console.log('adding focus in dialog');
      this._addFocusTrap(); // Add focus
    } else {
      console.log('removing focus from dialog');
      this._removeFocusTrap(); // Remove focus
    }
  }

  /**
   * Setting up the focus trap and saves a reference to the element that was focused before the dialog was open.
   */
  private _addFocusTrap() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(
        this.elementRef.nativeElement
      );
    }
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document
        .activeElement as HTMLElement;
      // Note that there is no focus method when rendering on the server.
      if (this.elementRef.nativeElement.focus) {
        // Move focus onto the dialog immediately in order to prevent the user from accidentally
        // opening multiple dialogs at the same time. Needs to be async, because the element
        // may not be focusable immediately.
        Promise.resolve().then(() => this.elementRef.nativeElement.focus());
      }
    }
  }

  /** Only return when there is focus inside the dialog */
  private _containsFocus() {
    const element = this.elementRef.nativeElement as HTMLElement;
    const activeElement = this._document.activeElement;
    return element === activeElement || element.contains(activeElement);
  }

  /**
   * Removes the focus trap from the dialog.
   * This method is called to clean up resources and ensure the dialog no longer traps focus.
   */
  private _removeFocusTrap() {
    if (this._focusTrap) {
      this._focusTrap.destroy();
      // Clear the reference to help with garbage collection
      this._focusTrap = null;
    }
  }
}
