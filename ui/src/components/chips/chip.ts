import { FocusMonitor, _IdGenerator } from '@angular/cdk/a11y';
import { BACKSPACE, DELETE } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DOCUMENT,
} from '@angular/core';
import { Subject, Subscription, merge } from 'rxjs';
import { OuiChipAction, OuiChipContent } from './chip-action';
import {
  OuiChipAvatar,
  OuiChipEdit,
  OuiChipRemove,
  OuiChipTrailingIcon,
} from './chip-icons';
import {
  OUI_CHIP,
  OUI_CHIP_AVATAR,
  OUI_CHIP_EDIT,
  OUI_CHIP_REMOVE,
  OUI_CHIP_TRAILING_ICON,
} from './tokens';

/** Represents an event fired on an individual `oui-chip`. */
export interface OuiChipEvent {
  /** The chip the event was fired on. */
  chip: OuiChip;
}

/**
 * Once UI styled Chip base component. Used inside the OuiChipSet component.
 *
 * Extended by OuiChipOption and OuiChipRow for different interaction patterns.
 */
@Component({
  selector: 'oui-basic-chip, [oui-basic-chip], oui-chip, [oui-chip]',
  exportAs: 'ouiChip',
  templateUrl: 'chip.html',
  styleUrls: ['chip.scss'],
  host: {
    class: 'oui-chip',
    '[class]': '"oui-" + (color || "primary")',
    '[class.oui-chip--basic]': '_isBasicChip',
    '[class.oui-chip--standard]': '!_isBasicChip',
    '[class.oui-chip--disabled]': 'disabled',
    '[class.oui-chip-with-trailing-icon]': '_hasTrailingIcon()',
    '[class.oui-chip-with-avatar]': 'leadingIcon',
    '[class.oui-chip-highlighted]': 'highlighted',
    '[id]': 'id',
    '[attr.role]': 'role',
    '[attr.aria-label]': 'ariaLabel',
    '(keydown)': '_handleKeydown($event)',
  },
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: OUI_CHIP, useExisting: OuiChip }],
  imports: [OuiChipContent],
})
export class OuiChip
  implements OnInit, AfterViewInit, AfterContentInit, DoCheck, OnDestroy
{
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _ngZone = inject(NgZone);
  private _focusMonitor = inject(FocusMonitor);

  protected _document = inject(DOCUMENT);

  /** Emits when the chip is focused. */
  readonly _onFocus = new Subject<OuiChipEvent>();

  /** Emits when the chip is blurred. */
  readonly _onBlur = new Subject<OuiChipEvent>();

  /** Whether this chip is a basic (unstyled) chip. */
  _isBasicChip = false;

  /** Role for the root of the chip. */
  @Input() role: string | null = null;

  /** Whether the chip has focus. */
  private _hasFocusInternal = false;

  /** Whether moving focus into the chip is pending. */
  private _pendingFocus: boolean = false;

  /** Subscription to changes in the chip's actions. */
  private _actionChanges: Subscription | undefined;

  /** All avatars present in the chip. */
  @ContentChildren(OUI_CHIP_AVATAR, { descendants: true })
  protected _allLeadingIcons!: QueryList<OuiChipAvatar>;

  /** All trailing icons present in the chip. */
  @ContentChildren(OUI_CHIP_TRAILING_ICON, { descendants: true })
  protected _allTrailingIcons!: QueryList<OuiChipTrailingIcon>;

  /** All edit icons present in the chip. */
  @ContentChildren(OUI_CHIP_EDIT, { descendants: true })
  protected _allEditIcons!: QueryList<OuiChipEdit>;

  /** All remove icons present in the chip. */
  @ContentChildren(OUI_CHIP_REMOVE, { descendants: true })
  protected _allRemoveIcons!: QueryList<OuiChipRemove>;

  _hasFocus() {
    return this._hasFocusInternal;
  }

  /** A unique id for the chip. If none is supplied, it will be auto-generated. */
  @Input() id: string = inject(_IdGenerator).getId('oui-chip-');

  /** ARIA label for the content of the chip. */
  @Input('aria-label') ariaLabel: string | null = null;

  /** ARIA description for the content of the chip. */
  @Input('aria-description') ariaDescription: string | null = null;

  /** Whether the chip list is disabled. */
  _chipListDisabled: boolean = false;

  /** Whether the chip was focused when it was removed. */
  _hadFocusOnRemove = false;

  private _textElement!: HTMLElement;

  /**
   * The value of the chip. Defaults to the content inside
   * the `oui-chip-action-label` element.
   */
  @Input()
  get value(): any {
    return this._value !== undefined
      ? this._value
      : this._textElement?.textContent?.trim();
  }
  set value(value: any) {
    this._value = value;
  }
  protected _value: any;

  /**
   * Color theme of the chip. Accepts primary, accent or warn.
   */
  @Input() color?: string | null;

  /**
   * Determines whether or not the chip displays the remove styling and emits (removed) events.
   */
  @Input({ transform: booleanAttribute })
  removable: boolean = true;

  /**
   * Colors the chip for emphasis as if it were selected.
   */
  @Input({ transform: booleanAttribute })
  highlighted: boolean = false;

  /** Whether the ripple effect is disabled or not. */
  @Input({ transform: booleanAttribute })
  disableRipple: boolean = false;

  /** Whether the chip is disabled. */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled || this._chipListDisabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled = false;

  /** Emitted when a chip is to be removed. */
  @Output() readonly removed: EventEmitter<OuiChipEvent> =
    new EventEmitter<OuiChipEvent>();

  /** Emitted when the chip is destroyed. */
  @Output() readonly destroyed: EventEmitter<OuiChipEvent> =
    new EventEmitter<OuiChipEvent>();

  /** The unstyled chip selector for this component. */
  protected basicChipAttrName = 'oui-basic-chip';

  /** The chip's leading icon. */
  @ContentChild(OUI_CHIP_AVATAR) leadingIcon!: OuiChipAvatar;

  /** The chip's leading edit icon. */
  @ContentChild(OUI_CHIP_EDIT) editIcon!: OuiChipEdit;

  /** The chip's trailing icon. */
  @ContentChild(OUI_CHIP_TRAILING_ICON) trailingIcon!: OuiChipTrailingIcon;

  /** The chip's trailing remove icon. */
  @ContentChild(OUI_CHIP_REMOVE) removeIcon!: OuiChipRemove;

  /** Action receiving the primary set of user interactions. */
  @ViewChild(OuiChipAction) primaryAction!: OuiChipAction;

  protected _injector = inject(Injector);

  constructor() {
    this._monitorFocus();
  }

  ngOnInit() {
    const tagName = this._elementRef.nativeElement.tagName.toLowerCase();
    this._isBasicChip =
      this._elementRef.nativeElement.hasAttribute(this.basicChipAttrName) ||
      tagName === this.basicChipAttrName;
  }

  ngAfterViewInit() {
    this._textElement = this._elementRef.nativeElement.querySelector(
      '.oui-chip-action-label'
    )!;

    if (this._pendingFocus) {
      this._pendingFocus = false;
      this.focus();
    }
  }

  ngAfterContentInit(): void {
    this._actionChanges = merge(
      this._allLeadingIcons.changes,
      this._allTrailingIcons.changes,
      this._allRemoveIcons.changes
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngDoCheck(): void {
    // Reserved for subclasses. Kept as part of the MatChip-compatible API.
  }

  ngOnDestroy() {
    this.destroyed.emit({ chip: this });
    this.destroyed.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._actionChanges?.unsubscribe();
  }

  /**
   * Allows for programmatic removal of the chip.
   *
   * Informs any listeners of the removal request. Does not remove the chip from the DOM.
   */
  remove(): void {
    if (this.removable) {
      this._hadFocusOnRemove = this._hasFocus();
      this.removed.emit({ chip: this });
    }
  }

  /** Whether or not the ripple should be disabled. */
  _isRippleDisabled(): boolean {
    return (
      this.disabled ||
      this.disableRipple ||
      this._isBasicChip ||
      !this._hasInteractiveActions()
    );
  }

  /** Returns whether the chip has a trailing icon. */
  _hasTrailingIcon() {
    return !!(this.trailingIcon || this.removeIcon);
  }

  /** Returns whether the chip has a leading action icon. */
  _hasLeadingActionIcon() {
    return !!this.editIcon;
  }

  /** Returns whether the chip has a leading graphic. */
  _hasLeadingGraphic() {
    return !!this.leadingIcon;
  }

  /** Handles keyboard events on the chip. */
  _handleKeydown(event: KeyboardEvent) {
    if (
      (event.keyCode === BACKSPACE && !event.repeat) ||
      event.keyCode === DELETE
    ) {
      event.preventDefault();
      this.remove();
    }
  }

  /** Allows for programmatic focusing of the chip. */
  focus(): void {
    if (!this.disabled) {
      if (this.primaryAction) {
        this.primaryAction.focus();
      } else {
        this._pendingFocus = true;
      }
    }
  }

  /** Gets the action that contains a specific target node. */
  _getSourceAction(target: Node): OuiChipAction | undefined {
    return this._getActions().find((action) => {
      const element = action._elementRef.nativeElement;
      return element === target || element.contains(target);
    });
  }

  /** Gets all of the actions within the chip. */
  _getActions(): OuiChipAction[] {
    const result: OuiChipAction[] = [];

    if (this.primaryAction) {
      result.push(this.primaryAction);
    }

    if (this.editIcon) {
      result.push(this.editIcon);
    }

    if (this.removeIcon) {
      result.push(this.removeIcon);
    }

    return result;
  }

  /** Handles interactions with the primary action of the chip. */
  _handlePrimaryActionInteraction() {
    // Empty here, but is overwritten in child classes.
  }

  /** Returns whether the chip has any interactive actions. */
  _hasInteractiveActions(): boolean {
    return this._getActions().length > 0;
  }

  /** Handles interactions with the edit action of the chip. */
  _edit(_event: Event) {
    // Empty here, but is overwritten in child classes.
  }

  /** Starts the focus monitoring process on the chip. */
  private _monitorFocus() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe((origin) => {
      const hasFocus = origin !== null;

      if (hasFocus !== this._hasFocusInternal) {
        this._hasFocusInternal = hasFocus;

        if (hasFocus) {
          this._onFocus.next({ chip: this });
        } else {
          this._changeDetectorRef.markForCheck();
          setTimeout(() =>
            this._ngZone.run(() => this._onBlur.next({ chip: this }))
          );
        }
      }
    });
  }
}
