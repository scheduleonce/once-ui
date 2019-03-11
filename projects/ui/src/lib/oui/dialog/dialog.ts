import { Directionality } from '@angular/cdk/bidi';
import {
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  ScrollStrategy
} from '@angular/cdk/overlay';
import {
  ComponentPortal,
  ComponentType,
  PortalInjector,
  TemplatePortal
} from '@angular/cdk/portal';
import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  TemplateRef
} from '@angular/core';
import { defer, Observable, of as observableOf, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { OuiDialogConfig } from './dialog-config';
import { OuiDialogContainer } from './dialog-container';
import { OuiDialogRef } from './dialog-ref';
import { DialogScrollStrategy } from './dialog-scroll-strategy';

/** Injection token that can be used to access the data that was passed in to a dialog. */
export const OUI_DIALOG_DATA = new InjectionToken<any>('OuiDialogData');

/** Injection token that can be used to specify default dialog options. */
export const OUI_DIALOG_DEFAULT_OPTIONS = new InjectionToken<OuiDialogConfig>(
  'oui-dialog-default-options'
);

/** Injection token that determines the scroll handling while the dialog is open. */
export const OUI_DIALOG_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>('oui-dialog-scroll-strategy');

/** @docs-private */
export function OUI_DIALOG_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export function OUI_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => {
    return overlay.scrollStrategies.block();
  };
}

/** @docs-private */
export const OUI_DIALOG_SCROLL_STRATEGY_PROVIDER = {
  provide: OUI_DIALOG_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: OUI_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY
};

/**
 * Service to open Once UI Design modal dialogs.
 */
@Injectable()
export class OuiDialog implements OnDestroy {
  private _openDialogsAtThisLevel: OuiDialogRef<any>[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<OuiDialogRef<any>>();
  private _ariaHiddenElements = new Map<Element, string | null>();

  /** Keeps track of the currently-open dialogs. */
  get openDialogs(): OuiDialogRef<any>[] {
    return this._parentDialog
      ? this._parentDialog.openDialogs
      : this._openDialogsAtThisLevel;
  }

  /** Stream that emits when a dialog has been opened. */
  get afterOpened(): Subject<OuiDialogRef<any>> {
    return this._parentDialog
      ? this._parentDialog.afterOpened
      : this._afterOpenedAtThisLevel;
  }

  get _afterAllClosed(): Subject<void> {
    const parent = this._parentDialog;
    return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
  }

  /**
   * Stream that emits when all open dialog have finished closing.
   * Will emit on subscribe if there are no open dialogs to begin with.
   */
  readonly afterAllClosed: Observable<void> = defer<void>(() =>
    this.openDialogs.length
      ? this._afterAllClosed
      : this._afterAllClosed.pipe(startWith(undefined))
  );

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    @Optional()
    @Inject(OUI_DIALOG_DEFAULT_OPTIONS)
    private _defaultOptions: OuiDialogConfig,
    @Optional()
    @SkipSelf()
    private _parentDialog: OuiDialog,
    private _overlayContainer: OverlayContainer
  ) {}

  /**
   * Opens a modal dialog containing the given component.
   * @param componentOrTemplateRef Type of the component to load into the dialog,
   *     or a TemplateRef to instantiate as the dialog content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened dialog.
   */
  open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: OuiDialogConfig<D>
  ): OuiDialogRef<T, R> {
    config = _applyConfigDefaults(
      config,
      this._defaultOptions || new OuiDialogConfig()
    );

    if (config.id && this.getDialogById(config.id)) {
      throw Error(
        `Dialog with id "${
          config.id
        }" exists already. The dialog id must be unique.`
      );
    }

    const overlayRef = this._createOverlay(config);
    const dialogContainer = this._attachDialogContainer(overlayRef, config);
    const dialogRef = this._attachDialogContent<T, R>(
      componentOrTemplateRef,
      dialogContainer,
      overlayRef,
      config
    );

    // If this is the first dialog that we're opening, hide all the non-overlay content.
    if (!this.openDialogs.length) {
      this._hideNonDialogContentFromAssistiveTechnology();
    }

    this.openDialogs.push(dialogRef);
    dialogRef.afterClosed().subscribe(() => this._removeOpenDialog(dialogRef));
    this.afterOpened.next(dialogRef);

    return dialogRef;
  }

  /**
   * Closes all of the currently-open dialogs.
   */
  closeAll(): void {
    this._closeDialogs(this.openDialogs);
  }

  /**
   * Finds an open dialog by its id.
   * @param id ID to use when looking up the dialog.
   */
  getDialogById(id: string): OuiDialogRef<any> | undefined {
    return this.openDialogs.find(dialog => dialog.id === id);
  }

  ngOnDestroy() {
    // Only close the dialogs at this level on destroy
    // since the parent service may still be active.
    this._closeDialogs(this._openDialogsAtThisLevel);
  }

  /**
   * Creates the overlay into which the dialog will be loaded.
   * @param config The dialog configuration.
   * @returns A promise resolving to the OverlayRef for the created overlay.
   */
  private _createOverlay(config: OuiDialogConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  /**
   * Creates an overlay config from a dialog config.
   * @param dialogConfig The dialog configuration.
   * @returns The overlay configuration.
   */
  private _getOverlayConfig(dialogConfig: OuiDialogConfig): OverlayConfig {
    const state = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      scrollStrategy: dialogConfig.scrollStrategy || new DialogScrollStrategy(),
      panelClass: dialogConfig.panelClass,
      hasBackdrop: dialogConfig.hasBackdrop,
      direction: dialogConfig.direction,
      minWidth: dialogConfig.minWidth,
      minHeight: dialogConfig.minHeight,
      maxWidth: dialogConfig.maxWidth,
      maxHeight: dialogConfig.maxHeight,
      disposeOnNavigation: true
    });

    if (dialogConfig.backdropClass) {
      state.backdropClass = dialogConfig.backdropClass;
    }

    return state;
  }

  /**
   * Attaches an OuiDialogContainer to a dialog's already-created overlay.
   * @param overlay Reference to the dialog's underlying overlay.
   * @param config The dialog configuration.
   * @returns A promise resolving to a ComponentRef for the attached container.
   */
  private _attachDialogContainer(
    overlay: OverlayRef,
    config: OuiDialogConfig
  ): OuiDialogContainer {
    const userInjector =
      config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = new PortalInjector(
      userInjector || this._injector,
      new WeakMap([[OuiDialogConfig, config]])
    );
    const containerPortal = new ComponentPortal(
      OuiDialogContainer,
      config.viewContainerRef,
      injector
    );
    const containerRef = overlay.attach<OuiDialogContainer>(containerPortal);

    return containerRef.instance;
  }

  /**
   * Attaches the user-provided component to the already-created OuiDialogContainer.
   * @param componentOrTemplateRef The type of component being loaded into the dialog,
   *     or a TemplateRef to instantiate as the content.
   * @param dialogContainer Reference to the wrapping OuiDialogContainer.
   * @param overlayRef Reference to the overlay in which the dialog resides.
   * @param config The dialog configuration.
   * @returns A promise resolving to the OuiDialogRef that should be returned to the user.
   */
  private _attachDialogContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    dialogContainer: OuiDialogContainer,
    overlayRef: OverlayRef,
    config: OuiDialogConfig
  ): OuiDialogRef<T, R> {
    // Create a reference to the dialog we're creating in order to give the user a handle
    // to modify and close it.
    const dialogRef = new OuiDialogRef<T, R>(
      overlayRef,
      dialogContainer,
      config.id
    );

    dialogRef.dialogConfig = config;

    // When the dialog backdrop is clicked, we want to close it.
    if (config.hasBackdrop) {
      overlayRef.backdropClick().subscribe(() => {
        if (!dialogRef.disableClose) {
          dialogRef.close();
        }
      });
    }

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!, <any>{
          $implicit: config.data,
          dialogRef
        })
      );
    } else {
      const injector = this._createInjector<T>(
        config,
        dialogRef,
        dialogContainer
      );
      const contentRef = dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, undefined, injector)
      );
      dialogRef.componentInstance = contentRef.instance;
    }
    dialogRef
      .updateSize(config.width, config.height)
      .updatePosition(config.position);

    return dialogRef;
  }

  /**
   * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
   * of a dialog to close itself and, optionally, to return a value.
   * @param config Config object that is used to construct the dialog.
   * @param dialogRef Reference to the dialog.
   * @param container Dialog container element that wraps all of the contents.
   * @returns The custom injector that can be used inside the dialog.
   */
  private _createInjector<T>(
    config: OuiDialogConfig,
    dialogRef: OuiDialogRef<T>,
    dialogContainer: OuiDialogContainer
  ): PortalInjector {
    const userInjector =
      config && config.viewContainerRef && config.viewContainerRef.injector;

    // The OuiDialogContainer is injected in the portal as the OuiDialogContainer and the dialog's
    // content are created out of the same ViewContainerRef and as such, are siblings for injector
    // purposes. To allow the hierarchy that is expected, the OuiDialogContainer is explicitly
    // added to the injection tokens.
    const injectionTokens = new WeakMap<any, any>([
      [OuiDialogContainer, dialogContainer],
      [OUI_DIALOG_DATA, config.data],
      [OuiDialogRef, dialogRef]
    ]);

    if (
      config.direction &&
      (!userInjector ||
        !userInjector.get<Directionality | null>(Directionality, null))
    ) {
      injectionTokens.set(Directionality, {
        value: config.direction,
        change: observableOf()
      });
    }

    return new PortalInjector(userInjector || this._injector, injectionTokens);
  }

  /**
   * Removes a dialog from the array of open dialogs.
   * @param dialogRef Dialog to be removed.
   */
  private _removeOpenDialog(dialogRef: OuiDialogRef<any>) {
    const index = this.openDialogs.indexOf(dialogRef);

    if (index > -1) {
      this.openDialogs.splice(index, 1);

      // If all the dialogs were closed, remove/restore the `aria-hidden`
      // to a the siblings and emit to the `afterAllClosed` stream.
      if (!this.openDialogs.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute('aria-hidden', previousValue);
          } else {
            element.removeAttribute('aria-hidden');
          }
        });

        this._ariaHiddenElements.clear();
        this._afterAllClosed.next();
      }
    }
  }

  /**
   * Hides all of the content that isn't an overlay from assistive technology.
   */
  private _hideNonDialogContentFromAssistiveTechnology() {
    const overlayContainer = this._overlayContainer.getContainerElement();

    // Ensure that the overlay container is attached to the DOM.
    if (overlayContainer.parentElement) {
      const siblings = overlayContainer.parentElement.children;

      for (let i = siblings.length - 1; i > -1; i--) {
        const sibling = siblings[i];

        if (
          sibling !== overlayContainer &&
          sibling.nodeName !== 'SCRIPT' &&
          sibling.nodeName !== 'STYLE' &&
          !sibling.hasAttribute('aria-live')
        ) {
          this._ariaHiddenElements.set(
            sibling,
            sibling.getAttribute('aria-hidden')
          );
          sibling.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  /** Closes all of the dialogs in an array. */
  private _closeDialogs(dialogs: OuiDialogRef<any>[]) {
    let i = dialogs.length;

    while (i--) {
      // The `_openDialogs` property isn't updated after close until the rxjs subscription
      // runs on the next microtask, in addition to modifying the array as we're going
      // through it. We loop through all of them and call close without assuming that
      // they'll be removed from the list instantaneously.
      dialogs[i].close();
    }
  }
}

/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @param defaultOptions Default options provided.
 * @returns The new configuration object.
 */
function _applyConfigDefaults(
  config?: OuiDialogConfig,
  defaultOptions?: OuiDialogConfig
): OuiDialogConfig {
  return { ...defaultOptions, ...config };
}
