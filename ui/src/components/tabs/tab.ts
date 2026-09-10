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
  InjectionToken,
  effect,
  input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { OuiTabContent } from './tab-content';
import { OUI_TAB, OuiTabLabel } from './tab-label';
import { CanColorCtor, CanDisable, mixinColor, ThemePalette } from '../core';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

export class OuiTabsBase {
  constructor(public _elementRef: ElementRef) {}
}
// Boilerplate for applying mixins to OuiTab.
/** @docs-private */
const _OuiTabMixinBase: CanColorCtor & typeof OuiTabsBase =
  mixinColor(OuiTabsBase);

/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export const OUI_TAB_GROUP = new InjectionToken<any>('OUI_TAB_GROUP');

@Component({
  selector: 'oui-tab',
  // Note that usually we'd go through a bit more trouble and set up another class so that
  // the inlined template of `OuiTab` isn't duplicated, however the template is small enough
  // that creating the extra class will generate more code than just duplicating the template.
  templateUrl: 'tab.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled'],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'OuiTab',
  providers: [{ provide: OUI_TAB, useExisting: OuiTab }],
  standalone: false,
})
export class OuiTab
  extends _OuiTabMixinBase
  implements CanDisable, OnInit, OnChanges, OnDestroy
{
  private _viewContainerRef = inject(ViewContainerRef);
  _closestTabGroup = inject(OUI_TAB_GROUP, { optional: true })!;
  private sanitized = inject(DomSanitizer);

  /** Content for the tab label given by `<ng-template oui-tab-label>`. */
  private _templateLabel: OuiTabLabel;
  disabled: any;
  @ContentChild(OuiTabLabel)
  get templateLabel(): OuiTabLabel {
    return this._templateLabel;
  }
  set templateLabel(value: OuiTabLabel) {
    this._setTemplateLabelInput(value);
  }

  /**
   * Template provided in the tab content that will be used if present, used to enable lazy-loading
   */
  @ContentChild(OuiTabContent, { read: TemplateRef, static: true })
  // We need an initializer here to avoid a TS error. The value will be set in `ngAfterViewInit`.
  private _explicitContent: TemplateRef<any> = undefined!;

  /** Template inside the OuiTab view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef, { static: true }) _implicitContent: TemplateRef<any>;

  /** Plain text label for the tab, used when there is no template label. */
  readonly textLabel = input('', { alias: 'label' });

  contentWithin = '';

  /** Aria label for the tab. */
  readonly ariaLabel = input<string>(undefined, { alias: 'aria-label' });

  readonly colorInput = input<ThemePalette>('accent', { alias: 'color' });
  get color(): ThemePalette {
    return super.color;
  }
  set color(value: ThemePalette) {
    super.color = value;
  }

  /**
   * Reference to the element that the tab is labelled by.
   * Will be cleared if `aria-label` is set at the same time.
   */
  readonly ariaLabelledby = input<string>(undefined, {
    alias: 'aria-labelledby',
  });

  /**
   * Classes to be passed to the tab label inside the oui-tab-header container.
   * Supports string and string array values, same as `ngClass`.
   */
  readonly labelClass = model<string | string[] | undefined>();

  /**
   * Classes to be passed to the tab oui-tab-body container.
   * Supports string and string array values, same as `ngClass`.
   */
  readonly bodyClass = model<string | string[] | undefined>();

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

  constructor() {
    const _elementRef = inject(ElementRef);

    super(_elementRef);
    effect(() => {
      super.color = this.colorInput();
    });
    this.addThemeColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      Object.prototype.hasOwnProperty.call(changes, 'textLabel') ||
      Object.prototype.hasOwnProperty.call(changes, 'disabled')
    ) {
      setTimeout(() => {
        this.contentWithin = this.sanitized.bypassSecurityTrustHtml(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          this._elementRef.nativeElement.innerHTML
        )['changingThisBreaksApplicationSecurity'];
      });
      this._stateChanges.next();
    }
    if (
      Object.prototype.hasOwnProperty.call(changes, '_tab2') ||
      Object.prototype.hasOwnProperty.call(changes, 'disabled')
    ) {
      this._stateChanges.next();
    }
  }

  addThemeColor() {
    if (!this.color) {
      return;
    }
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.contentWithin = this.sanitized.bypassSecurityTrustHtml(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._elementRef.nativeElement.innerHTML
      )['changingThisBreaksApplicationSecurity'];
    });
    this._contentPortal = new TemplatePortal(
      this._explicitContent || this._implicitContent,
      this._viewContainerRef,
      this._tab1
    );
  }

  /**
   * This has been extracted to a util because of TS 4 and VE.
   * View Engine doesn't support property rename inheritance.
   * TS 4.0 doesn't allow properties to override accessors or vice-versa.
   * @docs-private
   */
  private _setTemplateLabelInput(value: OuiTabLabel | undefined) {
    // Only update the label if the query managed to find one. This works around an issue where a
    // user may have manually set `templateLabel` during creation mode, which would then get
    // clobbered by `undefined` when the query resolves. Also note that we check that the closest
    // tab matches the current one so that we don't pick up labels from nested tabs.
    if (value && value._closestTab === this) {
      this._templateLabel = value;
    }
  }
}
