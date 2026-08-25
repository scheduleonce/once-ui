import { ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { OuiChip, OuiChipEvent } from './chip';
import { OuiChipAction } from './chip-action';
import { OuiChipEditInput } from './chip-edit-input';
import { OUI_CHIP } from './tokens';

/** Represents an event fired on an individual `oui-chip` when it is edited. */
export interface OuiChipEditedEvent extends OuiChipEvent {
  /** The final edit value. */
  value: string;
}

/**
 * An extension of the OuiChip component used with OuiChipGrid and
 * the ouiChipInputFor directive.
 */
@Component({
  selector:
    'oui-chip-row, [oui-chip-row], oui-basic-chip-row, [oui-basic-chip-row]',
  templateUrl: 'chip-row.html',
  styleUrls: ['chip.scss'],
  host: {
    class: 'oui-chip oui-chip-row',
    '[class.oui-chip-with-avatar]': 'leadingIcon',
    '[class.oui-chip--disabled]': 'disabled',
    '[class.oui-chip-editing]': '_isEditing',
    '[class.oui-chip-editable]': 'editable',
    '[class.oui-chip-with-trailing-icon]': '_hasTrailingIcon()',
    '[class.oui-chip-highlighted]': 'highlighted',
    '[id]': 'id',
    '[attr.tabindex]': 'disabled ? null : -1',
    '[attr.aria-label]': 'null',
    '[attr.aria-description]': 'null',
    '[attr.role]': 'role',
    '(focus)': '_handleFocus()',
    '(click)': 'this._hasInteractiveActions() ? _handleClick($event) : null',
    '(dblclick)': '_handleDoubleclick($event)',
  },
  providers: [
    { provide: OuiChip, useExisting: OuiChipRow },
    { provide: OUI_CHIP, useExisting: OuiChipRow },
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [OuiChipAction, OuiChipEditInput],
})
export class OuiChipRow extends OuiChip implements AfterViewInit, OnDestroy {
  protected override basicChipAttrName = 'oui-basic-chip-row';
  private _renderer = inject(Renderer2);
  private _cleanupMousedown: (() => void) | undefined;

  /**
   * The editing action has to be triggered in a timeout. While we're waiting on it, a blur
   * event might occur which will interrupt the editing. This flag is used to avoid interruptions
   * while the editing action is being initialized.
   */
  private _editStartPending = false;

  /** The default chip edit input that is used if none is projected into this chip row. */
  @ViewChild(OuiChipEditInput) defaultEditInput?: OuiChipEditInput;

  /** The projected chip edit input. */
  @ContentChild(OuiChipEditInput) contentEditInput?: OuiChipEditInput;

  /**
   * Set on a mousedown when the chip is already focused via mouse or keyboard.
   *
   * This allows us to ensure chip is already focused when deciding whether to enter the
   * edit mode on a subsequent click. Otherwise, the chip appears focused when handling the
   * first click event.
   */
  private _alreadyFocused = false;

  _isEditing = false;

  @Input() editable: boolean = false;

  /** Emitted when the chip is edited. */
  @Output() readonly edited: EventEmitter<OuiChipEditedEvent> =
    new EventEmitter<OuiChipEditedEvent>();

  constructor() {
    super();

    this.role = 'row';
    this._onBlur.pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this._isEditing && !this._editStartPending) {
        this._onEditFinish();
      }
      this._alreadyFocused = false;
    });
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this._cleanupMousedown = this._renderer.listen(
      this._elementRef.nativeElement,
      'mousedown',
      () => {
        this._alreadyFocused = this._hasFocus();
      }
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._cleanupMousedown?.();
  }

  /** Sends focus to the first gridcell when the user clicks anywhere inside the chip. */
  _handleFocus() {
    if (!this._isEditing && !this.disabled) {
      this.focus();
    }
  }

  _handleClick(event: MouseEvent) {
    if (
      !this.disabled &&
      this.editable &&
      !this._isEditing &&
      this._alreadyFocused
    ) {
      event.preventDefault();
      event.stopPropagation();
      this._startEditing(event);
    }
  }

  _handleDoubleclick(event: MouseEvent) {
    if (!this.disabled && this.editable) {
      this._startEditing(event);
    }
  }

  override _handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ENTER && !this.disabled) {
      if (this._isEditing) {
        event.preventDefault();
        this._onEditFinish();
      } else if (this.editable) {
        this._startEditing(event);
      }
    } else if (this._isEditing) {
      event.stopPropagation();
    } else {
      super._handleKeydown(event);
    }
  }

  override _edit(): void {
    this._changeDetectorRef.markForCheck();
    this._startEditing();
  }

  private _startEditing(event?: Event) {
    if (
      !this.primaryAction ||
      (this.removeIcon &&
        !!event &&
        this._getSourceAction(event.target as Node) === this.removeIcon)
    ) {
      return;
    }

    const value = this.value;

    this._isEditing = this._editStartPending = true;

    afterNextRender(
      () => {
        this._getEditInput().initialize(String(value));

        setTimeout(() =>
          this._ngZone.run(() => (this._editStartPending = false))
        );
      },
      { injector: this._injector }
    );
  }

  private _onEditFinish() {
    this._isEditing = this._editStartPending = false;

    this.edited.emit({ chip: this, value: this._getEditInput().getValue() });

    if (
      this._document.activeElement ===
        this._getEditInput().getNativeElement() ||
      this._document.activeElement === this._document.body
    ) {
      this.primaryAction.focus();
    }
  }

  override _isRippleDisabled(): boolean {
    return super._isRippleDisabled() || this._isEditing;
  }

  /**
   * Gets the projected chip edit input, or the default input if none is projected in.
   */
  private _getEditInput(): OuiChipEditInput {
    return this.contentEditInput || this.defaultEditInput!;
  }
}
