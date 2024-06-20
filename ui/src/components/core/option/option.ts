import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { OuiOptgroup } from './optgroup';
import { FocusMonitor } from '@angular/cdk/a11y';

/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueIdCounter = 0;

/** Event object emitted by OuiOption when selected or deselected. */
export class OuiOptionSelectionChange {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: OuiOption,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput = false
  ) {}
}

/**
 * Describes a parent component that manages a list of options.
 * Contains properties that the options can inherit.
 *
 * @docs-private
 */
export interface OuiOptionParentComponent {
  multiple?: boolean;
}

/**
 * Injection token used to provide the parent component to options.
 */
export const OUI_OPTION_PARENT_COMPONENT =
  new InjectionToken<OuiOptionParentComponent>('OUI_OPTION_PARENT_COMPONENT');

/**
 * Single option inside of a `<oui-select>` element.
 */
@Component({
  selector: 'oui-option',
  exportAs: 'ouiOption',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    role: 'option',
    '[attr.tabindex]': '_getTabIndex()',
    '[class.oui-selected]': 'selected',
    '[class.oui-option-multiple]': 'multiple',
    '[class.oui-active]': 'active',
    '[id]': 'id',
    '[attr.aria-selected]': 'selected.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class.oui-option-disabled]': 'disabled',
    '(click)': '_selectViaInteraction()',
    '(keydown)': '_handleKeydown($event)',
    class: 'oui-option',
  },
  styleUrls: ['option.scss'],
  templateUrl: 'option.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OuiOption implements AfterViewChecked, OnDestroy {
  private _selected = false;
  private _active = false;
  private _disabled = false;
  private _mostRecentViewValue = '';
  private _monitorSubscription: Subscription = Subscription.EMPTY;

  /** Whether the wrapping component is in multiple selection mode. */
  get multiple() {
    return this._parent && this._parent.multiple;
  }

  /** Whether or not the option is currently selected. */
  get selected(): boolean {
    return this._selected;
  }

  /** The form value of the option. */
  @Input()
  value: any;

  /** The unique ID of the option. */
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  id = `oui-option-${_uniqueIdCounter++}`;

  /** Whether the option is disabled. */
  @Input()
  get disabled() {
    return (this.group && this.group.disabled) || this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }

  /** Event emitted when the option is selected or deselected. */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onSelectionChange = new EventEmitter<OuiOptionSelectionChange>();

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly _stateChanges = new Subject<void>();

  constructor(
    private _element: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    protected elementRef: ElementRef<HTMLElement>,
    private _focusMonitor: FocusMonitor,
    private _ngZone: NgZone,
    @Optional()
    @Inject(OUI_OPTION_PARENT_COMPONENT)
    private _parent: OuiOptionParentComponent,
    @Optional() readonly group: OuiOptgroup
  ) {
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));
  }

  /**
   * Whether or not the option is currently active and ready to be selected.
   * An active option displays styles as if it is focused, but the
   * focus is actually retained somewhere else. This comes in handy
   * for components like autocomplete where focus must remain on the input.
   */
  get active(): boolean {
    return this._active;
  }

  /**
   * The displayed value of the option. It is necessary to show the selected option in the
   * select's trigger.
   */
  get viewValue(): string {
    return (this._getHostElement().textContent || '').trim();
  }

  /**
   * The displayed value of the option. It is necessary to show the selected option in the
   * select's trigger.
   */
  get viewValueForSelect(): string {
    return this._getHostElement().querySelector('.oui-option-text').innerHTML;
  }

  /** Selects the option. */
  select(): void {
    if (!this._selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Deselects the option. */
  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Sets focus onto this option. */
  focus(): void {
    const element = this._getHostElement();

    if (typeof element.focus === 'function') {
      element.focus();
    }
  }

  /**
   * This method sets display styles on the option to make it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      setTimeout((_) => {
        const focusedElement = document.querySelector(
          '.oui-active'
        ) as HTMLElement;
        const multiSelect = document.querySelector(
          '.oui-option-pseudo-checkbox'
        ) as HTMLElement;
        const ouiSearch = document.querySelector('.oui-select-search-input');
        if (focusedElement && !multiSelect && !ouiSearch) {
          focusedElement?.focus();
        }
      });
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * This method removes display styles on the option that made it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    return this.viewValue;
  }

  /** Ensures the option is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  /**
   * `Selects the option while indicating the selection came from the user. Used to
   * determine if the select's view -> model callback should be invoked.`
   */
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = this.multiple ? !this._selected : true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** Returns the correct tabindex for the option depending on disabled state. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Gets the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }

  ngAfterViewChecked() {
    // Since parent components could be using the option's label to display the selected values
    // (e.g. `oui-select`) and they don't have a way of knowing if the option's label has changed
    // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
    // relatively cheap, however we still limit them only to selected options in order to avoid
    // hitting the DOM too often.
    if (this._selected) {
      const viewValue = this.viewValue;

      if (viewValue !== this._mostRecentViewValue) {
        this._mostRecentViewValue = viewValue;
        this._stateChanges.next();
      }
    }
  }

  ngOnDestroy() {
    this._stateChanges.complete();
    this._monitorSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this.elementRef);
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(
      new OuiOptionSelectionChange(this, isUserInput)
    );
  }
}

/**
 * Counts the amount of option group labels that precede the specified option.
 *
 * @param optionIndex Index of the option at which to start counting.
 * @param options Flat list of all of the options.
 * @param optionGroups Flat list of all of the option groups.
 * @docs-private
 */
export function _countGroupLabelsBeforeOption(
  optionIndex: number,
  options: QueryList<OuiOption>,
  optionGroups: QueryList<OuiOptgroup>
): number {
  if (optionGroups.length) {
    const optionsArray = options.toArray();
    const groups = optionGroups.toArray();
    let groupCounter = 0;

    for (let i = 0; i <= optionIndex; i++) {
      if (
        optionsArray[i].group &&
        optionsArray[i].group === groups[groupCounter]
      ) {
        groupCounter++;
      }
    }

    return groupCounter;
  }

  return 0;
}

/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 *
 * @param optionIndex Index of the option to be scrolled into the view.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function _getOptionScrollPosition(
  optionIndex: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number,
  selectedOptionOffset?: number
): number {
  const optionOffset = selectedOptionOffset || optionIndex * optionHeight;

  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}
