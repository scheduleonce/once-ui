import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  InjectionToken,
  Optional,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  Input,
} from '@angular/core';
import { mixinColor, ThemePalette } from '../core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OuiFormFieldControl } from './form-field-control';
import { getOuiFormFieldMissingControlError } from './form-field-errors';

/**
 * Boilerplate for applying mixins to OuiFormField.
 *
 * @docs-private
 */
export class OuiFormFieldBase {
  constructor(public _elementRef: ElementRef) {}
}

/**
 * Base class to which we're applying the form field mixins.
 *
 * @docs-private
 */
export const _OuiFormFieldMixinBase: typeof OuiFormFieldBase =
  mixinColor(OuiFormFieldBase);

/** Possible appearance styles for the form field. */
export type OuiFormFieldAppearance = 'standard' | 'underline';

/**
 * Represents the default options form the form field that can be configured
 * using the `OUI_FORM_FIELD_DEFAULT_OPTIONS` injection token.
 */
export interface OuiFormFieldDefaultOptions {
  appearance?: OuiFormFieldAppearance;
}

/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export const OUI_FORM_FIELD_DEFAULT_OPTIONS =
  new InjectionToken<OuiFormFieldDefaultOptions>(
    'OUI_FORM_FIELD_DEFAULT_OPTIONS'
  );

/** Container for form controls that applies Oncehub Design styling and behavior. */
@Component({
    selector: 'oui-form-field',
    exportAs: 'ouiFormField',
    templateUrl: 'form-field.html',
    // OuiInput is a directive and can't have styles, so we need to include its styles here
    // in form-field-input.css. The OuiInput styles are fairly minimal so it shouldn't be a
    // big deal for people who aren't using OuiInput.
    styleUrls: ['form-field.scss'],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'oui-form-field',
        '[class.oui-focused]': '_control.focused',
        '[class.oui-disabled]': '_control.disabled',
        '[class.oui-form-field-appearance-standard]': 'appearance == "standard"',
        '[class.oui-form-field-appearance-underline]': 'appearance == "underline"',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class OuiFormField
  extends _OuiFormFieldMixinBase
  implements AfterContentInit, AfterContentChecked, OnDestroy
{
  private _destroyed = new Subject<void>();
  @Input() color: ThemePalette;
  /** The form-field appearance style. */
  @Input()
  get appearance(): OuiFormFieldAppearance {
    return this._appearance;
  }
  set appearance(value: OuiFormFieldAppearance) {
    this._appearance =
      value || (this._defaults && this._defaults.appearance) || 'standard';
  }
  _appearance: OuiFormFieldAppearance;

  @ViewChild('connectionContainer')
  _connectionContainerRef: ElementRef;
  @ViewChild('inputContainer')
  _inputContainerRef: ElementRef;
  @ContentChild(OuiFormFieldControl)
  _control: OuiFormFieldControl<any>;
  constructor(
    public _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(OUI_FORM_FIELD_DEFAULT_OPTIONS)
    private _defaults: OuiFormFieldDefaultOptions
  ) {
    super(_elementRef);

    // Set the default through here so we invoke the setter on the first run.
    this.appearance =
      _defaults && _defaults.appearance ? _defaults.appearance : 'standard';
  }

  ngAfterContentInit() {
    this._validateControlChild();
    const control = this._control;

    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(
        `oui-form-field-type-${control.controlType}`
      );
    }

    // Run change detection if the value changes.
    if (control.ngControl && control.ngControl.valueChanges) {
      control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }
  }

  getConnectedOverlayOrigin(): ElementRef {
    return this._connectionContainerRef || this._elementRef;
  }

  ngAfterContentChecked() {
    this._validateControlChild();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Throws an error if the form field's control is missing. */
  protected _validateControlChild() {
    if (!this._control) {
      throw getOuiFormFieldMissingControlError();
    }
  }
}
