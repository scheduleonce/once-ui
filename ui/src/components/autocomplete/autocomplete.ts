import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { OUI_OPTION_PARENT_COMPONENT, OuiOption } from '../core/option/option';
import { OuiOptgroup } from '../core/option/optgroup';

/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueAutocompleteIdCounter = 0;

/** Event object that is emitted when an autocomplete option is selected. */
export class OuiAutocompleteSelectedEvent {
  constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    public source: OuiAutocomplete,
    /** Option that was selected. */
    public option: OuiOption
  ) {}
}

/** Default `oui-autocomplete` options that can be overridden. */
export interface OuiAutocompleteDefaultOptions {
  /** Whether the first option should be highlighted when an autocomplete panel is opened. */
  autoActiveFirstOption?: boolean;
}

/** Injection token to be used to override the default options for `oui-autocomplete`. */
export const OUI_AUTOCOMPLETE_DEFAULT_OPTIONS =
  new InjectionToken<OuiAutocompleteDefaultOptions>(
    'oui-autocomplete-default-options',
    {
      providedIn: 'root',
      factory: OUI_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
    }
  );

/** @docs-private */
export function OUI_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY(): OuiAutocompleteDefaultOptions {
  return { autoActiveFirstOption: false };
}

@Component({
    selector: 'oui-autocomplete',
    templateUrl: 'autocomplete.html',
    styleUrls: ['autocomplete.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'ouiAutocomplete',
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'oui-autocomplete',
    },
    providers: [
        { provide: OUI_OPTION_PARENT_COMPONENT, useExisting: OuiAutocomplete },
    ],
    standalone: false
})
export class OuiAutocomplete implements AfterContentInit {
  /** Manages active item in option list based on key events. */
  _keyManager: ActiveDescendantKeyManager<OuiOption>;

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
  @ContentChildren(OuiOption, { descendants: true })
  options: QueryList<OuiOption>;

  /** @docs-private */
  @ContentChildren(OuiOptgroup)
  optionGroups: QueryList<OuiOptgroup>;

  /** Function that maps an option's control value to its display value in the trigger. */
  @Input()
  displayWith: ((value: any) => string) | null = null;

  /**
   * Whether the first option should be highlighted when the autocomplete panel is opened.
   * Can be configured globally through the `OUI_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
   */
  @Input()
  get autoActiveFirstOption(): boolean {
    return this._autoActiveFirstOption;
  }
  set autoActiveFirstOption(value: boolean) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;

  /**
   * Specify the width of the autocomplete panel.  Can be any CSS sizing value, otherwise it will
   * match the width of its host.
   */
  @Input()
  panelWidth: string | number;

  /** Event that is emitted whenever an option from the list is selected. */
  @Output()
  readonly optionSelected: EventEmitter<OuiAutocompleteSelectedEvent> =
    new EventEmitter<OuiAutocompleteSelectedEvent>();

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output()
  readonly opened: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output()
  readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Takes classes set on the host oui-autocomplete element and applies them to the panel
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
  id: string = `oui-autocomplete-${_uniqueAutocompleteIdCounter++}`;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(OUI_AUTOCOMPLETE_DEFAULT_OPTIONS)
    defaults: OuiAutocompleteDefaultOptions
  ) {
    this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
  }

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager<OuiOption>(
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
    this._classList['oui-autocomplete-visible'] = this.showPanel;
    this._classList['oui-autocomplete-hidden'] = !this.showPanel;
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the `select` event. */
  _emitSelectEvent(option: OuiOption): void {
    const event = new OuiAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }
}
