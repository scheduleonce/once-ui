import { PlatformModule } from '@angular/cdk/platform';
import { Component, Type, Provider, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OuiInput, OuiInputModule } from './index';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getOuiFormFieldMissingControlError } from '../form-field/form-field-errors';
import {
  OUI_FORM_FIELD_DEFAULT_OPTIONS,
  OuiFormField,
  OuiFormFieldAppearance,
} from '..';

@Component({
    template: `
    <oui-form-field>
      <input oui-input id="test-id" placeholder="test" />
    </oui-form-field>
  `,
    standalone: false
})
class OuiInputWithId {}

@Component({
    template: `
    <oui-form-field><input oui-input [required]="required" /></oui-form-field>
  `,
    standalone: false
})
class OuiInputWithRequired {
  required: boolean;
}

@Component({
    template: `
    <oui-form-field><input oui-input [type]="type" /></oui-form-field>
  `,
    standalone: false
})
class OuiInputWithType {
  type: string;
}

@Component({
    template: `
    <oui-form-field>
      <input oui-input placeholder="Hello" [formControl]="formControl" />
    </oui-form-field>
  `,
    standalone: false
})
class OuiInputWithFormControl {
  formControl = new UntypedFormControl();
}

@Component({
    template: `
    <oui-form-field
      ><input oui-input [placeholder]="placeholder"
    /></oui-form-field>
  `,
    standalone: false
})
class OuiInputPlaceholderAttrTestComponent {
  placeholder = '';
}

@Component({
    template: `
    <oui-form-field><input oui-input type="file" /></oui-form-field>
  `,
    standalone: false
})
class OuiInputInvalidTypeTestController {}

@Component({
    template: `
    <oui-form-field>
      <input oui-input type="text" placeholder="Placeholder" />
    </oui-form-field>
  `,
    standalone: false
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
  `,
    standalone: false
})
class OuiInputTextareaWithBindings {
  rows = 4;
  cols = 8;
  wrap = 'hard';
}

@Component({
    template: ` <oui-form-field><input /></oui-form-field> `,
    standalone: false
})
class OuiInputMissingOuiInputTestController {}

@Component({
    template: `
    <oui-form-field> <input oui-input *ngIf="renderInput" /> </oui-form-field>
  `,
    standalone: false
})
class OuiInputWithNgIf {
  renderInput = true;
}

@Component({
    template: `
    <oui-form-field [appearance]="appearance">
      <input oui-input placeholder="Placeholder" />
    </oui-form-field>
  `,
    standalone: false
})
class OuiInputWithAppearance {
  @ViewChild(OuiFormField) formField: OuiFormField;
  appearance: OuiFormFieldAppearance;
}

@Component({
    template: ` <oui-form-field> <input oui-input /> </oui-form-field> `,
    standalone: false
})
class OuiInputWithoutPlaceholder {}

describe('OuiInput without forms', () => {
  it('should add id', waitForAsync(() => {
    const fixture = createComponent(OuiInputTextTestController);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(inputElement.id).toBeTruthy();
  }));

  it('should not overwrite existing id', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithId);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(inputElement.id).toBe('test-id');
  }));

  it('should add aria-required reflecting the required state', waitForAsync(() => {
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

  it('validates that ouiInput child is present', waitForAsync(() => {
    const fixture = createComponent(OuiInputMissingOuiInputTestController);

    expect(() => fixture.detectChanges()).toThrowError(
      getOuiFormFieldMissingControlError().message
    );
  }));

  it('validates that ouiInput child is present after initialization', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithNgIf);
    expect(() => fixture.detectChanges()).not.toThrowError(
      getOuiFormFieldMissingControlError().message
    );

    fixture.componentInstance.renderInput = false;
    expect(() => fixture.detectChanges()).toThrowError(
      getOuiFormFieldMissingControlError().message
    );
  }));

  it('validates the type', waitForAsync(() => {
    expect(() => {
      const fixture = createComponent(OuiInputInvalidTypeTestController);
      fixture.detectChanges();
    }).toThrow(/* new OuiInputUnsupportedTypeError('file') */);
  }));

  it('supports placeholder attribute', waitForAsync(() => {
    const fixture = createComponent(OuiInputPlaceholderAttrTestComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.placeholder).toBe('');

    fixture.componentInstance.placeholder = 'Other placeholder';
    fixture.detectChanges();

    expect(inputEl.placeholder).toBe('Other placeholder');
  }));

  it('supports the required attribute as binding', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithRequired);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.required).toBe(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputEl.required).toBe(true);
  }));

  it('supports the type attribute as binding', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithType);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(inputEl.type).toBe('text');

    fixture.componentInstance.type = 'password';
    fixture.detectChanges();

    expect(inputEl.type).toBe('password');
  }));

  it('supports textarea', waitForAsync(() => {
    const fixture = createComponent(OuiInputTextareaWithBindings);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');
    expect(textarea).not.toBeNull();
  }));

  it('should not add the `placeholder` attribute if there is no placeholder', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithoutPlaceholder);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(input.hasAttribute('placeholder')).toBe(false);
  }));
});

describe('OuiInput with forms', () => {
  it('should update the value when using FormControl.setValue', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithFormControl);
    fixture.detectChanges();

    const input = fixture.debugElement
      .query(By.directive(OuiInput))
      .injector.get<OuiInput>(OuiInput);

    expect(input.value).toBeFalsy();

    fixture.componentInstance.formControl.setValue('something');

    expect(input.value).toBe('something');
  }));

  it('should display disabled styles when using FormControl.disable()', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithFormControl);
    fixture.detectChanges();

    const formFieldEl = fixture.debugElement.query(
      By.css('.oui-form-field')
    ).nativeElement;
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
  it('should be standard appearance if no default options provided', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithAppearance);
    fixture.detectChanges();
    expect(fixture.componentInstance.formField.appearance).toBe('standard');
  }));

  it('should be standard appearance if empty default options provided', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithAppearance, [
      {
        provide: OUI_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {},
      },
    ]);

    fixture.detectChanges();
    expect(fixture.componentInstance.formField.appearance).toBe('standard');
  }));

  it('should be custom default appearance if custom appearance specified in default options', waitForAsync(() => {
    const fixture = createComponent(OuiInputWithAppearance, [
      {
        provide: OUI_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'underline' },
      },
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
      ...imports,
    ],
    declarations: [component, ...declarations],
    providers,
  }).compileComponents();

  return TestBed.createComponent<T>(component);
}
