import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  InjectionToken,
  Input,
  QueryList,
  booleanAttribute,
  input,
  output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { CHIPS_OPTION_PARENT_COMPONENT, ChipsOption } from './chips-option';
import { OuiOptgroup } from '../core/option/optgroup';

/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueAutocompleteIdCounter = 0;

/** Event object that is emitted when an autocomplete option is selected. */
export class ChipsAutocompleteSelectedEvent {
  constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    public source: ChipsAutocomplete,
    /** Option that was selected. */
    public option: ChipsOption
  ) {}
}

/** Default `oui-chips-autocomplete` options that can be overridden. */
export interface ChipsAutocompleteDefaultOptions {
  /** Whether the first option should be highlighted when an autocomplete panel is opened. */
  autoActiveFirstOption?: boolean;
}

/** Injection token to be used to override the default options for `oui-chips-autocomplete`. */
export const CHIPS_AUTOCOMPLETE_DEFAULT_OPTIONS =
  new InjectionToken<ChipsAutocompleteDefaultOptions>(
    'oui-chips-autocomplete-default-options',
    {
      providedIn: 'root',
      factory: (): ChipsAutocompleteDefaultOptions => ({
        autoActiveFirstOption: false,
      }),
    }
  );

@Component({
  selector: 'oui-chips-autocomplete',
  templateUrl: '../autocomplete/autocomplete.html',
  styleUrls: ['../autocomplete/autocomplete.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'ouiChipsAutocomplete',
  host: {
    class: 'oui-autocomplete',
  },
  providers: [
    { provide: CHIPS_OPTION_PARENT_COMPONENT, useExisting: ChipsAutocomplete },
  ],
  standalone: false,
})
export class ChipsAutocomplete implements AfterContentInit {
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Manages active item in option list based on key events. */
  _keyManager: ActiveDescendantKeyManager<ChipsOption>;

  /** Whether the autocomplete panel should be visible, depending on option length. */
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  showPanel: boolean = false;

  /** Whether the autocomplete panel is open. */
  get isOpen(): boolean {
    return this._isOpen && this.showPanel;
  }
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  _isOpen: boolean = false;

  /** @docs-private */
  @ViewChild(TemplateRef)
  template: TemplateRef<any>;

  /** Element for the panel containing the autocomplete options. */
  @ViewChild('panel')
  panel: ElementRef;

  /** @docs-private */
  @ContentChildren(ChipsOption, { descendants: true })
  options: QueryList<ChipsOption>;

  /** @docs-private */
  @ContentChildren(OuiOptgroup)
  optionGroups: QueryList<OuiOptgroup>;

  /** Function that maps an option's control value to its display value in the trigger. */
  readonly displayWith = input<((value: any) => string) | null>(null);

  /**
   * Whether the first option should be highlighted when the autocomplete panel is opened.
   * Can be configured globally through the `CHIPS_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
   */
  readonly autoActiveFirstOption = input(
    !!inject(CHIPS_AUTOCOMPLETE_DEFAULT_OPTIONS).autoActiveFirstOption,
    { transform: booleanAttribute }
  );

  /**
   * Specify the width of the autocomplete panel.  Can be any CSS sizing value, otherwise it will
   * match the width of its host.
   */
  readonly panelWidth = input<string | number>();

  /** Event that is emitted whenever an option from the list is selected. */
  readonly optionSelected = output<ChipsAutocompleteSelectedEvent>();

  /** Event that is emitted when the autocomplete panel is opened. */
  readonly opened = output<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  readonly closed = output<void>();

  /**
   * Takes classes set on the host oui-chips-autocomplete element and applies them to the panel
   * inside the overlay container to allow for easy styling.
   */
  @Input('class')
  set classList(value: string) {
    if (value && value.length) {
      value
        .split(' ')
        .forEach((className) => (this._classList[className.trim()] = true));
      this._elementRef.nativeElement.className = '';
    }
  }
  _classList: { [key: string]: boolean } = {};

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  id: string = `oui-chips-autocomplete-${_uniqueAutocompleteIdCounter++}`;

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager<ChipsOption>(
      this.options
    ).withWrap();
    // Set the initial visibility state.
    this._setVisibility();
  }

  /**
   * Sets the panel scrollTop. This allows us to manually scroll to display options
   * above or below the fold, as they are not actually being focused when active.
   */
  _setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }

  /** Returns the panel's scrollTop. */
  _getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  /** Panel should hide itself when the option list is empty. */
  _setVisibility() {
    this.showPanel = !!this.options.length;
    this._classList = {
      ...this._classList,
      'oui-autocomplete-visible': this.showPanel,
      'oui-autocomplete-hidden': !this.showPanel,
    };
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the `select` event. */
  _emitSelectEvent(option: ChipsOption): void {
    const event = new ChipsAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }
}
