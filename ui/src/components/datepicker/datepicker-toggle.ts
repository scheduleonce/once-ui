import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  ViewChild,
  inject,
  HostAttributeToken,
} from '@angular/core';
import { OuiButton } from '../button/button';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { OuiDatepicker } from './datepicker';
import { OuiDatepickerIntl } from './datepicker-intl';

/** Can be used to override the icon of a `ouiDatepickerToggle`. */
@Directive({
  selector: '[ouiDatepickerToggleIcon]',
  standalone: false,
})
export class OuiDatepickerToggleIcon {}

@Component({
  selector: 'oui-datepicker-toggle',
  templateUrl: 'datepicker-toggle.html',
  styleUrls: ['datepicker-toggle.scss'],
  host: {
    class: 'oui-datepicker-toggle',
    // Always set the tabindex to -1 so that it doesn't overlap with any custom tabindex the
    // consumer may have provided, while still being able to receive focus.
    '[attr.tabindex]': '-1',
    '[class.oui-datepicker-toggle-active]': 'datepicker && datepicker.opened',
    '[class.oui-accent]': 'datepicker && datepicker.color === "accent"',
    '[class.oui-warn]': 'datepicker && datepicker.color === "warn"',
    '(focus)': '_button.focus()',
    '[class.oui-datepicker-disabled]': 'disabled',
  },
  exportAs: 'ouiDatepickerToggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class OuiDatepickerToggle<D>
  implements AfterContentInit, OnChanges, OnDestroy
{
  _intl = inject(OuiDatepickerIntl);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _stateChanges = Subscription.EMPTY;

  /** Datepicker instance that the button will toggle. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('for') datepicker: OuiDatepicker<D>;

  /** Tabindex for the toggle. */
  @Input() tabIndex: number | null;

  /** Whether the toggle button is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined
      ? this.datepicker.disabled
      : !!this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean;

  /** Custom icon set by the consumer. */
  @ContentChild(OuiDatepickerToggleIcon)
  _customIcon: OuiDatepickerToggleIcon;

  /** Underlying button element. */
  @ViewChild('button') _button: OuiButton;

  constructor() {
    const defaultTabIndex = inject(new HostAttributeToken('tabindex'), {
      optional: true,
    })!;

    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex =
      parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.datepicker) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  _open(event: Event): void {
    if (this.datepicker && !this.disabled) {
      this.datepicker.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const datepickerDisabled = this.datepicker
      ? this.datepicker._disabledChange
      : observableOf();
    const inputDisabled =
      this.datepicker && this.datepicker._datepickerInput
        ? this.datepicker._datepickerInput._disabledChange
        : observableOf();
    const datepickerToggled = this.datepicker
      ? merge(this.datepicker.openedStream, this.datepicker.closedStream)
      : observableOf();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      this._intl.changes,
      datepickerDisabled as Observable<void>,
      inputDisabled as Observable<void>,
      datepickerToggled
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }
}
