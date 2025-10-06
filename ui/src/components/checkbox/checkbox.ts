import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  EventEmitter,
  Output,
  NgZone,
  ChangeDetectorRef,
  forwardRef,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject,
  HostAttributeToken,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HasTabIndex } from '../core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { mixinColor } from '../core';
import { Subscription } from 'rxjs';
// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

/** Change event object emitted by MatCheckbox. */
export class OuiCheckboxChange {
  /** The source MatCheckbox of the event. */
  source: Checkbox;
  /** The new `checked` value of the checkbox. */
  checked: boolean;
}

export class OuiCheckboxBase {
  constructor(public _elementRef: ElementRef) {}
}

export const OuiCheckboxMixinBase: typeof OuiCheckboxBase =
  mixinColor(OuiCheckboxBase);

/**
 * Represents the different states that require custom transitions between them.
 *
 * @docs-private
 */
export enum TransitionCheckState {
  Init,
  /** The state representing the component when it's becoming checked. */
  Checked,
  /** The state representing the component when it's becoming unchecked. */
  Unchecked,
}

/**
 * Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. A MatCheckbox can be either checked, unchecked, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://github.com/scheduleonce/once-ui/tree/master/ui/src/components/checkbox/README.md
 */
@Component({
  selector: 'oui-checkbox',
  templateUrl: './checkbox.html',
  styleUrls: ['./checkbox.scss'],
  exportAs: 'ouiCheckbox',
  host: {
    class: 'oui-checkbox',
    '[id]': 'id',
    '[attr.tabindex]': 'null',
    '[class.oui-checkbox-checked]': 'checked',
    '[class.oui-checkbox-disabled]': 'disabled',
    '[class.oui-checkbox-label-before]': 'labelPosition == "before"',
  },
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['tabIndex', 'color'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
  standalone: false,
})
export class Checkbox
  extends OuiCheckboxMixinBase
  implements ControlValueAccessor, HasTabIndex, OnDestroy
{
  private _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef: ElementRef<HTMLElement>;
  private _ngZone = inject(NgZone);
  private _focusMonitor = inject(FocusMonitor);

  /**
   * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
   * take precedence so this may be omitted.
   */
  /**
   * Implemented as part of CanColor.
   */
  color = 'primary';

  @Input('aria-label')
  ariaLabel: any = '';

  /**
   * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
   */
  @Input('aria-labelledby')
  ariaLabelledby: any = null;

  private _uniqueId: any = `oui-checkbox-${++nextUniqueId}`;

  /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */

  private _monitorSubscription: Subscription = Subscription.EMPTY;

  @Input()
  id: string = this._uniqueId;

  /** Returns the unique id for the visual hidden input. */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  /** Whether the checkbox is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  private _required: boolean;

  /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
  @Input()
  labelPosition: 'before' | 'after' = 'after';

  /** Name value will be applied to the input element if present */
  @Input()
  name: string | null = null;

  /** Event emitted when the checkbox's `checked` value changes. */
  @Output()
  readonly change: EventEmitter<OuiCheckboxChange> =
    new EventEmitter<OuiCheckboxChange>();

  /** The native `<input type="checkbox">` element */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  /** The value attribute of the native input element */
  @Input()
  value: string;

  /**
   * Whether the checkbox is checked.
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    if (value !== this.checked) {
      this._checked = value;
      this._changeDetectorRef.markForCheck();
    }
  }

  private _checked: any = false;

  /**
   * Whether the checkbox is disabled. This fully overrides the implementation provided by
   * mixinDisabled, but the mixin is still required because mixinTabIndex requires it.
   */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(value: any) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this.disabled) {
      this._disabled = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }

  private _disabled = false;
  private _currentCheckState: TransitionCheckState = TransitionCheckState.Init;
  private _currentAnimationClass = '';

  /**
   * Implemented as part of HasTabIndex.
   */
  tabIndex: any;

  constructor() {
    const _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    const tabIndex = inject(new HostAttributeToken('tabindex'), {
      optional: true,
    })!;

    super(_elementRef);
    this._elementRef = _elementRef;

    this.tabIndex = parseInt(tabIndex, 10) || 0;
    this._monitorSubscription = this._focusMonitor
      .monitor(this._elementRef, true)
      .subscribe(() =>
        this._ngZone.run(() => {
          this._changeDetectorRef.markForCheck();
        })
      );
  }

  _getAriaChecked(): 'true' | 'false' {
    return this.checked ? 'true' : 'false';
  }

  /** Focuses the checkbox. */
  focus(): void {
    this._focusMonitor.focusVia(this._inputElement, 'keyboard');
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._monitorSubscription.unsubscribe();
  }
  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   * Do not toggle on (change) event since IE doesn't fire change event when
   *   indeterminate checkbox is clicked.
   *
   * @param event
   */
  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();

    // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
    if (!this.disabled) {
      this.toggle();
      this._transitionCheckState(
        this._checked
          ? TransitionCheckState.Checked
          : TransitionCheckState.Unchecked
      );

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      this._emitChangeEvent();
    }
  }

  private _transitionCheckState(newState: TransitionCheckState) {
    const oldState = this._currentCheckState;
    const element: HTMLElement = this._elementRef.nativeElement;

    if (oldState === newState) {
      return;
    }
    if (this._currentAnimationClass.length > 0) {
      element.classList.remove(this._currentAnimationClass);
    }

    this._currentAnimationClass =
      this._getAnimationClassForCheckStateTransition(oldState, newState);
    this._currentCheckState = newState;

    if (this._currentAnimationClass.length > 0) {
      element.classList.add(this._currentAnimationClass);

      // Remove the animation class to avoid animation when the checkbox is moved between containers
      const animationClass = this._currentAnimationClass;

      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          element.classList.remove(animationClass);
        }, 1000);
      });
    }
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  private _emitChangeEvent() {
    const event = new OuiCheckboxChange();
    event.source = this;
    event.checked = this.checked;
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
  }

  _onInteractionEvent(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any) {
    this.checked = !!value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
   *
   * @docs-private
   */
  _onTouched: () => any = () => {};

  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  private _getAnimationClassForCheckStateTransition(
    oldState: TransitionCheckState,
    newState: TransitionCheckState
  ): string {
    let animSuffix: any = '';

    switch (oldState) {
      case TransitionCheckState.Init:
        // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
        // [checked] bound to it.
        if (newState === TransitionCheckState.Checked) {
          animSuffix = 'unchecked-checked';
        } else if (newState === TransitionCheckState.Unchecked) {
          animSuffix = 'unchecked-unchecked';
        } else {
          return '';
        }
        break;
      case TransitionCheckState.Unchecked:
        animSuffix =
          newState === TransitionCheckState.Checked ? 'unchecked-checked' : '';
        break;
      case TransitionCheckState.Checked:
        animSuffix =
          newState === TransitionCheckState.Unchecked
            ? 'checked-unchecked'
            : '';
        break;
    }

    return `oui-checkbox-anim-${animSuffix}`;
  }
}
