/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { OUI_TAB_GROUP, OuiTab } from './tab';
import { OuiTabHeader } from './tab-header';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import {
  CanColor,
  CanDisableRipple,
  mixinColor,
  mixinDisableRipple,
  ThemePalette,
} from '../core';
import { merge, Subscription } from 'rxjs';
import { OUI_TABS_CONFIG, OuiTabsConfig } from './tab-config';
import { startWith } from 'rxjs/operators';
import { FocusOrigin } from '@angular/cdk/a11y';

/** Used to generate unique ID's for each tab component */
let nextId = 0;

// Boilerplate for applying mixins to ouiTabGroup.
/** @docs-private */
const _OuiTabGroupMixinBase = mixinColor(
  mixinDisableRipple(
    class {
      constructor(public _elementRef: ElementRef) {}
    }
  ),
  'primary'
);

/** @docs-private */
export interface OuiTabGroupBaseHeader {
  _alignInkBarToSelectedTab(): void;
  updatePagination(): void;
  focusIndex: number;
}

/** Possible positions for the tab header. */
export type OuiTabHeaderPosition = 'above' | 'below';

/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
@Component({
  selector: 'oui-tab-group',
  exportAs: 'ouiTabGroup',
  templateUrl: 'tab-group.html',
  styleUrls: ['tab-group.scss'],
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  // eslint-disable-next-line
  inputs: ['color', 'disableRipple'],
  providers: [
    {
      provide: OUI_TAB_GROUP,
      useExisting: ouiTabGroup,
    },
  ],
  // eslint-disable-next-line
  host: {
    ngSkipHydration: '',
    class: 'oui-mdc-tab-group oui-tab',
    '[class.oui-mdc-tab-group-dynamic-height]': 'dynamicHeight',
    '[class.oui-mdc-tab-group-inverted-header]': 'headerPosition === "below"',
    '[class.oui-mdc-tab-group-stretch-tabs]': 'stretchTabs',
    '[style.--oui-tab-animation-duration]': 'animationDuration',
  },
  standalone: false,
})
export class ouiTabGroup
  extends _OuiTabGroupMixinBase
  implements
    AfterContentInit,
    AfterContentChecked,
    OnDestroy,
    CanColor,
    CanDisableRipple
{
  /**
   * All tabs inside the tab group. This includes tabs that belong to groups that are nested
   * inside the current one. We filter out only the tabs that belong to this group in `_tabs`.
   */
  @ContentChildren(OuiTab, { descendants: true }) _allTabs: QueryList<OuiTab>;
  @ViewChild('tabBodyWrapper') _tabBodyWrapper: ElementRef;
  @ViewChild('tabHeader') _tabHeader: OuiTabHeader;

  /** All of the tabs that belong to the group. */
  _tabs: QueryList<OuiTab> = new QueryList<OuiTab>();

  /** The tab index that should be selected after the content has been checked. */
  private _indexToSelect: number | null = 0;

  /** Index of the tab that was focused last. */
  private _lastFocusedTabIndex: number | null = null;

  /** Snapshot of the height of the tab body wrapper before another tab is activated. */
  private _tabBodyWrapperHeight = 0;

  /** Subscription to tabs being added/removed. */
  private _tabsSubscription = Subscription.EMPTY;

  /** Subscription to changes in the tab labels. */
  private _tabLabelSubscription = Subscription.EMPTY;

  /** Whether the ink bar should fit its width to the size of the tab label content. */
  @Input()
  get fitInkBarToContent(): boolean {
    return this._fitInkBarToContent;
  }
  set fitInkBarToContent(v: BooleanInput) {
    this._fitInkBarToContent = coerceBooleanProperty(v);
    this._changeDetectorRef.markForCheck();
  }
  private _fitInkBarToContent = false;

  /** Whether tabs should be stretched to fill the header. */
  @Input('oui-stretch-tabs')
  get stretchTabs(): boolean {
    return this._stretchTabs;
  }
  set stretchTabs(v: BooleanInput) {
    this._stretchTabs = coerceBooleanProperty(v);
  }
  private _stretchTabs = true;

  /** Whether the tab group should grow to the size of the active tab. */
  @Input()
  get dynamicHeight(): boolean {
    return this._dynamicHeight;
  }

  set dynamicHeight(value: BooleanInput) {
    this._dynamicHeight = coerceBooleanProperty(value);
  }

  private _dynamicHeight = false;

  /** The index of the active tab. */
  @Input()
  get selectedIndex(): number | null {
    return this._selectedIndex;
  }

  set selectedIndex(value: NumberInput) {
    this._indexToSelect = coerceNumberProperty(value, null);
  }

  private _selectedIndex: number | null = null;

  /** Position of the tab header. */
  @Input() headerPosition: OuiTabHeaderPosition = 'above';

  /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
  @Input()
  get animationDuration(): string {
    return this._animationDuration;
  }

  set animationDuration(value: NumberInput) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this._animationDuration = /^\d+$/.test(value + '') // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ? value + 'ms'
      : (value as string);
  }

  private _animationDuration: string;

  /**
   * `tabindex` to be set on the inner element that wraps the tab content. Can be used for improved
   * accessibility when the tab does not have focusable elements or if it has scrollable content.
   * The `tabindex` will be removed automatically for inactive tabs.
   * Read more at https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
   */
  @Input()
  get contentTabIndex(): number | null {
    return this._contentTabIndex;
  }

  set contentTabIndex(value: NumberInput) {
    this._contentTabIndex = coerceNumberProperty(value, null);
  }

  private _contentTabIndex: number | null;

  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   */
  @Input()
  get disablePagination(): boolean {
    return this._disablePagination;
  }

  set disablePagination(value: BooleanInput) {
    this._disablePagination = coerceBooleanProperty(value);
  }

  private _disablePagination = false;

  /**
   * By default tabs remove their content from the DOM while it's off-screen.
   * Setting this to `true` will keep it in the DOM which will prevent elements
   * like iframes and videos from reloading next time it comes back into the view.
   */
  @Input()
  get preserveContent(): boolean {
    return this._preserveContent;
  }

  set preserveContent(value: BooleanInput) {
    this._preserveContent = coerceBooleanProperty(value);
  }

  private _preserveContent = false;

  /** Background color of the tab group. */
  @Input()
  get backgroundColor(): ThemePalette {
    return this._backgroundColor;
  }

  set backgroundColor(value: ThemePalette) {
    const classList: DOMTokenList = this._elementRef.nativeElement.classList;

    classList.remove(
      'oui-tabs-with-background',
      `oui-background-${this.backgroundColor}`
    );

    if (value) {
      classList.add('oui-tabs-with-background', `oui-background-${value}`);
    }

    this._backgroundColor = value;
  }

  private _backgroundColor: ThemePalette;

  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  @Output() readonly selectedIndexChange: EventEmitter<number> =
    new EventEmitter<number>();

  /** Event emitted when focus has changed within a tab group. */
  @Output() readonly focusChange: EventEmitter<OuiTabChangeEvent> =
    new EventEmitter<OuiTabChangeEvent>();

  /** Event emitted when the body animation has completed */
  @Output() readonly animationDone: EventEmitter<void> =
    new EventEmitter<void>();

  /** Event emitted when the tab selection has changed. */
  @Output() readonly selectedTabChange: EventEmitter<OuiTabChangeEvent> =
    new EventEmitter<OuiTabChangeEvent>(true);

  private _groupId: number;
  getHTMLText: any;
  updatedTabHTML: any;

  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(OUI_TABS_CONFIG) @Optional() defaultConfig?: OuiTabsConfig,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string
  ) {
    super(elementRef);
    this._groupId = nextId++;
    this.animationDuration =
      defaultConfig && defaultConfig.animationDuration
        ? defaultConfig.animationDuration
        : '500ms';
    this.disablePagination =
      defaultConfig && defaultConfig.disablePagination != null
        ? defaultConfig.disablePagination
        : false;
    this.dynamicHeight =
      defaultConfig && defaultConfig.dynamicHeight != null
        ? defaultConfig.dynamicHeight
        : false;
    this.contentTabIndex = defaultConfig?.contentTabIndex ?? null;
    this.preserveContent = !!defaultConfig?.preserveContent;
    this.fitInkBarToContent =
      defaultConfig && defaultConfig.fitInkBarToContent != null
        ? defaultConfig.fitInkBarToContent
        : false;
    this.stretchTabs =
      defaultConfig && defaultConfig.stretchTabs != null
        ? defaultConfig.stretchTabs
        : false;
  }

  /**
   * After the content is checked, this component knows what tabs have been defined
   * and what the selected index should be. This is where we can know exactly what position
   * each tab should be in according to the new selected index, and additionally we know how
   * a new selected tab should transition in (from the left or right).
   */
  ngAfterContentChecked() {
    // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
    // the amount of tabs changes before the actual change detection runs.
    const indexToSelect = (this._indexToSelect = this._clampTabIndex(
      this._indexToSelect
    ));

    // If there is a change in selected index, emit a change event. Should not trigger if
    // the selected index has not yet been initialized.
    if (this._selectedIndex != indexToSelect) {
      const isFirstRun = this._selectedIndex == null;

      if (!isFirstRun) {
        this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
        // Preserve the height so page doesn't scroll up during tab change.
        // Fixes https://stackblitz.com/edit/mat-tabs-scroll-page-top-on-tab-change
        const wrapper = this._tabBodyWrapper.nativeElement;
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        wrapper.style.minHeight = wrapper.clientHeight + 'px';
      }

      // Changing these values after change detection has run
      // since the checked content may contain references to them.
      Promise.resolve().then(() => {
        this._tabs.forEach(
          (tab, index) => (tab.isActive = index === indexToSelect)
        );

        if (!isFirstRun) {
          this.selectedIndexChange.emit(indexToSelect);
          // Clear the min-height, this was needed during tab change to avoid
          // unnecessary scrolling.
          this._tabBodyWrapper.nativeElement.style.minHeight = '';
        }
      });
    }
    // Setup the position for each tab and optionally setup an origin on the next selected tab.
    this._tabs.forEach((tab: OuiTab, index: number) => {
      tab.position = index - indexToSelect;

      // If there is already a selected tab, then set up an origin for the next selected tab
      // if it doesn't have one already.
      if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
        tab.origin = indexToSelect - this._selectedIndex;
      }
    });

    if (this._selectedIndex !== indexToSelect) {
      this._selectedIndex = indexToSelect;
      this._lastFocusedTabIndex = null;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this._subscribeToAllTabChanges();
      this._subscribeToTabLabels();
    });
    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    this._tabsSubscription = this._tabs.changes.subscribe(() => {
      const indexToSelect = this._clampTabIndex(this._indexToSelect);

      // Maintain the previously-selected tab if a new tab is added or removed and there is no
      // explicit change that selects a different tab.
      if (indexToSelect === this._selectedIndex) {
        const tabs = this._tabs.toArray();
        let selectedTab: OuiTab | undefined;

        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].isActive) {
            // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
            // event, otherwise the consumer may end up in an infinite loop in some edge cases like
            // adding a tab within the `selectedIndexChange` event.
            this._indexToSelect = this._selectedIndex = i;
            this._lastFocusedTabIndex = null;
            selectedTab = tabs[i];
            break;
          }
        }

        // If we haven't found an active tab and a tab exists at the selected index, it means
        // that the active tab was swapped out. Since this won't be picked up by the rendering
        // loop in `ngAfterContentChecked`, we need to sync it up manually.
        if (!selectedTab && tabs[indexToSelect]) {
          Promise.resolve().then(() => {
            tabs[indexToSelect].isActive = true;
            this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
          });
        }
      }

      this._changeDetectorRef.markForCheck();
    });
  }

  /** Listens to changes in all of the tabs. */
  private _subscribeToAllTabChanges() {
    // Since we use a query with `descendants: true` to pick up the tabs, we may end up catching
    // some that are inside of nested tab groups. We filter them out manually by checking that
    // the closest group to the tab is the current one.
    this.getHTMLText = this._allTabs['_results'][0].contentWithin;
    this.updatedTabHTML = this.getHTMLText;
    this._allTabs.changes
      .pipe(startWith(this._allTabs))
      .subscribe((tabs: QueryList<OuiTab>) => {
        this._tabs.reset(
          tabs.filter((tab) => {
            return tab._closestTabGroup === this || !tab._closestTabGroup;
          })
        );
        this._tabs.notifyOnChanges();
      });
  }

  ngOnDestroy() {
    this._tabs.destroy();
    this._tabsSubscription.unsubscribe();
    this._tabLabelSubscription.unsubscribe();
  }

  /** Re-aligns the ink bar to the selected tab element. */
  realignInkBar() {
    if (this._tabHeader) {
      this._tabHeader._alignInkBarToSelectedTab();
    }
  }

  /**
   * Recalculates the tab group's pagination dimensions.
   *
   * WARNING: Calling this method can be very costly in terms of performance. It should be called
   * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
   * page.
   */
  updatePagination() {
    if (this._tabHeader) {
      this._tabHeader.updatePagination();
    }
  }

  /**
   * Sets focus to a particular tab.
   * @param index Index of the tab to be focused.
   */
  focusTab(index: number) {
    const header = this._tabHeader;

    if (header) {
      header.focusIndex = index;
    }
  }

  _focusChanged(index: number) {
    this._lastFocusedTabIndex = index;
    this.focusChange.emit(this._createChangeEvent(index));
  }

  private _createChangeEvent(index: number): OuiTabChangeEvent {
    const event = new OuiTabChangeEvent();
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs.toArray()[index];
      this.updatedTabHTML = event.tab.contentWithin;
    }
    return event;
  }

  _handleEnter() {
    this.getHTMLText = this.updatedTabHTML;
  }

  /**
   * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
   * on the OuiTab component, whereas the data binding is inside the ouiTabGroup. In order for the
   * binding to be updated, we need to subscribe to changes in it and trigger change detection
   * manually.
   */
  private _subscribeToTabLabels() {
    if (this._tabLabelSubscription) {
      this._tabLabelSubscription.unsubscribe();
    }

    this._tabLabelSubscription = merge(
      ...this._tabs.map((tab) => tab._stateChanges)
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }

  /** Clamps the given index to the bounds of 0 and the tabs length. */
  private _clampTabIndex(index: number | null): number {
    // Note the `|| 0`, which ensures that values like NaN can't get through
    // and which would otherwise throw the component into an infinite loop
    // (since Math.max(NaN, 0) === NaN).
    return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
  }

  /** Returns a unique id for each tab label element */
  _getTabLabelId(i: number): string {
    return `oui-tab-label-${this._groupId}-${i}`;
  }

  /** Returns a unique id for each tab content element */
  _getTabContentId(i: number): string {
    return `oui-tab-content-${this._groupId}-${i}`;
  }

  /**
   * Sets the height of the body wrapper to the height of the activating tab if dynamic
   * height property is true.
   */
  _setTabBodyWrapperHeight(tabHeight: number): void {
    if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
      return;
    }

    const wrapper: HTMLElement = this._tabBodyWrapper.nativeElement;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    wrapper.style.height = this._tabBodyWrapperHeight + 'px';

    // This conditional forces the browser to paint the height so that
    // the animation to the new height can have an origin.
    if (this._tabBodyWrapper.nativeElement.offsetHeight) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      wrapper.style.height = tabHeight + 'px';
    }
  }

  /** Removes the height of the tab body wrapper. */
  _removeTabBodyWrapperHeight(): void {
    const wrapper = this._tabBodyWrapper.nativeElement;
    this._tabBodyWrapperHeight = wrapper.clientHeight;
    wrapper.style.height = '';
    this.animationDone.emit();
  }

  /** Handle click events, setting new selected index if appropriate. */
  _handleClick(tab: OuiTab, tabHeader: OuiTabGroupBaseHeader, index: number) {
    tabHeader.focusIndex = index;
    this.getHTMLText = this.updatedTabHTML;

    if (!tab.disabled) {
      this.selectedIndex = index;
    }
  }

  /** Retrieves the tabindex for the tab. */
  _getTabIndex(index: number): number {
    const targetIndex = this._lastFocusedTabIndex ?? this.selectedIndex;
    return index === targetIndex ? 0 : -1;
  }

  /** Callback for when the focused state of a tab has changed. */
  _tabFocusChanged(focusOrigin: FocusOrigin, index: number) {
    // Mouse/touch focus happens during the `mousedown`/`touchstart` phase which
    // can cause the tab to be moved out from under the pointer, interrupting the
    // click sequence (see #21898). We don't need to scroll the tab into view for
    // such cases anyway, because it will be done when the tab becomes selected.
    if (focusOrigin && focusOrigin !== 'mouse' && focusOrigin !== 'touch') {
      this._tabHeader.focusIndex = index;
    }
  }
}

/** A simple change event emitted on focus or selection changes. */
export class OuiTabChangeEvent {
  /** Index of the currently-selected tab. */
  index: number;
  /** Reference to the currently-selected tab. */
  tab: OuiTab;
  event: Event;
}
