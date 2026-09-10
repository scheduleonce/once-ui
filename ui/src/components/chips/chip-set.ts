import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  ErrorHandler,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
  booleanAttribute,
  numberAttribute,
  effect,
  inject,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { Observable, Subject, merge } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { OuiChip, OuiChipEvent } from './chip';
import { OuiChipAction, OuiChipContent } from './chip-action';

/**
 * Basic container component for the OuiChip component.
 *
 * Extended by OuiChipListbox and OuiChipGrid for different interaction patterns.
 */
@Component({
  selector: 'oui-chip-set',
  template: `
    <div class="oui-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['chip-set.scss'],
  host: {
    class: 'oui-chip-set',
    '(keydown)': '_handleKeydown($event)',
    '[attr.role]': 'role',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class OuiChipSet implements AfterViewInit, OnDestroy {
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _changeDetectorRef = inject(ChangeDetectorRef);
  private _dir = inject(Directionality, { optional: true });
  protected _errorHandler = inject(ErrorHandler);

  /** Index of the last destroyed chip that had focus. */
  protected _lastDestroyedFocusedChipIndex: number | null = null;

  /** Used to manage focus within the chip list. */
  protected _keyManager!: FocusKeyManager<OuiChipAction>;

  /** Subject that emits when the component has been destroyed. */
  protected _destroyed = new Subject<void>();

  /** Role to use if it hasn't been overwritten by the user. */
  protected _defaultRole = 'presentation';

  /** Combined stream of all of the child chips' focus events. */
  get chipFocusChanges(): Observable<OuiChipEvent> {
    return this._getChipStream((chip) => chip._onFocus);
  }

  /** Combined stream of all of the child chips' destroy events. */
  get chipDestroyedChanges(): Observable<OuiChipEvent> {
    return this._getChipStream((chip) => outputToObservable(chip.destroyed));
  }

  /** Combined stream of all of the child chips' remove events. */
  get chipRemovedChanges(): Observable<OuiChipEvent> {
    return this._getChipStream((chip) => outputToObservable(chip.removed));
  }

  /** Whether the chip set is disabled. */
  readonly disabledInput = input(false, { transform: booleanAttribute });
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this._syncChipsState();
  }
  protected _disabled: boolean = false;

  /** Whether the chip list contains chips or not. */
  get empty(): boolean {
    return !this._chips || this._chips.length === 0;
  }

  /** The ARIA role applied to the chip set. */
  readonly roleInput = input<string | null>(undefined, { alias: 'role' });
  get role(): string | null {
    if (this._explicitRole) {
      return this._explicitRole;
    }

    return this.empty ? null : this._defaultRole;
  }

  /** Tabindex of the chip set. */
  readonly tabIndex = input(0, {
    transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)),
  });

  set role(value: string | null) {
    this._explicitRole = value;
  }
  private _explicitRole: string | null = null;

  constructor() {
    effect(() => {
      this.disabled = this.disabledInput();
      const role = this.roleInput();
      if (role !== undefined) {
        this.role = role;
      }
    });
  }

  /** Whether any of the chips inside of this chip-set has focus. */
  get focused(): boolean {
    return this._hasFocusedChip();
  }

  /** The chips that are part of this chip set. */
  @ContentChildren(OuiChip, {
    descendants: true,
  })
  _chips!: QueryList<OuiChip>;

  /** Flat list of all the actions contained within the chips. */
  _chipActions = new QueryList<OuiChipAction>();

  ngAfterViewInit() {
    this._setUpFocusManagement();
    this._trackChipSetChanges();
    this._trackDestroyedFocusedChip();
  }

  ngOnDestroy() {
    this._keyManager?.destroy();
    this._chipActions.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Checks whether any of the chips is focused. */
  protected _hasFocusedChip() {
    return this._chips && this._chips.some((chip) => chip._hasFocus());
  }

  /** Syncs the chip-set's state with the individual chips. */
  protected _syncChipsState() {
    this._chips?.forEach((chip) => {
      chip._chipListDisabled = this._disabled;
      chip._changeDetectorRef.markForCheck();
    });
  }

  /** Dummy method for subclasses to override. Base chip set cannot be focused. */
  focus() {}

  /** Handles keyboard events on the chip set. */
  _handleKeydown(event: KeyboardEvent) {
    if (this._originatesFromChip(event)) {
      this._keyManager.onKeydown(event);
    }
  }

  /**
   * Utility to ensure all indexes are valid.
   *
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of chips.
   */
  protected _isValidIndex(index: number): boolean {
    return index >= 0 && index < this._chips.length;
  }

  /**
   * Removes the `tabindex` from the chip set and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the set from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  protected _allowFocusEscape() {
    const previous = this._elementRef.nativeElement.tabIndex;

    if (previous !== -1) {
      this._elementRef.nativeElement.tabIndex = -1;

      setTimeout(() => (this._elementRef.nativeElement.tabIndex = previous));
    }
  }

  /**
   * Gets a stream of events from all the chips within the set.
   * The stream will automatically incorporate any newly-added chips.
   */
  protected _getChipStream<T, C extends OuiChip = OuiChip>(
    mappingFunction: (chip: C) => Observable<T>
  ): Observable<T> {
    return this._chips.changes.pipe(
      startWith(null),
      switchMap(() =>
        merge(...(this._chips as QueryList<C>).map(mappingFunction))
      )
    );
  }

  /** Checks whether an event comes from inside a chip element. */
  protected _originatesFromChip(event: Event): boolean {
    let currentElement = event.target as HTMLElement | null;

    while (
      currentElement &&
      currentElement !== this._elementRef.nativeElement
    ) {
      if (currentElement.classList.contains('oui-chip')) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }

  /** Sets up the chip set's focus management logic. */
  private _setUpFocusManagement() {
    this._chips.changes.pipe(startWith(this._chips)).subscribe({
      next: (chips: QueryList<OuiChip>) => {
        const actions: OuiChipAction[] = [];
        chips.forEach((chip) =>
          chip._getActions().forEach((action) => actions.push(action))
        );
        this._chipActions.reset(actions);
        this._chipActions.notifyOnChanges();
      },
      error: (err: Error) => this._errorHandler.handleError(err),
    });

    this._keyManager = new FocusKeyManager(this._chipActions)
      .withVerticalOrientation()
      .withHorizontalOrientation(this._dir ? this._dir.value : 'ltr')
      .withHomeAndEnd()
      .skipPredicate((action) => this._skipPredicate(action));

    this.chipFocusChanges.pipe(takeUntil(this._destroyed)).subscribe({
      next: ({ chip }) => {
        const action = chip._getSourceAction(document.activeElement as Element);

        if (action) {
          this._keyManager.updateActiveItem(action);
        }
      },
      error: (err: Error) => this._errorHandler.handleError(err),
    });

    this._dir?.change.pipe(takeUntil(this._destroyed)).subscribe({
      next: (direction) =>
        this._keyManager.withHorizontalOrientation(direction),
      error: (err: Error) => this._errorHandler.handleError(err),
    });
  }

  /**
   * Determines if key manager should avoid putting a given chip action in the tab index. Skip
   * non-interactive and disabled actions since the user can't do anything with them.
   */
  protected _skipPredicate(action: OuiChipContent): boolean {
    return action.disabled;
  }

  /** Listens to changes in the chip set and syncs up the state of the individual chips. */
  private _trackChipSetChanges() {
    this._chips.changes
      .pipe(startWith(null), takeUntil(this._destroyed))
      .subscribe({
        next: () => {
          if (this.disabled) {
            Promise.resolve().then(() => this._syncChipsState());
          }

          this._redirectDestroyedChipFocus();
        },
        error: (err: Error) => this._errorHandler.handleError(err),
      });
  }

  /** Starts tracking the destroyed chips in order to capture the focused one. */
  private _trackDestroyedFocusedChip() {
    this.chipDestroyedChanges.pipe(takeUntil(this._destroyed)).subscribe({
      next: (event: OuiChipEvent) => {
        const chipArray = this._chips.toArray();
        const chipIndex = chipArray.indexOf(event.chip);
        const hasFocus = event.chip._hasFocus();
        const wasLastFocused =
          event.chip._hadFocusOnRemove &&
          this._keyManager.activeItem &&
          event.chip._getActions().includes(this._keyManager.activeItem);

        const shouldMoveFocus = hasFocus || wasLastFocused;

        if (this._isValidIndex(chipIndex) && shouldMoveFocus) {
          this._lastDestroyedFocusedChipIndex = chipIndex;
        }
      },
      error: (err: Error) => this._errorHandler.handleError(err),
    });
  }

  /**
   * Finds the next appropriate chip to move focus to,
   * if the currently-focused chip is destroyed.
   */
  protected _redirectDestroyedChipFocus() {
    if (this._lastDestroyedFocusedChipIndex == null) {
      return;
    }

    if (this._chips.length) {
      const newIndex = Math.min(
        this._lastDestroyedFocusedChipIndex,
        this._chips.length - 1
      );
      const chipToFocus = this._chips.toArray()[newIndex];

      if (chipToFocus._isDisabled()) {
        if (this._chips.length === 1) {
          this.focus();
        } else {
          this._keyManager.setPreviousItemActive();
        }
      } else {
        chipToFocus.focus();
      }
    } else {
      this.focus();
    }

    this._lastDestroyedFocusedChipIndex = null;
  }
}
