import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { OuiDialog, OuiDialogRef } from '../dialog/public-api';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { OuiCalendar } from './calendar';
import { ouiDatepickerAnimations } from './datepicker-animations';
import { createMissingDateImplError } from './datepicker-errors';
import { OuiDatepickerInput } from './datepicker-input';
import { OuiCalendarCellCssClasses } from './calendar-body';
import { CanColorCtor, mixinColor, CanColor, ThemePalette } from '../core';
import { DateAdapter } from './date-adapter';

/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;

/** Injection token that determines the scroll handling while the calendar is open. */
export const OUI_DATEPICKER_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>('oui-datepicker-scroll-strategy');

export function OUI_DATEPICKER_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

export const OUI_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: OUI_DATEPICKER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: OUI_DATEPICKER_SCROLL_STRATEGY_FACTORY,
};

// Boilerplate for applying mixins to OuiDatepickerContent.
export class OuiDatepickerContentBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _OuiDatepickerContentMixinBase: CanColorCtor &
  typeof OuiDatepickerContentBase = mixinColor(OuiDatepickerContentBase);

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * OuiCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 */
@Component({
    selector: 'oui-datepicker-content',
    templateUrl: 'datepicker-content.html',
    styleUrls: ['datepicker-content.scss'],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'oui-datepicker-content',
        '[@transformPanel]': '"enter"',
        '[class.oui-datepicker-content-touch]': 'datepicker.touchUi',
    },
    animations: [
        ouiDatepickerAnimations.transformPanel,
        ouiDatepickerAnimations.fadeInCalendar,
    ],
    exportAs: 'ouiDatepickerContent',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    inputs: ['color'],
    standalone: false
})
export class OuiDatepickerContent<D>
  extends _OuiDatepickerContentMixinBase
  implements AfterViewInit, CanColor
{
  /** Reference to the internal calendar component. */
  @ViewChild(OuiCalendar) _calendar: OuiCalendar<D>;

  /** Reference to the datepicker that created the overlay. */
  datepicker: OuiDatepicker<D>;

  /** Whether the datepicker is above or below the input. */
  _isAbove: boolean;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngAfterViewInit() {
    this._calendar.focusActiveCell();
  }
}

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="ouiDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
@Component({
    selector: 'oui-datepicker',
    template: '',
    exportAs: 'ouiDatepicker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '[class.oui-datepicker-disabled]': 'disabled',
    },
    standalone: false
})
export class OuiDatepicker<D> implements OnDestroy, CanColor {
  private _scrollStrategy: () => ScrollStrategy;

  /** An input indicating the type of the custom header component for the calendar, if set. */
  @Input() calendarHeaderComponent: ComponentType<any>;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return (
      this._startAt ||
      (this._datepickerInput ? this._datepickerInput.value : null)
    );
  }
  set startAt(value: D | null) {
    this._startAt = this._getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
  }
  private _startAt: D | null;

  /** The view that the calendar should start in. */
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';

  /** Color palette to use on the datepicker's calendar. */
  @Input()
  get color(): ThemePalette {
    return (
      this._color ||
      (this._datepickerInput
        ? this._datepickerInput._getThemePalette()
        : undefined)
    );
  }
  set color(value: ThemePalette) {
    this._color = value;
  }
  _color: ThemePalette;

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }
  set touchUi(value: boolean) {
    this._touchUi = coerceBooleanProperty(value);
  }
  private _touchUi = false;

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._datepickerInput
      ? this._datepickerInput.disabled
      : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
      this._datepickerInput._datepickerDisabled = newValue;
    }
  }
  private _disabled = false;

  /**
   * Emits selected year in multiyear view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits selected month in year view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[];

  /** Function that can be used to add custom CSS classes to dates. */
  @Input() dateClass: (date: D) => OuiCalendarCellCssClasses;

  /** Emits when the datepicker has been opened. */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('opened') openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('closed') closedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    if (value) {
      this.open();
    } else {
      this.close();
    }
  }
  private _opened = false;

  /** The id for the datepicker calendar. */
  id = `oui-datepicker-${datepickerUid++}`;

  /** The currently selected date. */
  get _selected(): D | null {
    return this._validSelected;
  }
  set _selected(value: D | null) {
    this._validSelected = value;
  }
  private _validSelected: D | null = null;

  /** The minimum selectable date. */
  get _minDate(): D | null {
    return this._datepickerInput && this._datepickerInput.min;
  }

  /** The maximum selectable date. */
  get _maxDate(): D | null {
    return this._datepickerInput && this._datepickerInput.max;
  }

  get _dateFilter(): (date: D | null) => boolean {
    return this._datepickerInput && this._datepickerInput._dateFilter;
  }

  /** A reference to the overlay when the calendar is opened as a popup. */
  _popupRef: OverlayRef;

  /** A reference to the dialog when the calendar is opened as a dialog. */
  private _dialogRef: OuiDialogRef<OuiDatepickerContent<D>> | null;

  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal: ComponentPortal<OuiDatepickerContent<D>>;

  /** Reference to the component instantiated in popup mode. */
  private _popupComponentRef: ComponentRef<OuiDatepickerContent<D>> | null;

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  /** Subscription to value changes in the associated input element. */
  private _inputSubscription = Subscription.EMPTY;

  /** The input element this datepicker is associated with. */
  _datepickerInput: OuiDatepickerInput<D>;

  /** Emits when the datepicker is disabled. */
  readonly _disabledChange = new Subject<boolean>();

  /** Emits new selected date when selected date changes. */
  readonly _selectedChanged = new Subject<D>();
  private _monitorSubscription: Subscription = Subscription.EMPTY;
  constructor(
    private _dialog: OuiDialog,
    private _overlay: Overlay,
    private _ngZone: NgZone,
    protected elementRef: ElementRef<HTMLElement>,
    private _focusMonitor: FocusMonitor,
    private _viewContainerRef: ViewContainerRef,
    @Inject(OUI_DATEPICKER_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() private _dir: Directionality,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    this._scrollStrategy = scrollStrategy;
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));
  }

  ngOnDestroy() {
    this.close();
    this._inputSubscription.unsubscribe();
    this._disabledChange.complete();
    this._monitorSubscription.unsubscribe();

    if (this._popupRef) {
      this._popupRef.dispose();
      this._popupComponentRef = null;
    }
  }

  /** Selects the given date */
  select(date: D): void {
    const oldValue = this._selected;
    this._selected = date;
    if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
      this._selectedChanged.next(date);
    }
  }

  /** Emits the selected year in multiyear view */
  _selectYear(normalizedYear: D): void {
    this.yearSelected.emit(normalizedYear);
  }

  /** Emits selected month in year view */
  _selectMonth(normalizedMonth: D): void {
    this.monthSelected.emit(normalizedMonth);
  }

  /**
   * Register an input with this datepicker.
   *
   * @param input The datepicker input to register with this datepicker.
   */
  _registerInput(input: OuiDatepickerInput<D>): void {
    if (this._datepickerInput) {
      throw Error(
        'A OuiDatepicker can only be associated with a single input.'
      );
    }
    this._datepickerInput = input;
    this._inputSubscription = this._datepickerInput._valueChange.subscribe(
      (value: D | null) => (this._selected = value)
    );
  }

  /** Open the calendar. */
  open(): void {
    if (this._opened || this.disabled) {
      return;
    }
    if (!this._datepickerInput) {
      throw Error(
        'Attempted to open an OuiDatepicker with no associated input.'
      );
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    if (this.touchUi) {
      this._openAsDialog();
    } else {
      this._openAsPopup();
    }
    this._opened = true;
    // add input focus here
    this._datepickerInput.focus();
    this.openedStream.emit();
  }

  /** Close the calendar. */
  close(): void {
    if (!this._opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
        this._focusedElementBeforeOpen = null;
        this._datepickerInput.blur();
      }
    };

    if (
      this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function'
    ) {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(): void {
    // Usually this would be handled by `open` which ensures that we can only have one overlay
    // open at a time, however since we reset the variables in async handlers some overlays
    // may slip through if the user opens and closes multiple times in quick succession (e.g.
    // by holding down the enter key).
    if (this._dialogRef) {
      this._dialogRef.close();
    }

    this._dialogRef = this._dialog.open<OuiDatepickerContent<D>>(
      OuiDatepickerContent,
      {
        direction: this._dir ? this._dir.value : 'ltr',
        viewContainerRef: this._viewContainerRef,
        panelClass: 'oui-datepicker-dialog',
      }
    );

    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.datepicker = this;
    this._setColor();
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal<OuiDatepickerContent<D>>(
        OuiDatepickerContent,
        this._viewContainerRef
      );
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      this._popupComponentRef = this._popupRef.attach(this._calendarPortal);
      this._popupComponentRef.instance.datepicker = this;
      this._setColor();

      // Update the position once the calendar has rendered.
      this._ngZone.onStable
        .asObservable()
        .pipe(take(1))
        .subscribe(() => {
          this._popupRef.updatePosition();
        });
    }
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'oui-overlay-transparent-backdrop',
      direction: this._dir,
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'oui-datepicker-popup',
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(
        filter(
          (event) =>
            // Closing on alt + up is only valid when there's an input associated with the datepicker.
            event.keyCode === ESCAPE ||
            (this._datepickerInput &&
              event.altKey &&
              event.keyCode === UP_ARROW)
        )
      )
    ).subscribe(() => this.close());
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.oui-datepicker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return this._dateAdapter.isDateInstance(obj) &&
      this._dateAdapter.isValid(obj as any as D)
      ? obj
      : null;
  }

  /** Passes the current theme color along to the calendar overlay. */
  private _setColor(): void {
    const color = this.color;
    if (this._popupComponentRef) {
      this._popupComponentRef.instance.color = color;
    }
    if (this._dialogRef) {
      this._dialogRef.componentInstance.color = color;
    }
  }
}
