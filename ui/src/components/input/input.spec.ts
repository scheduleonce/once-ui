import { PlatformModule } from '@angular/cdk/platform';
import { Component, Type, Provider, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OuiInput, OuiInputModule } from './index';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { getOuiFormFieldMissingControlError } from '../form-field/form-field-errors';
import {
  OUI_FORM_FIELD_DEFAULT_OPTIONS,
  OuiFormField,
  OuiFormFieldAppearance
} from '..';

@Component({
  template: `
    <oui-form-field>
      <input oui-input id="test-id" placeholder="test" />
    </oui-form-field>
  `
})
class OuiInputWithId {}

@Component({
  template: `
    <oui-form-field><input oui-input [required]="required"/></oui-form-field>
  `
})
class OuiInputWithRequired {
  required: boolean;
}

@Component({
  template: `
    <oui-form-field><input oui-input [type]="type"/></oui-form-field>
  `
})
class OuiInputWithType {
  type: string;
}

@Component({
  template: `
    <oui-form-field>
      <input oui-input placeholder="Hello" [formControl]="formControl" />
    </oui-form-field>
  `
})
class OuiInputWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: `
    <oui-form-field
      ><input oui-input [placeholder]="placeholder"
    /></oui-form-field>
  `
})
class OuiInputPlaceholderAttrTestComponent {
  placeholder = '';
}

@Component({
  template: `
    <oui-form-field><input oui-input type="file"/></oui-form-field>
  `
})
class OuiInputInvalidTypeTestController {}

@Component({
  template: `
    <oui-form-field>
      <input oui-input type="text" placeholder="Placeholder" />
    </oui-form-field>
  `
})
class OuiInputTextTestController {}

@Component({
  template: `
    <oui-form-field>
      <textarea
        oui-input
        [rows]="rows"
        [cols]="cols"
        [wrap]="wrap"
        placeholder="Snacks"
      >
      </textarea>
    </oui-form-field>
  `
})
class OuiInputTextareaWithBindings {
  rows = 4;
  cols = 8;
  wrap = 'hard';
}

@Component({
  template: `
    <oui-form-field><input /></oui-form-field>
  `
})
class OuiInputMissingOuiInputTestController {}

@Component({
  template: `
    <oui-form-field> <input oui-input *ngIf="renderInput" /> </oui-form-field>
  `
})
class OuiInputWithNgIf {
  renderInput = true;
}

@Component({
  template: `
    <oui-form-field [appearance]="appearance">
      <input oui-input placeholder="Placeholder" />
    </oui-form-field>
  `
})
class OuiInputWithAppearance {
  @ViewChild(OuiFormField, { static: false }) formField: OuiFormField;
  appearance: OuiFormFieldAppearance;
}

@Component({
  template: `
    <oui-form-field> <input oui-input /> </oui-form-field>
  `
})
class OuiInputWithoutPlaceholder {}

describe('OuiInput without forms', () => {
  it('should add id', async(() => {
    const fixture = createComponent(OuiInputTextTestController);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(inputElement.id).toBeTruthy();
  }));

  it('should not overwrite existing id', async(() => {
    const fixture = createComponent(OuiInputWithId);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(inputElement.id).toBe('test-id');
  }));

  it('should add aria-required reflecting the required state', async(() => {
    const fixture = createComponent(OuiInputWithRequired);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(inputElement.getAttribute('aria-required')).toBe(
      'false',
      'Expected aria-required to reflect required state of false'
    );

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-required')).toBe(
      'true',
      'Expected aria-required to reflect required state of true'
    );
  }));

  it('validates that ouiInput child is present', async(() => {
    const fixture = createComponent(OuiInputMissingOuiInputTestController);

    expect(() => fixture.detectChanges()).toThrowError(
      getOuiFormFieldMissingControlError().message
    );
  }));

  it('validates that ouiInput child is present after initialization', async(() => {
    const fixture = createComponent(OuiInputWithNgIf);
    expect(() => fixture.detectChanges()).not.toThrowError(
      getOuiFormFieldMissingControlError().message
    );

    fixture.componentInstance.renderInput = false;
    expect(() => fixture.detectChanges()).toThrowError(
      getOuiFormFieldMissingControlError().message
    );
  }));

  it('validates the type', async(() => {
    const fixture = createComponent(OuiInputInvalidTypeTestController);

    expect(() =>
      fixture.detectChanges()
    ).toThrow(/* new OuiInputUnsupportedTypeError('file') */);
  }));

  it('supports placeholder attribute', async(() => {
    const fixture = createComponent(OuiInputPlaceholderAttrTestComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.placeholder).toBe('');

    fixture.componentInstance.placeholder = 'Other placeholder';
    fixture.detectChanges();

    expect(inputEl.placeholder).toBe('Other placeholder');
  }));

  it('supports the required attribute as binding', async(() => {
    const fixture = createComponent(OuiInputWithRequired);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.required).toBe(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputEl.required).toBe(true);
  }));

  it('supports the type attribute as binding', async(() => {
    const fixture = createComponent(OuiInputWithType);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.type).toBe('text');

    fixture.componentInstance.type = 'password';
    fixture.detectChanges();

    expect(inputEl.type).toBe('password');
  }));

  it('supports textarea', async(() => {
    const fixture = createComponent(OuiInputTextareaWithBindings);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      'textarea'
    );
    expect(textarea).not.toBeNull();
  }));

  it('should not add the `placeholder` attribute if there is no placeholder', async(() => {
    const fixture = createComponent(OuiInputWithoutPlaceholder);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(input.hasAttribute('placeholder')).toBe(false);
  }));
});

describe('OuiInput with forms', () => {
  it('should update the value when using FormControl.setValue', async(() => {
    const fixture = createComponent(OuiInputWithFormControl);
    fixture.detectChanges();

    const input = fixture.debugElement
      .query(By.directive(OuiInput))
      .injector.get<OuiInput>(OuiInput);

    expect(input.value).toBeFalsy();

    fixture.componentInstance.formControl.setValue('something');

    expect(input.value).toBe('something');
  }));

  it('should display disabled styles when using FormControl.disable()', async(() => {
    const fixture = createComponent(OuiInputWithFormControl);
    fixture.detectChanges();

    const formFieldEl = fixture.debugElement.query(By.css('.oui-form-field'))
      .nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(formFieldEl.classList).not.toContain(
      'oui-form-field-disabled',
      `Expected form field not to start out disabled.`
    );
    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.formControl.disable();
    fixture.detectChanges();

    expect(formFieldEl.classList).toContain(
      'oui-disabled',
      `Expected form field to look disabled after disable() is called.`
    );
    expect(inputEl.disabled).toBe(true);
  }));
});

describe('OuiFormField default options', () => {
  it('should be standard appearance if no default options provided', async(() => {
    const fixture = createComponent(OuiInputWithAppearance);
    fixture.detectChanges();
    expect(fixture.componentInstance.formField.appearance).toBe('standard');
  }));

  it('should be standard appearance if empty default options provided', async(() => {
    const fixture = createComponent(OuiInputWithAppearance, [
      {
        provide: OUI_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {}
      }
    ]);

    fixture.detectChanges();
    expect(fixture.componentInstance.formField.appearance).toBe('standard');
  }));

  it('should be custom default appearance if custom appearance specified in default options', async(() => {
    const fixture = createComponent(OuiInputWithAppearance, [
      {
        provide: OUI_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'underline' }
      }
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance.formField.appearance).toBe('underline');
  }));
});

function createComponent<T>(
  component: Type<T>,
  providers: Provider[] = [],
  imports: any[] = [],
  declarations: any[] = []
): ComponentFixture<T> {
  TestBed.configureTestingModule({
    imports: [
      FormsModule,
      OuiFormFieldModule,
      OuiInputModule,
      BrowserAnimationsModule,
      PlatformModule,
      ReactiveFormsModule,
      ...imports
    ],
    declarations: [component, ...declarations],
    providers
  }).compileComponents();

  return TestBed.createComponent<T>(component);
}
