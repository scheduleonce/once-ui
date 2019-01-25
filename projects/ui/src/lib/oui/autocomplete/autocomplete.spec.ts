import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  createKeyboardEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  MockNgZone,
  typeInElement
} from '../core/cdk/testing';
import {
  Component,
  NgZone,
  OnDestroy,
  Provider,
  QueryList,
  ViewChild,
  ViewChildren,
  Type
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  OuiOption,
  OuiOptionSelectionChange
} from '../core';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiFormField } from '../form-field/form-field';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subscription, EMPTY } from 'rxjs';
import { OuiInputModule } from '../input/input-module';
import { OuiAutocomplete } from './autocomplete';
import {
  OUI_AUTOCOMPLETE_DEFAULT_OPTIONS,
  OuiAutocompleteModule,
  OuiAutocompleteTrigger
} from './index';

describe('OuiAutocomplete', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  // Creates a test component fixture.
  function createComponent<T>(component: Type<T>, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [
        OuiAutocompleteModule,
        OuiFormFieldModule,
        OuiInputModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [component],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        ...providers
      ]
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject(
    [OverlayContainer],
    (currentOverlayContainer: OverlayContainer) => {
      // Since we're resetting the testing module in some of the tests,
      // we can potentially have multiple overlay containers.
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();
    }
  ));

  describe('panel toggling', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should open the panel when the input is focused', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to read open when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Alabama',
        `Expected panel to display when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'California',
        `Expected panel to display when input is focused.`
      );
    });

    it('should not open the panel on focus if the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(
        false,
        'Expected panel state to start out closed.'
      );
      dispatchFakeEvent(input, 'focusin');
      flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false, 'Expected panel to stay closed.');
    }));

    it('should not open using the arrow keys when the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(
        false,
        'Expected panel state to start out closed.'
      );
      dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW);
      flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false, 'Expected panel to stay closed.');
    }));

    it('should open the panel programmatically', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to read open when opened programmatically.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Alabama',
        `Expected panel to display when opened programmatically.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'California',
        `Expected panel to display when opened programmatically.`
      );
    });

    it('should close the panel when the user clicks away', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();
      dispatchFakeEvent(document, 'click');

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected clicking outside the panel to set its state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected clicking outside the panel to close the panel.`
      );
    }));

    it('should close the panel when the user taps away on a touch device', fakeAsync(() => {
      dispatchFakeEvent(input, 'focus');
      fixture.detectChanges();
      flush();
      dispatchFakeEvent(document, 'touchend');

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected tapping outside the panel to set its state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected tapping outside the panel to close the panel.`
      );
    }));

    it('should close the panel when an option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector(
        'oui-option'
      ) as HTMLElement;
      option.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected clicking an option to set the panel state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected clicking an option to close the panel.`
      );
    }));

    it('should close the panel when a newly created option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      // Filter down the option list to a subset of original options ('Alabama', 'California')
      typeInElement('al', input);
      fixture.detectChanges();
      tick();

      let options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();

      // Changing value from 'Alabama' to 'al' to re-populate the option list,
      // ensuring that 'California' is created new.
      dispatchFakeEvent(input, 'focusin');
      typeInElement('al', input);
      fixture.detectChanges();
      tick();

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected clicking a new option to set the panel state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected clicking a new option to close the panel.`
      );
    }));

    it('should close the panel programmatically', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected closing programmatically to set the panel state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected closing programmatically to close the panel.`
      );
    });

    it('should hide the panel when the options list is empty', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      ) as HTMLElement;

      expect(panel.classList).toContain(
        'oui-autocomplete-visible',
        `Expected panel to start out visible.`
      );

      // Filter down the option list such that no options match the value
      typeInElement('af', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(panel.classList).toContain(
        'oui-autocomplete-hidden',
        `Expected panel to hide itself when empty.`
      );
    }));

    it('should not open the panel when the `input` event is invoked on a non-focused input', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      input.value = 'Alabama';
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to stay closed.`
      );
    });

    it('should toggle the visibility when typing and closing the panel', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      tick();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelector('.oui-autocomplete-panel')!
          .classList
      ).toContain('oui-autocomplete-visible', 'Expected panel to be visible.');

      typeInElement('x', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelector('.oui-autocomplete-panel')!
          .classList
      ).toContain('oui-autocomplete-hidden', 'Expected panel to be hidden.');

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      typeInElement('al', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelector('.oui-autocomplete-panel')!
          .classList
      ).toContain('oui-autocomplete-visible', 'Expected panel to be visible.');
    }));

    it('should provide the open state of the panel', fakeAsync(() => {
      expect(fixture.componentInstance.panel.isOpen).toBeFalsy(
        `Expected the panel to be unopened initially.`
      );

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.panel.isOpen).toBeTruthy(
        `Expected the panel to be opened on focus.`
      );
    }));

    it('should emit an event when the panel is opened', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalled();
    });

    it('should not emit the `opened` event when no options are being shown', () => {
      fixture.componentInstance.filteredStates = fixture.componentInstance.states = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).not.toHaveBeenCalled();
    });

    it('should not emit the opened event multiple times while typing', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);

      typeInElement('Alabam', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);
    }));

    it('should emit an event when the panel is closed', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).toHaveBeenCalled();
    });

    it('should not emit the `closed` event when no options were shown', () => {
      fixture.componentInstance.filteredStates = fixture.componentInstance.states = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).not.toHaveBeenCalled();
    });

    it('should not be able to open the panel if the autocomplete is disabled', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel to remain closed.`
      );
    });

    it('should continue to update the model if the autocomplete is disabled', () => {
      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      typeInElement('hello', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toBe('hello');
    });
  });

  it('should have the correct text direction in LTR', () => {
    const ltrFixture = createComponent(SimpleAutocomplete, [
      {
        provide: Directionality,
        useFactory: () => ({ value: 'ltr', change: EMPTY })
      }
    ]);

    ltrFixture.detectChanges();
    ltrFixture.componentInstance.trigger.openPanel();
    ltrFixture.detectChanges();

    const boundingBox = overlayContainerElement.querySelector(
      '.cdk-overlay-connected-position-bounding-box'
    )!;
    expect(boundingBox.getAttribute('dir')).toEqual('ltr');
  });

  it('should be able to set a custom value for the `autocomplete` attribute', () => {
    const fixture = createComponent(
      AutocompleteWithNativeAutocompleteAttribute
    );
    const input = fixture.nativeElement.querySelector('input');

    fixture.detectChanges();

    expect(input.getAttribute('autocomplete')).toBe('changed');
  });

  it('should not throw when typing in an element with a null and disabled autocomplete', () => {
    const fixture = createComponent(InputWithoutAutocompleteAndDisabled);
    fixture.detectChanges();

    expect(() => {
      dispatchKeyboardEvent(
        fixture.nativeElement.querySelector('input'),
        'keydown',
        SPACE
      );
      fixture.detectChanges();
    }).not.toThrow();
  });

  describe('forms integration', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should update control value as user types with input value', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      typeInElement('a', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual(
        'a',
        'Expected control value to be updated as user types.'
      );

      typeInElement('al', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual(
        'al',
        'Expected control value to be updated as user types.'
      );
    });

    it('should update control value when autofilling', () => {
      // Simulate the browser autofilling the input by setting a value and
      // dispatching an `input` event while the input is out of focus.
      expect(document.activeElement).not.toBe(
        input,
        'Expected input not to have focus.'
      );
      input.value = 'Alabama';
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toBe(
        'Alabama',
        'Expected value to be propagated to the form control.'
      );
    });

    it('should update control value when option is selected with option value', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual(
        { code: 'CA', name: 'California' },
        'Expected control value to equal the selected option value.'
      );
    }));

    it('should update the control back to a string if user types after an option is selected', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      typeInElement('Californi', input);
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.stateCtrl.value).toEqual(
        'Californi',
        'Expected control value to revert back to string.'
      );
    }));

    it('should fill the text field with display value when an option is selected', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(input.value).toContain(
        'California',
        `Expected text field to fill with selected value.`
      );
    }));

    it('should fill the text field with value if displayWith is not set', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      fixture.componentInstance.panel.displayWith = null;
      fixture.componentInstance.options.toArray()[1].value = 'test value';
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();

      fixture.detectChanges();
      expect(input.value).toContain(
        'test value',
        `Expected input to fall back to selected option's value.`
      );
    }));

    it('should fill the text field correctly if value is set to obj programmatically', fakeAsync(() => {
      fixture.componentInstance.stateCtrl.setValue({
        code: 'AL',
        name: 'Alabama'
      });
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(input.value).toContain(
        'Alabama',
        `Expected input to fill with matching option's viewValue.`
      );
    }));

    it('should clear the text field if value is reset programmatically', fakeAsync(() => {
      typeInElement('Alabama', input);
      fixture.detectChanges();
      tick();

      fixture.componentInstance.stateCtrl.reset();
      tick();

      fixture.detectChanges();
      tick();

      expect(input.value).toEqual(
        '',
        `Expected input value to be empty after reset.`
      );
    }));

    it('should disable input in view when disabled programmatically', () => {
      expect(input.disabled).toBe(
        false,
        `Expected input to start out enabled in view.`
      );

      fixture.componentInstance.stateCtrl.disable();
      fixture.detectChanges();

      expect(input.disabled).toBe(
        true,
        `Expected input to be disabled in view when disabled programmatically.`
      );
    });

    it('should mark the autocomplete control as dirty as user types', () => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      typeInElement('a', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(
        true,
        `Expected control to become dirty when the user types into the input.`
      );
    });

    it('should mark the autocomplete control as dirty when an option is selected', fakeAsync(() => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(
        true,
        `Expected control to become dirty when an option was selected.`
      );
    }));

    it('should not mark the control dirty when the value is set programmatically', () => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      fixture.componentInstance.stateCtrl.setValue('AL');
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(
        false,
        `Expected control to stay pristine if value is set programmatically.`
      );
    });

    it('should mark the autocomplete control as touched on blur', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(fixture.componentInstance.stateCtrl.touched).toBe(
        false,
        `Expected control to start out untouched.`
      );

      dispatchFakeEvent(input, 'blur');
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(
        true,
        `Expected control to become touched on blur.`
      );
    });

    it('should disable the input when used with a value accessor and without `ouiInput`', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();

      const plainFixture = createComponent(
        PlainAutocompleteInputWithFormControl
      );
      plainFixture.detectChanges();
      input = plainFixture.nativeElement.querySelector('input');

      expect(input.disabled).toBe(false);

      plainFixture.componentInstance.formControl.disable();
      plainFixture.detectChanges();

      expect(input.disabled).toBe(true);
    });
  });

  describe('keyboard events', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;
    let DOWN_ARROW_EVENT: KeyboardEvent;
    let UP_ARROW_EVENT: KeyboardEvent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
      DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);
      UP_ARROW_EVENT = createKeyboardEvent('keydown', UP_ARROW);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
    }));

    it('should not focus the option when DOWN key is pressed', () => {
      spyOn(fixture.componentInstance.options.first, 'focus');

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      expect(
        fixture.componentInstance.options.first.focus
      ).not.toHaveBeenCalled();
    });

    it('should not close the panel when DOWN key is pressed', () => {
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to stay open when DOWN key is pressed.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Alabama',
        `Expected panel to keep displaying when DOWN key is pressed.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'California',
        `Expected panel to keep displaying when DOWN key is pressed.`
      );
    });

    it('should set the active item to the first option when DOWN key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      expect(componentInstance.trigger.panelOpen).toBe(
        true,
        'Expected first down press to open the panel.'
      );

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.first
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('oui-active');
      expect(optionEls[1].classList).not.toContain('oui-active');

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.toArray()[1]
      ).toBe(true, 'Expected second option to be active.');
      expect(optionEls[0].classList).not.toContain('oui-active');
      expect(optionEls[1].classList).toContain('oui-active');
    });

    it('should set the active item to the last option when UP key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      expect(componentInstance.trigger.panelOpen).toBe(
        true,
        'Expected first up press to open the panel.'
      );

      componentInstance.trigger._handleKeydown(UP_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.last
      ).toBe(true, 'Expected last option to be active.');
      expect(optionEls[10].classList).toContain('oui-active');
      expect(optionEls[0].classList).not.toContain('oui-active');

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.first
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('oui-active');
    });

    it('should set the active item properly after filtering', fakeAsync(() => {
      const componentInstance = fixture.componentInstance;

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();
    }));

    it('should set the active item properly after filtering', () => {
      const componentInstance = fixture.componentInstance;

      typeInElement('o', input);
      fixture.detectChanges();

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.first
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('oui-active');
      expect(optionEls[1].classList).not.toContain('oui-active');
    });
  });

  describe('aria', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should set role of input to combobox', () => {
      expect(input.getAttribute('role')).toEqual(
        'combobox',
        'Expected role of input to be combobox.'
      );
    });

    it('should set role of autocomplete panel to listbox', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(
        By.css('.oui-autocomplete-panel')
      ).nativeElement;

      expect(panel.getAttribute('role')).toEqual(
        'listbox',
        'Expected role of the panel to be listbox.'
      );
    });

    it('should set aria-autocomplete to list', () => {
      expect(input.getAttribute('aria-autocomplete')).toEqual(
        'list',
        'Expected aria-autocomplete attribute to equal list.'
      );
    });

    it('should set aria-activedescendant based on the active option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.hasAttribute('aria-activedescendant')).toBe(
        false,
        'Expected aria-activedescendant to be absent if no active item.'
      );

      const DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.options.first.id,
        'Expected aria-activedescendant to match the active item after 1 down arrow.'
      );

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.options.toArray()[1].id,
        'Expected aria-activedescendant to match the active item after 2 down arrows.'
      );
    }));

    it('should set aria-expanded based on whether the panel is open', () => {
      expect(input.getAttribute('aria-expanded')).toBe(
        'false',
        'Expected aria-expanded to be false while panel is closed.'
      );

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe(
        'true',
        'Expected aria-expanded to be true while panel is open.'
      );

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe(
        'false',
        'Expected aria-expanded to be false when panel closes again.'
      );
    });

    it('should set aria-expanded properly when the panel is hidden', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(input.getAttribute('aria-expanded')).toBe(
        'true',
        'Expected aria-expanded to be true while panel is open.'
      );

      typeInElement('zz', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe(
        'false',
        'Expected aria-expanded to be false when panel hides itself.'
      );
    }));

    it('should set aria-owns based on the attached autocomplete', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(
        By.css('.oui-autocomplete-panel')
      ).nativeElement;

      expect(input.getAttribute('aria-owns')).toBe(
        panel.getAttribute('id'),
        'Expected aria-owns to match attached autocomplete.'
      );
    });

    it('should not set aria-owns while the autocomplete is closed', () => {
      expect(input.getAttribute('aria-owns')).toBeFalsy();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-owns')).toBeTruthy();
    });

    it('should restore focus to the input when clicking to select a value', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector(
        'oui-option'
      ) as HTMLElement;

      // Focus the option manually since the synthetic click may not do it.
      option.focus();
      option.click();
      fixture.detectChanges();

      expect(document.activeElement).toBe(
        input,
        'Expected focus to be restored to the input.'
      );
    }));

    it('should remove autocomplete-specific aria attributes when autocomplete is disabled', () => {
      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      expect(input.getAttribute('role')).toBeFalsy();
      expect(input.getAttribute('aria-autocomplete')).toBeFalsy();
      expect(input.getAttribute('aria-expanded')).toBeFalsy();
      expect(input.getAttribute('aria-owns')).toBeFalsy();
    });
  });

  describe('Option selection', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
    });

    it('should deselect any other selected option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.options.toArray();
      expect(componentOptions[0].selected).toBe(
        true,
        `Clicked option should be selected.`
      );

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].selected).toBe(
        false,
        `Previous option should not be selected.`
      );
      expect(componentOptions[1].selected).toBe(
        true,
        `New Clicked option should be selected.`
      );
    }));

    it('should call deselect only on the previous selected option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.options.toArray();
      componentOptions.forEach(option => spyOn(option, 'deselect'));

      expect(componentOptions[0].selected).toBe(
        true,
        `Clicked option should be selected.`
      );

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].deselect).toHaveBeenCalled();
      componentOptions
        .slice(1)
        .forEach(option => expect(option.deselect).not.toHaveBeenCalled());
    }));

    it('should be able to preselect the first option', fakeAsync(() => {
      fixture.componentInstance.trigger.autocomplete.autoActiveFirstOption = true;
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelectorAll('oui-option')[0].classList
      ).toContain('oui-active', 'Expected first option to be highlighted.');
    }));

    it('should be able to configure preselecting the first option globally', fakeAsync(() => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();
      fixture = createComponent(SimpleAutocomplete, [
        {
          provide: OUI_AUTOCOMPLETE_DEFAULT_OPTIONS,
          useValue: { autoActiveFirstOption: true }
        }
      ]);

      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelectorAll('oui-option')[0].classList
      ).toContain('oui-active', 'Expected first option to be highlighted.');
    }));

    it('should handle `optionSelections` being accessed too early', fakeAsync(() => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      fixture = TestBed.createComponent(SimpleAutocomplete);

      const spy = jasmine.createSpy('option selection spy');
      let subscription: Subscription;

      expect(fixture.componentInstance.trigger.autocomplete).toBeFalsy();
      expect(() => {
        subscription = fixture.componentInstance.trigger.optionSelections.subscribe(
          spy
        );
      }).not.toThrow();

      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector(
        'oui-option'
      ) as HTMLElement;

      option.click();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(spy).toHaveBeenCalledWith(jasmine.any(OuiOptionSelectionChange));
      subscription!.unsubscribe();
    }));
  });
});

@Component({
  template: `
    <oui-form-field [style.width.px]="width">
      <input
        oui-input
        placeholder="State"
        [ouiAutocomplete]="auto"
        [ouiAutocompleteDisabled]="autocompleteDisabled"
        [formControl]="stateCtrl"
      />
    </oui-form-field>
    <oui-autocomplete
      class="class-one class-two"
      #auto="ouiAutocomplete"
      [displayWith]="displayFn"
      (opened)="openedSpy()"
      (closed)="closedSpy()"
    >
      <oui-option *ngFor="let state of filteredStates" [value]="state">
        <span>{{ state.code }}: {{ state.name }}</span>
      </oui-option>
    </oui-autocomplete>
  `
})
class SimpleAutocomplete implements OnDestroy {
  stateCtrl = new FormControl();
  filteredStates: any[];
  valueSub: Subscription;
  // floatLabel = 'auto';
  width: number;
  disableRipple = false;
  autocompleteDisabled = false;
  openedSpy = jasmine.createSpy('autocomplete opened spy');
  closedSpy = jasmine.createSpy('autocomplete closed spy');

  @ViewChild(OuiAutocompleteTrigger) trigger: OuiAutocompleteTrigger;
  @ViewChild(OuiAutocomplete) panel: OuiAutocomplete;
  @ViewChild(OuiFormField) formField: OuiFormField;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;

  states = [
    { code: 'AL', name: 'Alabama' },
    { code: 'CA', name: 'California' },
    { code: 'FL', name: 'Florida' },
    { code: 'KS', name: 'Kansas' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'NY', name: 'New York' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WY', name: 'Wyoming' }
  ];

  constructor() {
    this.filteredStates = this.states;
    this.valueSub = this.stateCtrl.valueChanges.subscribe(val => {
      this.filteredStates = val
        ? this.states.filter(s => s.name.match(new RegExp(val, 'gi')))
        : this.states;
    });
  }

  displayFn(value: any): string {
    return value ? value.name : value;
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
  }
}

@Component({
  template: `
    <input [formControl]="formControl" [ouiAutocomplete]="auto" />
    <oui-autocomplete #auto="ouiAutocomplete"></oui-autocomplete>
  `
})
class PlainAutocompleteInputWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: `
    <input
      autocomplete="changed"
      [(ngModel)]="value"
      [ouiAutocomplete]="auto"
    />
    <oui-autocomplete #auto="ouiAutocomplete"></oui-autocomplete>
  `
})
class AutocompleteWithNativeAutocompleteAttribute {
  value: string;
}

@Component({
  template: '<input [ouiAutocomplete]="null" ouiAutocompleteDisabled>'
})
class InputWithoutAutocompleteAndDisabled {}
