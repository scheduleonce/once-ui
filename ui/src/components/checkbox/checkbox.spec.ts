import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  flush,
  flushMicrotasks,
} from '@angular/core/testing';
import {
  UntypedFormControl,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, DebugElement, ViewChild, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Checkbox, OuiCheckboxModule } from './public-api';

/** Simple component for testing a single checkbox. */
@Component({
  template: `
    <div
      (click)="parentElementClicked = true"
      (keyup)="parentElementKeyedUp = true"
    >
      <oui-checkbox
        [id]="checkboxId"
        [required]="isRequired"
        [labelPosition]="labelPos"
        [checked]="isChecked"
        [disabled]="isDisabled"
        [value]="checkboxValue"
        (click)="onCheckboxClick($event)"
        (change)="onCheckboxChange($event)"
      >
        Simple checkbox
      </oui-checkbox>
    </div>
  `,
})
class SingleCheckbox {
  labelPos = 'after';
  isChecked = false;
  isRequired = false;
  isDisabled = false;
  checkboxId = 'simple-check';
  checkboxValue = 'single_checkbox';

  onCheckboxClick: (event?: Event) => void = () => {};
  onCheckboxChange: (event?: any) => void = () => {};
}

/** Simple component for testing an Checkbox with required ngModel. */
@Component({
  template: `
    <oui-checkbox [required]="isRequired" [(ngModel)]="isGood"
      >Be good</oui-checkbox
    >
  `,
})
class CheckboxWithNgModel {
  isGood = false;
  isRequired = true;
}

/** Simple test component with multiple checkboxes. */
@Component({
  template: `
    <oui-checkbox>Option 1</oui-checkbox>
    <oui-checkbox>Option 2</oui-checkbox>
  `,
})
class MultipleCheckboxes {}

/** Simple test component with tabIndex */
@Component({
  template: `
    <oui-checkbox [tabIndex]="customTabIndex" [disabled]="isDisabled">
    </oui-checkbox>
  `,
})
class CheckboxWithTabIndex {
  customTabIndex = 7;
  isDisabled = false;
}

/** Simple test component that accesses Checkbox using ViewChild. */
@Component({
  template: ` <oui-checkbox></oui-checkbox> `,
})
class CheckboxUsingViewChild {
  @ViewChild(Checkbox)
  checkbox: Checkbox;

  set isDisabled(value: boolean) {
    this.checkbox.disabled = value;
  }
}

/** Simple test component with an aria-label set. */
@Component({
  template: ` <oui-checkbox aria-label="Super effective"></oui-checkbox> `,
})
class CheckboxWithAriaLabel {}

/** Simple test component with an aria-label set. */
@Component({
  template: ` <oui-checkbox aria-labelledby="some-id"></oui-checkbox> `,
})
class CheckboxWithAriaLabelledby {}

/** Simple test component with name attribute */
@Component({
  template: ` <oui-checkbox name="test-name"></oui-checkbox> `,
})
class CheckboxWithNameAttribute {}

/** Test component with reactive forms */
@Component({
  template: ` <oui-checkbox [formControl]="formControl"></oui-checkbox> `,
})
class CheckboxWithFormControl {
  formControl = new UntypedFormControl();
}

/** Test component without label */
@Component({
  template: ` <oui-checkbox>{{ label }}</oui-checkbox> `,
})
class CheckboxWithoutLabel {
  label: string;
}

/** Test component with the native tabindex attribute. */
@Component({
  template: ` <oui-checkbox tabindex="5"></oui-checkbox> `,
})
class CheckboxWithTabindexAttr {}

describe('Checkbox', () => {
  let fixture: ComponentFixture<any>;

  function createComponent<T>(
    componentType: Type<T>,
    extraDeclarations: Type<any>[] = []
  ) {
    TestBed.configureTestingModule({
      imports: [OuiCheckboxModule, FormsModule, ReactiveFormsModule],
      declarations: [componentType, ...extraDeclarations],
    }).compileComponents();

    return TestBed.createComponent<T>(componentType);
  }

  describe('basic behaviors', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: Checkbox;
    let testComponent: SingleCheckbox;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = createComponent(SingleCheckbox);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = <HTMLInputElement>(
        checkboxNativeElement.querySelector('input')
      );
      labelElement = <HTMLLabelElement>(
        checkboxNativeElement.querySelector('label')
      );
    });

    it('should add and remove the checked state', () => {
      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-checked'
      );
      expect(inputElement.checked).toBe(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('oui-checkbox-checked');
      expect(inputElement.checked).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-checked'
      );
      expect(inputElement.checked).toBe(false);
    });

    it('should change native element checked when check programmatically', () => {
      expect(inputElement.checked).toBe(false);

      checkboxInstance.checked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
    });

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
    });

    it('should add and remove disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-disabled'
      );
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(checkboxNativeElement.classList).toContain(
        'oui-checkbox-disabled'
      );
      expect(inputElement.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-disabled'
      );
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);
    });

    it('should not toggle `checked` state upon interation while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      checkboxNativeElement.click();
      expect(checkboxInstance.checked).toBe(false);
    });

    it('should preserve the user-provided id', () => {
      expect(checkboxNativeElement.id).toBe('simple-check');
      expect(inputElement.id).toBe('simple-check-input');
    });

    it('should generate a unique id for the checkbox input if no id is set', () => {
      testComponent.checkboxId = null;
      fixture.detectChanges();

      expect(checkboxInstance.inputId).toMatch(/oui-checkbox-\d+/);
      expect(inputElement.id).toBe(checkboxInstance.inputId);
    });

    it('should project the checkbox content into the label element', () => {
      const label = <HTMLLabelElement>(
        checkboxNativeElement.querySelector('.oui-checkbox-label')
      );
      expect(label.textContent!.trim()).toBe('Simple checkbox');
    });

    it('should make the host element a tab stop', () => {
      expect(inputElement.tabIndex).toBe(0);
    });

    it('should add a css class to position the label before the checkbox', () => {
      testComponent.labelPos = 'before';
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain(
        'oui-checkbox-label-before'
      );
    });

    it('should not trigger the click event multiple times', () => {
      // By default, when clicking on a label element, a generated click will be dispatched
      // on the associated input element.
      // Since we're using a label element and a visual hidden input, this behavior can led
      // to an issue, where the click events on the checkbox are getting executed twice.

      spyOn(testComponent, 'onCheckboxClick');

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-checked'
      );

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain('oui-checkbox-checked');
      expect(inputElement.checked).toBe(true);

      expect(testComponent.onCheckboxClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger a change event when the native input does', fakeAsync(() => {
      spyOn(testComponent, 'onCheckboxChange');

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-checked'
      );

      labelElement.click();
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('oui-checkbox-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onCheckboxChange).toHaveBeenCalledTimes(1);
    }));

    it('should not trigger the change event by changing the native value', fakeAsync(() => {
      spyOn(testComponent, 'onCheckboxChange');

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-checked'
      );

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('oui-checkbox-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onCheckboxChange).not.toHaveBeenCalled();
    }));

    it('should forward the required attribute', () => {
      testComponent.isRequired = true;
      fixture.detectChanges();

      expect(inputElement.required).toBe(true);

      testComponent.isRequired = false;
      fixture.detectChanges();

      expect(inputElement.required).toBe(false);
    });

    it('should forward the value to input element', () => {
      testComponent.checkboxValue = 'basic_checkbox';
      fixture.detectChanges();

      expect(inputElement.value).toBe('basic_checkbox');
    });

    it('should remove the SVG checkmark from the tab order', () => {
      expect(
        checkboxNativeElement.querySelector('svg')!.getAttribute('focusable')
      ).toBe('false');
    });

    describe('state transition css classes', () => {
      it('should transition unchecked -> checked -> unchecked', () => {
        inputElement.click();
        fixture.detectChanges();
        expect(checkboxNativeElement.classList).toContain(
          'oui-checkbox-anim-unchecked-checked'
        );

        inputElement.click();
        fixture.detectChanges();
        expect(checkboxNativeElement.classList).not.toContain(
          'oui-checkbox-anim-unchecked-checked'
        );
        expect(checkboxNativeElement.classList).toContain(
          'oui-checkbox-anim-checked-unchecked'
        );
      });

      it('should not initially have any transition classes', () => {
        expect(checkboxNativeElement).not.toMatch(/^oui\-checkbox\-anim/g);
      });
    });
  });

  describe('aria-label ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-label', () => {
      fixture = createComponent(CheckboxWithAriaLabel);
      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement>(
        checkboxNativeElement.querySelector('input')
      );

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-label')).toBe('Super effective');
    });

    it('should not set the aria-label attribute if no value is provided', () => {
      fixture = createComponent(SingleCheckbox);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('input').hasAttribute('aria-label')
      ).toBe(false);
    });
  });

  describe('with provided aria-labelledby ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-labelledby', () => {
      fixture = createComponent(CheckboxWithAriaLabelledby);
      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement>(
        checkboxNativeElement.querySelector('input')
      );

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe('some-id');
    });

    it('should not assign aria-labelledby if none is provided', () => {
      fixture = createComponent(SingleCheckbox);
      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement>(
        checkboxNativeElement.querySelector('input')
      );

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe(null);
    });
  });

  describe('with provided tabIndex', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let testComponent: CheckboxWithTabIndex;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithTabIndex);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;
      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement>(
        checkboxNativeElement.querySelector('input')
      );
    });

    it('should preserve any given tabIndex', () => {
      expect(inputElement.tabIndex).toBe(7);
    });

    it('should preserve given tabIndex when the checkbox is disabled then enabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      testComponent.customTabIndex = 13;
      fixture.detectChanges();

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(inputElement.tabIndex).toBe(13);
    });
  });

  describe('with native tabindex attribute', () => {
    it('should properly detect native tabindex attribute', fakeAsync(() => {
      fixture = createComponent(CheckboxWithTabindexAttr);
      fixture.detectChanges();

      const checkbox: any = fixture.debugElement.query(By.directive(Checkbox))
        .componentInstance as Checkbox;

      expect(checkbox.tabIndex).toBe(
        5,
        'Expected tabIndex property to have been set based on the native attribute'
      );
    }));

    it('should clear the tabindex attribute from the host element', () => {
      fixture = createComponent(CheckboxWithTabindexAttr);
      fixture.detectChanges();

      const checkbox = fixture.debugElement.query(
        By.directive(Checkbox)
      ).nativeElement;
      expect(checkbox.getAttribute('tabindex')).toBeFalsy();
    });
  });

  describe('using ViewChild', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let testComponent: CheckboxUsingViewChild;

    beforeEach(() => {
      fixture = createComponent(CheckboxUsingViewChild);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should toggle checkbox disabledness correctly', () => {
      const checkboxInstance = checkboxDebugElement.componentInstance;
      const inputElement = <HTMLInputElement>(
        checkboxNativeElement.querySelector('input')
      );
      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-disabled'
      );
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(checkboxNativeElement.classList).toContain(
        'oui-checkbox-disabled'
      );
      expect(inputElement.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain(
        'oui-checkbox-disabled'
      );
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);
    });
  });

  describe('with multiple checkboxes', () => {
    beforeEach(() => {
      fixture = createComponent(MultipleCheckboxes);
      fixture.detectChanges();
    });

    it('should assign a unique id to each checkbox', () => {
      const [firstId, secondId] = fixture.debugElement
        .queryAll(By.directive(Checkbox))
        .map(
          (debugElement) => debugElement.nativeElement.querySelector('input').id
        );

      expect(firstId).toMatch(/oui-checkbox-\d+-input/);
      expect(secondId).toMatch(/oui-checkbox-\d+-input/);
      expect(firstId).not.toEqual(secondId);
    });
  });

  describe('with ngModel', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: Checkbox;
    let inputElement: HTMLInputElement;
    let ngModel: NgModel;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithNgModel);

      fixture.componentInstance.isRequired = false;
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      inputElement = <HTMLInputElement>(
        checkboxNativeElement.querySelector('input')
      );
      ngModel = checkboxDebugElement.injector.get<NgModel>(NgModel);
    });

    it('should be pristine, untouched, and valid initially', () => {
      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);
    });

    it('should not throw an error when disabling while focused', fakeAsync(() => {
      expect(() => {
        // Focus the input element because after disabling, the `blur` event should automatically
        // fire and not result in a changed after checked exception. Related: #12323
        inputElement.focus();

        // Flush the two nested timeouts from the FocusMonitor that are being created on `focus`.
        flush();

        checkboxInstance.disabled = true;
        fixture.detectChanges();
        flushMicrotasks();
      }).not.toThrow();
    }));

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
    });
  });

  describe('with name attribute', () => {
    beforeEach(() => {
      fixture = createComponent(CheckboxWithNameAttribute);
      fixture.detectChanges();
    });

    it('should forward name value to input element', () => {
      const checkboxElement = fixture.debugElement.query(
        By.directive(Checkbox)
      );
      const inputElement = <HTMLInputElement>(
        checkboxElement.nativeElement.querySelector('input')
      );

      expect(inputElement.getAttribute('name')).toBe('test-name');
    });
  });

  describe('with form control', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxInstance: Checkbox;
    let testComponent: CheckboxWithFormControl;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithFormControl);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(Checkbox));
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = <HTMLInputElement>(
        checkboxDebugElement.nativeElement.querySelector('input')
      );
    });

    it('should toggle the disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(inputElement.disabled).toBe(true);

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(inputElement.disabled).toBe(false);
    });
  });

  describe('without label', () => {
    let checkboxInnerContainer: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithoutLabel);

      const checkboxDebugEl = fixture.debugElement.query(
        By.directive(Checkbox)
      );

      checkboxInnerContainer = checkboxDebugEl.query(
        By.css('.oui-checkbox-inner-container')
      ).nativeElement;
    });

    it('should not add the "name" attribute if it is not passed in', () => {
      fixture.detectChanges();
      expect(
        checkboxInnerContainer.querySelector('input')!.hasAttribute('name')
      ).toBe(false);
    });

    it('should not add the "value" attribute if it is not passed in', () => {
      fixture.detectChanges();
      expect(
        checkboxInnerContainer.querySelector('input')!.hasAttribute('value')
      ).toBe(false);
    });
  });
});
