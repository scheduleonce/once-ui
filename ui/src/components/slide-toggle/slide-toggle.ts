import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewEncapsulation,
  AfterContentInit,
  Attribute,
  OnDestroy,
  NgZone,
  forwardRef
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { mixinColor } from '../core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
let nextUniqueId = 0;
/**
 * Boilerplate for applying mixins to OuiSlideToggle.
 * @docs-private
 */
/** @docs-private */
export const OUI_SLIDE_TOGGLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => OuiSlideToggle),
  multi: true
};

export class OuiSlideToggleBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _OuiSlideToggleMixinBase: typeof OuiSlideToggleBase = mixinColor(
  OuiSlideToggleBase
);

/** Container for form controls that applies Oncehub Design styling and behavior. */
@Component({
  selector: 'oui-slide-toggle',
  exportAs: 'ouiSlideToggle',
  templateUrl: 'slide-toggle.html',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-slide-toggle',
    '[class.oui-disabled]': 'disabled',
    '[attr.tabindex]': 'disabled ? null : -1'
  },
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled', 'tabIndex'],
  styleUrls: ['./slide-toggle.scss'],
  providers: [OUI_SLIDE_TOGGLE_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class OuiSlideToggle extends _OuiSlideToggleMixinBase
  implements AfterContentInit, ControlValueAccessor, OnDestroy {
  private _checked = false;
  tabIndex: any;
  private _monitorSubscription: Subscription = Subscription.EMPTY;
  private _focusMonitorSubscription: Subscription = Subscription.EMPTY;
  /** Whether the slide-toggle element is checked or not. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value) {
    this._checked = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  @Input()
  disabled = false;
  @Input()
  color = 'primary';
  @Input()
  id = `oui-slide-toggletoggle-${++nextUniqueId}`;

  /** Used to set the aria-label attribute on the underlying input element. */
  @Input('aria-label')
  ariaLabel: string | null = null;

  /** Used to set the aria-labelledby attribute on the underlying input element. */
  @Input('aria-labelledby')
  ariaLabelledby: string | null = null;

  // tslint:disable-next-line:no-output-rename
  @Output('state-change')
  change = new EventEmitter();

  wrapper: ElementRef;

  private onChange = (_: any) => {};
  private onTouched = () => {};
  constructor(
    protected elementRef: ElementRef,
    private _ngZone: NgZone,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(elementRef);
    this.tabIndex = parseInt(tabIndex, 10) || 0;
    this._monitorSubscription = this._focusMonitor
      .monitor(this._elementRef, true)
      .subscribe(() =>
        this._ngZone.run(() => {
          this._changeDetectorRef.markForCheck();
        })
      );
  }
  ngAfterContentInit() {
    this._focusMonitorSubscription = this._focusMonitor
      .monitor(this._elementRef, true)
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          Promise.resolve().then(() => this.onTouched());
        }
      });
  }

  emitChange() {
    if (!this.disabled) {
      this.toggle();
      this.onChange(this.checked);
      this.change.emit(this.checked);
    }
  }

  /** Toggles the checked state of the slide-toggle. */
  toggle() {
    this.checked = !this.checked;
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: any): void {
    this.checked = !!value;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }
  /** Focuses the slide-toggle. */
  focus() {
    this._focusMonitor.focusVia(this.wrapper.nativeElement, 'keyboard');
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._monitorSubscription.unsubscribe();
    this._focusMonitorSubscription.unsubscribe();
  }
}
