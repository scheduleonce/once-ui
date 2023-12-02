/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {MatTabContent} from './tab-content';
import {MAT_TAB, MatTabLabel} from './tab-label';
import {CanDisable, mixinColor} from '../core';
import {TemplatePortal} from '@angular/cdk/portal';
import {Subject} from 'rxjs';


export class OuiTabsBase {
  constructor(public _elementRef: ElementRef) {}
}
// Boilerplate for applying mixins to MatTab.
/** @docs-private */
const _MatTabMixinBase: typeof OuiTabsBase = mixinColor(OuiTabsBase);

/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export const MAT_TAB_GROUP = new InjectionToken<any>('MAT_TAB_GROUP');

/** Default color palette for the tab */
const DEFAULT_COLOR = 'primary';

@Component({
  selector: 'mat-tab',

  // Note that usually we'd go through a bit more trouble and set up another class so that
  // the inlined template of `MatTab` isn't duplicated, however the template is small enough
  // that creating the extra class will generate more code than just duplicating the template.
  templateUrl: 'tab.html',
  inputs: ['disabled'],
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'MatTab',
  providers: [{provide: MAT_TAB, useExisting: MatTab}],
})
export class MatTab extends _MatTabMixinBase implements CanDisable, OnInit, OnChanges, OnDestroy {
  /** Content for the tab label given by `<ng-template mat-tab-label>`. */
  private _templateLabel: MatTabLabel;
  disabled: any;
  @ContentChild(MatTabLabel)
  get templateLabel(): MatTabLabel {
    return this._templateLabel;
  }
  set templateLabel(value: MatTabLabel) {
    console.log('value', value)
    this._setTemplateLabelInput(value);
  }

  /**
   * Template provided in the tab content that will be used if present, used to enable lazy-loading
   */
  @ContentChild(MatTabContent, {read: TemplateRef, static: true})
  // We need an initializer here to avoid a TS error. The value will be set in `ngAfterViewInit`.
  private _explicitContent: TemplateRef<any> = undefined!;

  /** Template inside the MatTab view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef, {static: true}) _implicitContent: TemplateRef<any>;

  /** Plain text label for the tab, used when there is no template label. */
  @Input('label') textLabel: string = '';

  @Input('text') givenText: string = '';

  /** Aria label for the tab. */
  @Input('aria-label') ariaLabel: string;

  @Input() color = 'accent';

  /**
   * Reference to the element that the tab is labelled by.
   * Will be cleared if `aria-label` is set at the same time.
   */
  @Input('aria-labelledby') ariaLabelledby: string;

  /**
   * Classes to be passed to the tab label inside the mat-tab-header container.
   * Supports string and string array values, same as `ngClass`.
   */
  @Input() labelClass: string | string[];

  /**
   * Classes to be passed to the tab mat-tab-body container.
   * Supports string and string array values, same as `ngClass`.
   */
  @Input() bodyClass: string | string[];

  /** Portal that will be the hosted content of the tab */
  private _contentPortal: TemplatePortal | null = null;

  /** @docs-private */
  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges = new Subject<void>();

  /**
   * The relatively indexed position where 0 represents the center, negative is left, and positive
   * represents the right.
   */
  position: number | null = null;

  
  /**
   * The initial relatively index origin of the tab if it was created and selected after there
   * was already a selected tab. Provides context of what position the tab should originate from.
  */
 origin: number | null = null;
 
 /**
  * Whether the tab is currently active.
 */
  isActive = false;

  @ViewChild('tab1') _tab1: ElementRef;
  constructor(
    private _viewContainerRef: ViewContainerRef,
    @Inject(MAT_TAB_GROUP) @Optional() public _closestTabGroup: any,
    _elementRef: ElementRef
  ) {
    super(_elementRef);
    this.addThemeColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
      this._stateChanges.next();
    }
    if (changes.hasOwnProperty('_tab2') || changes.hasOwnProperty('disabled')) {
      this._stateChanges.next();
    }
  }

  addThemeColor() {
    console.log('sssssss123', this.color)
    if (!this.color) {
      this.color = DEFAULT_COLOR;
    }
    console.log('after', this.color)
  }

  ngAfterViewInit() {
    console.log("this._tab1.nativeElement.innerText;", this._tab1);
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }

  ngOnInit(): void {
    this._contentPortal = new TemplatePortal(
      this._explicitContent || this._implicitContent,
      this._viewContainerRef, this._tab1
    );
    console.log('_tab1', this._contentPortal);
  }

  /**
   * This has been extracted to a util because of TS 4 and VE.
   * View Engine doesn't support property rename inheritance.
   * TS 4.0 doesn't allow properties to override accessors or vice-versa.
   * @docs-private
   */
  private _setTemplateLabelInput(value: MatTabLabel | undefined) {
    // Only update the label if the query managed to find one. This works around an issue where a
    // user may have manually set `templateLabel` during creation mode, which would then get
    // clobbered by `undefined` when the query resolves. Also note that we check that the closest
    // tab matches the current one so that we don't pick up labels from nested tabs.
    if (value && value._closestTab === this) {
      this._templateLabel = value;
    }
  }
}
