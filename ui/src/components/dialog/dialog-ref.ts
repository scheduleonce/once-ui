import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DialogPosition, OuiDialogConfig } from './dialog-config';
import { OuiDialogContainer } from './dialog-container';

// TODO(jelbourn): resizing

// Counter for unique dialog ids.
let uniqueId = 0;

/**
 * Reference to a dialog opened via the OuiDialog service.
 */
export class OuiDialogRef<T, R = any> {
  /** The instance of component opened into the dialog. */
  componentInstance: T;

  /** Whether the user is allowed to close the dialog. */
  disableClose: boolean | undefined =
    this._containerInstance._config.disableClose;

  /** Subject for notifying the user that the dialog has finished opening. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Subject for notifying the user that the dialog has started closing. */
  private readonly _beforeClosed = new Subject<R | undefined>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  private _dialogConfig: OuiDialogConfig;

  public get dialogConfig(): OuiDialogConfig {
    return this._dialogConfig;
  }

  public set dialogConfig(config: OuiDialogConfig) {
    this._dialogConfig = config;
  }

  constructor(
    private _overlayRef: OverlayRef,
    public _containerInstance: OuiDialogContainer,
    readonly id: string = `oui-dialog-${uniqueId++}`
  ) {
    // Pass the id along to the container.
    _containerInstance._id = id;

    this._afterOpened.next();
    this._afterOpened.complete();

    _overlayRef.detachments().subscribe(() => {
      this._beforeClosed.next(this._result);
      this._beforeClosed.complete();
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
      this.componentInstance = null!;
      this._overlayRef.dispose();
    });

    _overlayRef
      .keydownEvents()
      .pipe(filter((event) => event.key === 'Escape' && !this.disableClose))
      .subscribe(() => this.close());
  }

  /**
   * Close the dialog.
   *
   * @param dialogResult Optional result to return to the dialog opener.
   */
  close(dialogResult?: R): void {
    this._result = dialogResult;
    this._beforeClosed.next(dialogResult);
    this._beforeClosed.complete();
    this._overlayRef.detachBackdrop();
    this._overlayRef.dispose();
  }

  /**
   * Dynamically adds or removes focus from all open dialog containers.
   *
   * @param addFocus Whether to add focus (true) or remove focus (false).
   */
  toggleFocus(addFocus: boolean): void {
    this._containerInstance._toggleFocus(addFocus);
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  afterOpened(): Observable<void> {
    return this._afterOpened.asObservable();
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Gets an observable that is notified when the dialog has started closing.
   */
  beforeClosed(): Observable<R | undefined> {
    return this._beforeClosed.asObservable();
  }

  /**
   * Gets an observable that emits when the overlay's backdrop has been clicked.
   */
  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
  }

  /**
   * Gets an observable that emits when keydown events are targeted on the overlay.
   */
  keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  /**
   * Updates the dialog's position.
   *
   * @param position New dialog position.
   */
  updatePosition(position?: DialogPosition): this {
    const strategy = this._getPositionStrategy();

    if (position && (position.left || position.right)) {
      position.left
        ? strategy.left(position.left)
        : strategy.right(position.right);
    } else {
      strategy.centerHorizontally();
    }

    if (position && (position.top || position.bottom)) {
      position.top
        ? strategy.top(position.top)
        : strategy.bottom(position.bottom);
    } else {
      strategy.centerVertically();
    }

    this._overlayRef.updatePosition();

    return this;
  }

  /**
   * Updates the dialog's width and height.
   *
   * @param width New width of the dialog.
   * @param height New height of the dialog.
   */
  updateSize(width = '', height = ''): this {
    this._getPositionStrategy()
      // eslint-disable-next-line
      .width(width)
      // eslint-disable-next-line
      .height(height);
    this._overlayRef.updatePosition();
    return this;
  }

  /** Fetches the position strategy object from the overlay ref. */
  private _getPositionStrategy(): GlobalPositionStrategy {
    return this._overlayRef.getConfig()
      .positionStrategy as GlobalPositionStrategy;
  }
}
