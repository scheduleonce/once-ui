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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';
import { Directionality } from '@angular/cdk/bidi';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { ouiTabLabelWrapper } from './tab-label-wrapper';
import { OuiInkBar } from './ink-bar';
import { OuiPaginatedTabHeader } from './paginated-tab-header';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
@Component({
    selector: 'oui-tab-header',
    templateUrl: 'tab-header.html',
    styleUrls: ['tab-header.scss'],
    // eslint-disable-next-line
    inputs: ['selectedIndex'],
    // eslint-disable-next-line
    outputs: ['selectFocusedIndex', 'indexFocused'],
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line
    changeDetection: ChangeDetectionStrategy.Default,
    // eslint-disable-next-line
    host: {
        class: 'oui-mdc-tab-header',
        '[class.oui-mdc-tab-header-pagination-controls-enabled]': '_showPaginationControls',
        '[class.oui-mdc-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
    },
    standalone: false
})
export class OuiTabHeader
  extends OuiPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  @ContentChildren(ouiTabLabelWrapper, { descendants: false })
  _items: QueryList<ouiTabLabelWrapper>;
  @ViewChild('tabListContainer', { static: true })
  _tabListContainer: ElementRef;
  @ViewChild('tabList', { static: true }) _tabList: ElementRef;
  @ViewChild('tabListInner', { static: true }) _tabListInner: ElementRef;
  @ViewChild('nextPaginator') _nextPaginator: ElementRef<HTMLElement>;
  @ViewChild('previousPaginator') _previousPaginator: ElementRef<HTMLElement>;
  _inkBar: OuiInkBar;

  /** Whether the ripple effect is disabled or not. */
  @Input()
  get disableRipple(): boolean {
    return this._disableRipple;
  }

  set disableRipple(value: BooleanInput) {
    this._disableRipple = coerceBooleanProperty(value);
  }

  private _disableRipple = false;

  constructor(
    elementRef: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Optional() dir: Directionality,
    ngZone: NgZone,
    platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
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
  }

  override ngAfterContentInit() {
    this._inkBar = new OuiInkBar(this._items);
    super.ngAfterContentInit();
  }

  protected _itemSelected(event: KeyboardEvent) {
    event.preventDefault();
  }
}
