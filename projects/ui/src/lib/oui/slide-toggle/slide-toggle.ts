import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { mixinColor } from '../core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
let nextUniqueId = 0;
/**
 * Boilerplate for applying mixins to OuiSlideToggle.
 * @docs-private
 */
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
    '[class.oui-disabled]': 'disabled'
  },
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled'],
  styleUrls: ['./slide-toggle.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class OuiSlideToggle extends _OuiSlideToggleMixinBase {
  private _checked = false;
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

  constructor(
    protected elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);
  }

  emitChange() {
    if (!this.disabled) {
      this.toggle();
      this.change.emit(this.checked);
    }
  }

  /** Toggles the checked state of the slide-toggle. */
  toggle() {
    this.checked = !this.checked;
  }

  /** Focuses the slide-toggle. */
  focus() {
    this._focusMonitor.focusVia(this.wrapper.nativeElement, 'program');
  }
}
