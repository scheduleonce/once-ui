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
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import {
  CanDisable,
  CanDisableRipple,
  HasTabIndex,
  mixinDisabled,
  mixinDisableRipple,
  mixinTabIndex,
  ThemePalette,
} from '../../core';
import { FocusableOption, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';
import { OuiInkBar, mixinInkBarItem } from '../ink-bar';
import {
  BooleanInput,
  coerceBooleanProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import { BehaviorSubject, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { OUI_TABS_CONFIG, OuiTabsConfig } from '../tab-config';
import { OuiPaginatedTabHeader } from '../paginated-tab-header';
// import { isDevMode } from '@angular/core';

// Increasing integer for generating unique ids for tab nav components.
let nextUniqueId = 0;

/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[oui-tab-nav-bar]',
  exportAs: 'OuiTabNavBar, OuiTabNav',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color'],
  templateUrl: 'tab-nav-bar.html',
  styleUrls: ['tab-nav-bar.scss'],
  host: {
    '[attr.role]': '_getRole()',
    class: 'oui-mdc-tab-nav-bar oui-mdc-tab-header oui-tab',
    '[class.oui-mdc-tab-header-pagination-controls-enabled]':
      '_showPaginationControls',
    '[class.oui-mdc-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
    '[class.oui-mdc-tab-nav-bar-stretch-tabs]': 'stretchTabs',
    '[class.oui-primary]': 'color !== "warn" && color !== "accent"',
    '[class.oui-accent]': 'color === "accent"',
    '[class.oui-warn]': 'color === "warn"',
    '[class._oui-animation-noopable]': '_animationMode === "NoopAnimations"',
    '[style.--oui-tab-animation-duration]': 'animationDuration',
  },
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
})
export class OuiTabNav
  extends OuiPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, OnDestroy, AfterViewInit
{
  /** Whether the ink bar should fit its width to the size of the tab label content. */
  @Input()
  get fitInkBarToContent(): boolean {
    return this._fitInkBarToContent.value;
  }
  set fitInkBarToContent(v: BooleanInput) {
    this._fitInkBarToContent.next(coerceBooleanProperty(v));
    this._changeDetectorRef.markForCheck();
  }
  _fitInkBarToContent = new BehaviorSubject(false);

  /** Whether tabs should be stretched to fill the header. */
  @Input('oui-stretch-tabs')
  get stretchTabs(): boolean {
    return this._stretchTabs;
  }
  set stretchTabs(v: BooleanInput) {
    this._stretchTabs = coerceBooleanProperty(v);
  }
  private _stretchTabs = true;

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

  /** Query list of all tab links of the tab navigation. */
  @ContentChildren(forwardRef(() => OuiTabLink), { descendants: true })
  _items: QueryList<OuiTabLink>;

  /** Background color of the tab nav. */
  @Input()
  get backgroundColor(): ThemePalette {
    return this._backgroundColor;
  }

  set backgroundColor(value: ThemePalette) {
    const classList = this._elementRef.nativeElement.classList;
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

  /** Whether the ripple effect is disabled or not. */
  @Input()
  get disableRipple(): boolean {
    return this._disableRipple;
  }

  set disableRipple(value: BooleanInput) {
    this._disableRipple = coerceBooleanProperty(value);
  }

  private _disableRipple = false;

  /** Theme color of the nav bar. */
  @Input() color: ThemePalette = 'primary';

  /**
   * Associated tab panel controlled by the nav bar. If not provided, then the nav bar
   * follows the ARIA link / navigation landmark pattern. If provided, it follows the
   * ARIA tabs design pattern.
   */
  @Input() tabPanel?: ouiTabNavPanel;

  @ViewChild('tabListContainer', { static: true })
  _tabListContainer: ElementRef;
  @ViewChild('tabList', { static: true }) _tabList: ElementRef;
  @ViewChild('tabListInner', { static: true }) _tabListInner: ElementRef;
  @ViewChild('nextPaginator') _nextPaginator: ElementRef<HTMLElement>;
  @ViewChild('previousPaginator') _previousPaginator: ElementRef<HTMLElement>;
  _inkBar: OuiInkBar;

  constructor(
    elementRef: ElementRef,
    @Optional() dir: Directionality,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string,
    @Optional() @Inject(OUI_TABS_CONFIG) defaultConfig?: OuiTabsConfig
  ) {
    super(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      elementRef,
      changeDetectorRef,
      viewportRuler,
      dir,
      ngZone,
      platform,
      animationMode
    );
    this.disablePagination =
      defaultConfig && defaultConfig.disablePagination != null
        ? defaultConfig.disablePagination
        : false;
    this.fitInkBarToContent =
      defaultConfig && defaultConfig.fitInkBarToContent != null
        ? defaultConfig.fitInkBarToContent
        : false;
    this.stretchTabs =
      defaultConfig && defaultConfig.stretchTabs != null
        ? defaultConfig.stretchTabs
        : true;
  }

  protected _itemSelected() {
    // noop
  }

  override ngAfterContentInit() {
    this._inkBar = new OuiInkBar(this._items);
    // We need this to run before the `changes` subscription in parent to ensure that the
    // selectedIndex is up-to-date by the time the super class starts looking for it.
    this._items.changes
      .pipe(startWith(null), takeUntil(this._destroyed))
      .subscribe(() => {
        this.updateActiveLink();
      });

    super.ngAfterContentInit();
  }

  /** Notifies the component that the active link has been changed. */
  updateActiveLink() {
    if (!this._items) {
      return;
    }

    const items = this._items.toArray();

    for (let i = 0; i < items.length; i++) {
      if (items[i].active) {
        this.selectedIndex = i;
        this._changeDetectorRef.markForCheck();

        if (this.tabPanel) {
          this.tabPanel._activeTabId = items[i].id;
        }

        return;
      }
    }

    // The ink bar should hide itself if no items are active.
    this.selectedIndex = -1;
    this._inkBar.hide();
  }

  _getRole(): string | null {
    return this.tabPanel
      ? 'tablist'
      : this._elementRef.nativeElement.getAttribute('role');
  }
}

// Boilerplate for applying mixins to OuiTabLink.
const _OuiTabLinkMixinBase = mixinInkBarItem(
  mixinTabIndex(
    mixinDisableRipple(
      mixinDisabled(
        class {
          elementRef: ElementRef;
        }
      )
    )
  )
);

/**
 * Link inside a `oui-tab-nav-bar`.
 */
@Component({
  // eslint-disable-next-line
  selector: '[oui-tab-link], [OuiTabLink]',
  exportAs: 'OuiTabLink',
  // eslint-disable-next-line
  inputs: [
    'disabled',
    'disableRipple',
    'tabIndex',
    'active',
    'id',
    'routerLink',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tab-link.html',
  styleUrls: ['tab-link.scss'],
  // eslint-disable-next-line
  host: {
    class: 'mdc-tab oui-mdc-tab-link oui-mdc-focus-indicator',
    '[attr.aria-controls]': '_getAriaControls()',
    '[attr.aria-current]': '_getAriaCurrent()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-selected]': '_getAriaSelected()',
    '[attr.id]': 'id',
    '[attr.tabIndex]': '_getTabIndex()',
    '[attr.role]': '_getRole()',
    '[class.oui-mdc-tab-disabled]': 'disabled',
    '[class.mdc-tab--active]': 'active',
    '(focus)': '_handleFocus()',
    '(keydown)': '_handleKeydown($event)',
  },
  standalone: false,
})
export class OuiTabLink
  extends _OuiTabLinkMixinBase
  implements
    AfterViewInit,
    OnDestroy,
    CanDisable,
    CanDisableRipple,
    HasTabIndex,
    FocusableOption
{
  private readonly _destroyed = new Subject<void>();

  /** Whether the tab link is active or not. */
  protected _isActive = false;

  /** Whether the link is active. */
  @Input()
  get active(): boolean {
    return this._isActive;
  }

  set active(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._isActive) {
      this._isActive = newValue;
      this._tabNavBar.updateActiveLink();
    }
  }

  /**
   * Whether ripples are disabled on interaction.
   * @docs-private
   */
  get rippleDisabled(): boolean {
    return this.disabled || this.disableRipple || this._tabNavBar.disableRipple;
  }

  /** Unique id for the tab. */
  @Input() id = `oui-tab-link-${nextUniqueId++}`;

  constructor(
    private _tabNavBar: OuiTabNav,
    /** @docs-private */
    override elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
    private _focusMonitor: FocusMonitor,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super();

    this.tabIndex = parseInt(tabIndex) || 0;

    if (animationMode === 'NoopAnimations') {
      // this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
    }

    _tabNavBar._fitInkBarToContent
      .pipe(takeUntil(this._destroyed))
      .subscribe((fitInkBarToContent) => {
        this.fitInkBarToContent = fitInkBarToContent;
      });
  }

  /** Focuses the tab link. */
  focus() {
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this._focusMonitor.monitor(this.elementRef);
  }

  override ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    super.ngOnDestroy();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this._focusMonitor.stopMonitoring(this.elementRef);
  }

  _handleFocus() {
    // Since we allow navigation through tabbing in the nav bar, we
    // have to update the focused index whenever the link receives focus.
    this._tabNavBar.focusIndex = this._tabNavBar._items.toArray().indexOf(this);
  }

  _handleKeydown(event: KeyboardEvent) {
    if (this.disabled && (event.keyCode === SPACE || event.keyCode === ENTER)) {
      event.preventDefault();
    } else if (this._tabNavBar.tabPanel && event.keyCode === SPACE) {
      this.elementRef.nativeElement.click();
    }
  }

  _getAriaControls(): string | null {
    return this._tabNavBar.tabPanel
      ? this._tabNavBar.tabPanel?.id
      : this.elementRef.nativeElement.getAttribute('aria-controls');
  }

  _getAriaSelected(): string | null {
    if (this._tabNavBar.tabPanel) {
      return this.active ? 'true' : 'false';
    } else {
      return this.elementRef.nativeElement.getAttribute('aria-selected');
    }
  }

  _getAriaCurrent(): string | null {
    return this.active && !this._tabNavBar.tabPanel ? 'page' : null;
  }

  _getRole(): string | null {
    return this._tabNavBar.tabPanel
      ? 'tab'
      : this.elementRef.nativeElement.getAttribute('role');
  }

  _getTabIndex(): number {
    if (this._tabNavBar.tabPanel) {
      return this._isActive && !this.disabled ? 0 : -1;
    } else {
      return this.tabIndex;
    }
  }
}

/**
 * Tab panel component associated with OuiTabNav.
 */
@Component({
  selector: 'oui-tab-nav-panel',
  exportAs: 'ouiTabNavPanel',
  template: '<ng-content></ng-content>',
  host: {
    '[attr.aria-labelledby]': '_activeTabId',
    '[attr.id]': 'id',
    class: 'oui-mdc-tab-nav-panel',
    role: 'tabpanel',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ouiTabNavPanel {
  /** Unique id for the tab panel. */
  @Input() id = `oui-tab-nav-panel-${nextUniqueId++}`;

  /** Id of the active tab in the nav bar. */
  _activeTabId?: string;
}
