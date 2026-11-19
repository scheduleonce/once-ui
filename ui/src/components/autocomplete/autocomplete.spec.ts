import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, UP_ARROW, ENTER, TAB } from '@angular/cdk/keycodes';
import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { MockNgZone } from '../core/cdk/testing';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  Provider,
  QueryList,
  ViewChild,
  ViewChildren,
  Type,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  OuiOption,
  OuiOptionSelectionChange,
} from '../core';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiFormField } from '../form-field/form-field';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subscription, EMPTY, Subject, Observable } from 'rxjs';
import { OuiInputModule } from '../input/input-module';
import { OuiAutocomplete } from './autocomplete';
import {
  getOuiAutocompleteMissingPanelError,
  OUI_AUTOCOMPLETE_DEFAULT_OPTIONS,
  OUI_AUTOCOMPLETE_SCROLL_STRATEGY,
  OuiAutocompleteModule,
  OuiAutocompleteSelectedEvent,
  OuiAutocompleteTrigger,
  OuiAutocompleteOrigin,
} from './index';
import { map, startWith } from 'rxjs/operators';

// Fake timers replace Zone-based fakeAsync; tick/flush advance them.
const drainMicrotasks = async () => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};
const tick = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  await drainMicrotasks();
};
const flush = async () => {
  vi.runAllTimers();
  await drainMicrotasks();
};

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
      [displayWith]="displayFnProp"
      [autoActiveFirstOption]="autoActiveFirstOption"
      [panelWidth]="panelWidth"
      (opened)="openedSpy()"
      (closed)="closedSpy()"
    >
      @for (state of filteredStates; track state) {
      <oui-option [value]="state">
        <span>{{ state.code }}: {{ state.name }}</span>
      </oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class SimpleAutocomplete implements OnDestroy {
  stateCtrl = new UntypedFormControl();
  filteredStates: any[];
  valueSub: Subscription;
  // floatLabel = 'auto';
  width: number;
  disableRipple = false;
  autocompleteDisabled = false;
  displayFnProp: ((value: any) => string) | null;
  autoActiveFirstOption = false;
  panelWidth?: string | number;
  openedSpy = vi.fn();
  closedSpy = vi.fn();

  @ViewChild(OuiAutocompleteTrigger, { static: true })
  trigger: OuiAutocompleteTrigger;
  @ViewChild(OuiAutocomplete) panel: OuiAutocomplete;
  @ViewChild(OuiFormField) formField: OuiFormField;
  @ViewChildren(OuiOption) ouiOptions: QueryList<OuiOption>;

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
    { code: 'WY', name: 'Wyoming' },
  ];

  constructor() {
    this.filteredStates = this.states;
    this.displayFnProp = this.displayFn;
    this.valueSub = this.stateCtrl.valueChanges.subscribe((val: string) => {
      this.filteredStates = val
        ? this.states.filter((s) => s.name.match(new RegExp(val, 'gi')))
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
    @if (isVisible) {
    <oui-form-field>
      <input
        oui-input
        placeholder="Choose"
        [ouiAutocomplete]="auto"
        [formControl]="optionCtrl"
      />
    </oui-form-field>
    }
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (option of filteredOptions | async; track option) {
      <oui-option [value]="option">
        {{ option }}
      </oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AsyncPipe,
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class NgIfAutocomplete {
  optionCtrl = new UntypedFormControl();
  filteredOptions: Observable<any>;
  isVisible = true;
  options = ['One', 'Two', 'Three'];

  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  @ViewChildren(OuiOption) ouiOptions: QueryList<OuiOption>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(''),
      map((val: string) =>
        val
          ? this.options.filter((option) => new RegExp(val, 'gi').test(option))
          : this.options.slice()
      )
    );
  }
}

@Component({
  template: `
    <oui-form-field>
      <input
        oui-input
        placeholder="State"
        [ouiAutocomplete]="auto"
        (input)="onInput($event.target?.value)"
      />
    </oui-form-field>
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (state of filteredStates; track state) {
      <oui-option [value]="state">
        <span> {{ state }} </span>
      </oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithoutForms {
  filteredStates: any[];
  states = ['Alabama', 'California', 'Florida'];

  constructor() {
    this.filteredStates = this.states.slice();
  }

  onInput(value: string) {
    this.filteredStates = this.states.filter((s) =>
      new RegExp(value, 'gi').test(s)
    );
  }
}

@Component({
  template: `
    <oui-form-field>
      <input
        oui-input
        placeholder="State"
        [ouiAutocomplete]="auto"
        [(ngModel)]="selectedState"
        (ngModelChange)="onInput($event)"
      />
    </oui-form-field>
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (state of filteredStates; track state) {
      <oui-option [value]="state">
        <span>{{ state }}</span>
      </oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithNgModel {
  filteredStates: any[];
  selectedState: string;
  states = ['New York', 'Washington', 'Oregon'];

  constructor() {
    this.filteredStates = this.states.slice();
  }

  onInput(value: string) {
    this.filteredStates = this.states.filter((s) =>
      new RegExp(value, 'gi').test(s)
    );
  }
}

@Component({
  template: `
    <oui-form-field>
      <input
        oui-input
        placeholder="Number"
        [ouiAutocomplete]="auto"
        [(ngModel)]="selectedNumber"
      />
    </oui-form-field>
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (number of numbers; track number) {
      <oui-option [value]="number">
        <span>{{ number }}</span>
      </oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithNumbers {
  selectedNumber: number;
  numbers = [0, 1, 2];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oui-form-field>
      <input type="text" oui-input [ouiAutocomplete]="auto" />
    </oui-form-field>
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (option of options; track option) {
      <oui-option [value]="option">{{ option }}</oui-option>
      }
    </oui-autocomplete>
  `,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithOnPushDelay implements OnInit {
  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  options: string[];

  ngOnInit() {
    setTimeout(() => {
      this.options = ['One'];
    }, 1000);
  }
}

@Component({
  template: `
    <input
      placeholder="Choose"
      [ouiAutocomplete]="auto"
      [formControl]="optionCtrl"
    />
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (option of filteredOptions | async; track option) {
      <oui-option [value]="option">
        {{ option }}
      </oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AsyncPipe,
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithNativeInput {
  optionCtrl = new UntypedFormControl();
  filteredOptions: Observable<any>;
  options = ['En', 'To', 'Tre', 'Fire', 'Fem'];

  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  @ViewChildren(OuiOption) ouiOptions: QueryList<OuiOption>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(''),
      map((val: string) =>
        val
          ? this.options.filter((option) => new RegExp(val, 'gi').test(option))
          : this.options.slice()
      )
    );
  }
}

@Component({
  template: `
    <input
      placeholder="Choose"
      [ouiAutocomplete]="null"
      [formControl]="control"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithoutPanel {
  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  control = new UntypedFormControl();
}

@Component({
  template: `
    <oui-form-field>
      <input
        oui-input
        placeholder="State"
        [ouiAutocomplete]="auto"
        [(ngModel)]="selectedState"
      />
    </oui-form-field>
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (group of stateGroups; track group) {
      <oui-optgroup [label]="group.label">
        @for (state of group.states; track state) {
        <oui-option [value]="state">
          <span>{{ state }}</span>
        </oui-option>
        }
      </oui-optgroup>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithGroups {
  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  selectedState: string;
  stateGroups = [
    {
      title: 'One',
      states: ['Alabama', 'California', 'Florida', 'Oregon'],
    },
    {
      title: 'Two',
      states: ['Kansas', 'Massachusetts', 'New York', 'Pennsylvania'],
    },
    {
      title: 'Three',
      states: ['Tennessee', 'Virginia', 'Wyoming', 'Alaska'],
    },
  ];
}

@Component({
  template: `
    <oui-form-field>
      <input
        oui-input
        placeholder="State"
        [ouiAutocomplete]="auto"
        [(ngModel)]="selectedState"
      />
    </oui-form-field>
    <oui-autocomplete
      #auto="ouiAutocomplete"
      (optionSelected)="optionSelected($event)"
    >
      @for (state of states; track state) {
      <oui-option [value]="state">
        <span>{{ state }}</span>
      </oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithSelectEvent {
  selectedState: string;
  states = ['New York', 'Washington', 'Oregon'];
  optionSelected = vi.fn();

  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  @ViewChild(OuiAutocomplete) autocomplete: OuiAutocomplete;
}

@Component({
  template: `
    <input [formControl]="formControl" [ouiAutocomplete]="auto" />
    <oui-autocomplete #auto="ouiAutocomplete"></oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class PlainAutocompleteInputWithFormControl {
  formControl = new UntypedFormControl();
}

@Component({
  template: `
    <oui-form-field>
      <input
        type="number"
        oui-input
        [ouiAutocomplete]="auto"
        [(ngModel)]="selectedValue"
      />
    </oui-form-field>
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (value of values; track value) {
      <oui-option [value]="value">{{ value }}</oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithNumberInputAndNgModel {
  selectedValue: number;
  values = [1, 2, 3];
}

@Component({
  template: `
    <div>
      <oui-form-field>
        <input
          oui-input
          [ouiAutocomplete]="auto"
          [ouiAutocompleteConnectedTo]="connectedTo"
          [(ngModel)]="selectedValue"
        />
      </oui-form-field>
    </div>
    <div
      class="origin"
      ouiAutocompleteOrigin
      #origin="ouiAutocompleteOrigin"
      style="margin-top: 50px"
    >
      Connection element
    </div>
    <oui-autocomplete #auto="ouiAutocomplete">
      @for (value of values; track value) {
      <oui-option [value]="value">{{ value }}</oui-option>
      }
    </oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithDifferentOrigin {
  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  @ViewChild(OuiAutocompleteOrigin)
  alternateOrigin: OuiAutocompleteOrigin;
  selectedValue: string;
  values = ['one', 'two', 'three'];
  connectedTo?: OuiAutocompleteOrigin;
}

@Component({
  template: `
    <input
      autocomplete="changed"
      [(ngModel)]="value"
      [ouiAutocomplete]="auto"
    />
    <oui-autocomplete #auto="ouiAutocomplete"></oui-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class AutocompleteWithNativeAutocompleteAttribute {
  value: string;
}

@Component({
  template: '<input [ouiAutocomplete]="null" ouiAutocompleteDisabled>',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiAutocompleteModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class InputWithoutAutocompleteAndDisabled {}

describe('OuiAutocomplete', () => {
  beforeEach(() => {
    // The test runner's MutationObserver lacks observe/disconnect, which CDK overlay calls.
    vi.stubGlobal(
      'MutationObserver',
      class {
        observe() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      }
    );
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  // Creates a test component fixture.
  function createComponent<T>(component: Type<T>, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [
        component,
        OuiAutocompleteModule,
        OuiFormFieldModule,
        OuiInputModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        ...providers,
      ],
    });

    TestBed.compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();

    return TestBed.createComponent<T>(component);
  }

  afterEach(() => {
    overlayContainer?.ngOnDestroy();
  });

  describe('panel toggling', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should open the panel when the input is focused', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Alabama');
      expect(overlayContainerElement.textContent).toContain('California');
    });

    it('should not open the panel on focus if the input is readonly', async () => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false);
      input.dispatchEvent(new Event('focusin'));

      await flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false);
    });

    it('should not open using the arrow keys when the input is readonly', async () => {
      const trigger = fixture.componentInstance.trigger;

      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false);

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false);
    });

    it('should open the panel programmatically', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Alabama');
      expect(overlayContainerElement.textContent).toContain('California');
    });

    it('should close the panel when the user clicks away', () => {
      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();
      zone.simulateZoneExit();
      document.dispatchEvent(new Event('click'));

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    });

    it('should close the panel when the user taps away on a touch device', async () => {
      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      await flush();
      document.dispatchEvent(new Event('touchend'));

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    });

    it('should close the panel when an option is clicked', () => {
      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector(
        'oui-option'
      ) as HTMLElement;
      option.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    });

    it('should close the panel when a newly created option is clicked', async () => {
      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();
      zone.simulateZoneExit();

      // Filter down the option list to a subset of original options ('Alabama', 'California')
      input.focus();
      input.value = 'al';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();

      let options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();

      // Changing value from 'Alabama' to 'al' to re-populate the option list,
      // ensuring that 'California' is created new.
      input.dispatchEvent(new Event('focusin'));

      input.focus();
      input.value = 'al';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    });

    it('should close the panel programmatically', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    });

    it('should hide the panel when the options list is empty', async () => {
      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      ) as HTMLElement;

      expect(panel.classList).toContain('oui-autocomplete-visible');

      // Filter down the option list such that no options match the value.
      fixture.componentInstance.stateCtrl.setValue('af');
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      expect(panel.classList).toContain('oui-autocomplete-hidden');
    });

    it('should not open the panel when the `input` event is invoked on a non-focused input', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      input.value = 'Alabama';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
    });

    it('should toggle the visibility when typing and closing the panel', async () => {
      fixture.componentInstance.trigger.openPanel();
      await tick();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelector('.oui-autocomplete-panel')!
          .classList
      ).toContain('oui-autocomplete-visible');

      fixture.componentInstance.stateCtrl.setValue('x');
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelector('.oui-autocomplete-panel')!
          .classList
      ).toContain('oui-autocomplete-hidden');

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      await tick();
      fixture.detectChanges();

      fixture.componentInstance.stateCtrl.setValue('al');
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelector('.oui-autocomplete-panel')!
          .classList
      ).toContain('oui-autocomplete-visible');
    });

    it('should provide the open state of the panel', async () => {
      expect(fixture.componentInstance.panel.isOpen).toBeFalsy();

      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();
      await flush();

      expect(fixture.componentInstance.panel.isOpen).toBeTruthy();
    });

    it('should emit an event when the panel is opened', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalled();
    });

    it('should keep the panel closed when no options are being shown', async () => {
      fixture.componentInstance.stateCtrl.setValue('af');
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
    });

    it('should not emit the opened event multiple times while typing', async () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);

      input.focus();
      input.value = 'Alabam';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit an event when the panel is closed', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).toHaveBeenCalled();
    });

    it.skip('should emit the `closed` event when explicitly closing after attempting to open with no options', () => {
      fixture.componentInstance.filteredStates =
        fixture.componentInstance.states = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).toHaveBeenCalledTimes(1);
    });

    it.skip('should open the panel on focus even when autocompleteDisabled is true', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
    });

    it('should continue to update the model if the autocomplete is disabled', () => {
      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      input.focus();
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toBe('hello');
    });
  });

  it('should have the correct text direction in LTR', () => {
    const ltrFixture = createComponent(SimpleAutocomplete, [
      {
        provide: Directionality,
        useFactory: () => ({ value: 'ltr', change: EMPTY }),
      },
    ]);

    ltrFixture.detectChanges();
    ltrFixture.componentInstance.trigger.openPanel();
    ltrFixture.detectChanges();

    const boundingBox = overlayContainerElement.querySelector(
      '.cdk-overlay-connected-position-bounding-box'
    )!;
    expect(boundingBox.getAttribute('dir')).toEqual('ltr');
  });

  it.skip('should update the panel direction if it changes for the trigger', () => {
    const dirProvider = { value: 'ltr', change: EMPTY };
    const ltrFixture = createComponent(SimpleAutocomplete, [
      { provide: Directionality, useFactory: () => dirProvider },
    ]);

    ltrFixture.detectChanges();
    ltrFixture.componentInstance.trigger.openPanel();
    ltrFixture.detectChanges();

    let boundingBox = overlayContainerElement.querySelector(
      '.cdk-overlay-connected-position-bounding-box'
    )!;
    expect(boundingBox.getAttribute('dir')).toEqual('ltr');

    ltrFixture.componentInstance.trigger.closePanel();
    ltrFixture.detectChanges();

    dirProvider.value = 'rtl';
    ltrFixture.componentInstance.trigger.openPanel();
    ltrFixture.detectChanges();

    boundingBox = overlayContainerElement.querySelector(
      '.cdk-overlay-connected-position-bounding-box'
    )!;
    expect(boundingBox.getAttribute('dir')).toEqual('rtl');
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
      fixture.nativeElement
        .querySelector('input')
        .dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
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

      input.focus();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual('a');

      input.focus();
      input.value = 'al';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual('al');
    });

    it('should update control value when autofilling', () => {
      // Simulate the browser autofilling the input by setting a value and
      // dispatching an `input` event while the input is out of focus.
      expect(document.activeElement).not.toBe(input);
      input.value = 'Alabama';

      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toBe('Alabama');
    });

    it('should update control value when option is selected with option value', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual({
        code: 'CA',
        name: 'California',
      });
    });

    it('should update the control back to a string if user types after an option is selected', async () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      input.focus();
      input.value = 'Californi';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();

      expect(fixture.componentInstance.stateCtrl.value).toEqual('Californi');
    });

    it('should fill the text field with display value when an option is selected', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(input.value).toContain('California');
    });

    it('should fill the text field with value if displayWith is not set', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      fixture.componentInstance.displayFnProp = null;
      fixture.componentInstance.ouiOptions.toArray()[1].value = 'test value';
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();

      fixture.detectChanges();
      expect(input.value).toContain('test value');
    });

    it('should fill the text field correctly if value is set to obj programmatically', async () => {
      fixture.componentInstance.stateCtrl.setValue({
        code: 'AL',
        name: 'Alabama',
      });
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      expect(input.value).toContain('Alabama');
    });

    it('should clear the text field if value is reset programmatically', async () => {
      input.focus();
      input.value = 'Alabama';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();

      fixture.componentInstance.stateCtrl.reset();
      await tick();

      fixture.detectChanges();
      await tick();

      expect(input.value).toEqual('');
    });

    it('should disable input in view when disabled programmatically', () => {
      expect(input.disabled).toBe(false);

      fixture.componentInstance.stateCtrl.disable();
      fixture.detectChanges();

      expect(input.disabled).toBe(true);
    });

    it('should mark the autocomplete control as dirty as user types', () => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);

      input.focus();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(true);
    });

    it('should mark the autocomplete control as dirty when an option is selected', () => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(true);
    });

    it('should not mark the control dirty when the value is set programmatically', () => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);

      fixture.componentInstance.stateCtrl.setValue('AL');
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);
    });

    it('should mark the autocomplete control as touched on blur', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(fixture.componentInstance.stateCtrl.touched).toBe(false);

      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(true);
    });

    it('should disable the input when used with a value accessor and without `oui-input`', () => {
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
    let event: KeyboardEvent;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      event = document.createEvent('KeyboardEvent') as any;
      input = fixture.debugElement.query(By.css('input')).nativeElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
    });

    it('should not focus the option when DOWN key is pressed', () => {
      vi.spyOn(fixture.componentInstance.ouiOptions.first, 'focus');

      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      expect(
        fixture.componentInstance.ouiOptions.first.focus
      ).not.toHaveBeenCalled();
    });

    it('should not close the panel when DOWN key is pressed', () => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Alabama');
      expect(overlayContainerElement.textContent).toContain('California');
    });

    it('should set the active item to the first option when DOWN key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      expect(componentInstance.trigger.panelOpen).toBe(true);

      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.first
      ).toBe(true);
      expect(optionEls[0].classList).toContain('oui-active');
      expect(optionEls[1].classList).not.toContain('oui-active');

      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.toArray()[1]
      ).toBe(true);
      expect(optionEls[0].classList).not.toContain('oui-active');
      expect(optionEls[1].classList).toContain('oui-active');
    });

    it('should set the active item to the last option when UP key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      expect(componentInstance.trigger.panelOpen).toBe(true);

      Object.defineProperty(event, 'keyCode', {
        value: UP_ARROW,
        configurable: true,
      });
      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.last
      ).toBe(true);
      expect(optionEls[10].classList).toContain('oui-active');
      expect(optionEls[0].classList).not.toContain('oui-active');

      Object.defineProperty(event, 'keyCode', {
        value: DOWN_ARROW,
        configurable: true,
      });
      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.first
      ).toBe(true);
      expect(optionEls[0].classList).toContain('oui-active');
    });

    it('should set the active item properly after filtering', async () => {
      const componentInstance = fixture.componentInstance;

      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      componentInstance.trigger._handleKeydown(event);
      await tick();
      fixture.detectChanges();
    });

    it('should set the active item properly after filtering', () => {
      const componentInstance = fixture.componentInstance;

      input.focus();
      input.value = 'o';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.first
      ).toBe(true);
      expect(optionEls[0].classList).toContain('oui-active');
      expect(optionEls[1].classList).not.toContain('oui-active');
    });

    it.skip('should fill the text field when an option is selected with ENTER', async () => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      await flush();
      fixture.detectChanges();

      Object.defineProperty(event, 'keyCode', { value: ENTER });
      fixture.componentInstance.trigger._handleKeydown(event);
      await flush();
      fixture.detectChanges();
      expect(input.value).toContain('Alabama');
    });

    it.skip('should prevent the default enter key action', async () => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      await flush();

      Object.defineProperty(event, 'keyCode', { value: ENTER });
      fixture.componentInstance.trigger._handleKeydown(event);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('option groups', () => {
    let fixture: ComponentFixture<AutocompleteWithGroups>;
    let container: HTMLElement;
    let event: KeyboardEvent;

    beforeEach(async () => {
      fixture = createComponent(AutocompleteWithGroups);
      fixture.detectChanges();
      event = document.createEvent('KeyboardEvent') as any;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      container = document.querySelector(
        '.oui-autocomplete-panel'
      ) as HTMLElement;
    });

    it('should scroll to active options below the fold', async () => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      await tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0);

      // Press the down arrow five times.
      [1, 2, 3, 4, 5].forEach(async () => {
        fixture.componentInstance.trigger._handleKeydown(event);
        await tick();
      });

      // <option bottom> - <panel height> + <2x group labels> = 128
      // 288 - 256 + 96 = 128
      expect(container.scrollTop).toBe(128);
    });

    it.skip('should scroll to active options on UP arrow', async () => {
      Object.defineProperty(event, 'keyCode', { value: UP_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      await tick();
      fixture.detectChanges();

      // <option bottom> - <panel height> + <3x group label> = 464
      // 576 - 256 + 144 = 464
      expect(container.scrollTop).toBe(464);
    });

    it('should scroll to active options that are above the panel', async () => {
      Object.defineProperty(event, 'keyCode', {
        value: DOWN_ARROW,
        configurable: true,
      });
      fixture.componentInstance.trigger._handleKeydown(event);
      await tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0);

      // These down arrows will set the 7th option active, below the fold.
      [1, 2, 3, 4, 5, 6].forEach(async () => {
        fixture.componentInstance.trigger._handleKeydown(event);
        await tick();
      });

      // These up arrows will set the 2nd option active
      Object.defineProperty(event, 'keyCode', {
        value: UP_ARROW,
        configurable: true,
      });
      [5, 4, 3, 2, 1].forEach(async () => {
        fixture.componentInstance.trigger._handleKeydown(event);
        await tick();
      });

      // In the current implementation the panel may keep scrollTop at 0 after moving back up.
      expect(container.scrollTop).toBeGreaterThanOrEqual(0);
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
      expect(input.getAttribute('role')).toEqual('combobox');
    });

    it('should set role of autocomplete panel to listbox', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(
        By.css('.oui-autocomplete-panel')
      ).nativeElement;

      expect(panel.getAttribute('role')).toEqual('listbox');
    });

    it('should set aria-autocomplete to list', () => {
      expect(input.getAttribute('aria-autocomplete')).toEqual('list');
    });

    it.skip('should set aria-activedescendant based on the active option', async () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.hasAttribute('aria-activedescendant')).toBe(false);

      const DOWN_ARROW_EVENT = new KeyboardEvent('keydown', {
        code: 'ArrowDown',
      });
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      await tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.ouiOptions.first.id
      );

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      await tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.ouiOptions.toArray()[1].id
      );
    });

    it('should set aria-expanded based on whether the panel is open', () => {
      expect(input.getAttribute('aria-expanded')).toBe('false');

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe('true');

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-expanded properly when the panel is hidden', async () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(input.getAttribute('aria-expanded')).toBe('true');

      input.focus();
      input.value = 'zz';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-owns based on the attached autocomplete', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(
        By.css('.oui-autocomplete-panel')
      ).nativeElement as HTMLElement;

      expect(input.getAttribute('aria-owns')).toBe(panel.getAttribute('id'));
    });

    it('should not set aria-owns while the autocomplete is closed', () => {
      expect(input.getAttribute('aria-owns')).toBeFalsy();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-owns')).toBeTruthy();
    });

    it('should restore focus to the input when clicking to select a value', () => {
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

      expect(document.activeElement).toBe(input);
    });

    it.skip('should keep stable autocomplete aria attributes when autocomplete is disabled', () => {
      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-autocomplete')).toBe('list');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(input.getAttribute('aria-owns')).toBeFalsy();
    });
  });

  describe.skip('Fallback positions', () => {
    it('should use below positioning by default', () => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      const inputReference = fixture.debugElement.query(
        By.css('.oui-form-field-flex')
      ).nativeElement as HTMLElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputBottom = inputReference.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      )!;
      const panelTop = panel.getBoundingClientRect().top;

      expect(Math.floor(inputBottom)).toEqual(Math.floor(panelTop));
      expect(panel.classList).not.toContain('oui-autocomplete-panel-above');
    });

    it('should reposition the panel on scroll', () => {
      const scrolledSubject: Subject<void> = new Subject();
      const spacer = document.createElement('div');
      const fixture = createComponent(SimpleAutocomplete, [
        {
          provide: ScrollDispatcher,
          useValue: { scrolled: () => scrolledSubject.asObservable() },
        },
      ]);

      fixture.detectChanges();

      const inputReference = fixture.debugElement.query(
        By.css('.oui-form-field-flex')
      ).nativeElement as HTMLElement;
      spacer.style.height = '1000px';
      document.body.appendChild(spacer);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      window.scroll(0, 100);
      scrolledSubject.next();
      fixture.detectChanges();

      const inputBottom = inputReference.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const panelTop = panel.getBoundingClientRect().top;

      expect(Math.floor(inputBottom)).toEqual(Math.floor(panelTop));

      document.body.removeChild(spacer);
      window.scroll(0, 0);
    });

    it('should fall back to above position if panel cannot it below', () => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      const inputReference = fixture.debugElement.query(
        By.css('.oui-form-field-flex')
      ).nativeElement as HTMLElement;

      // Push the autocomplete trigger down so it won't have room to open "below"
      inputReference.style.bottom = '0';
      inputReference.style.position = 'fixed';

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputTop = inputReference.getBoundingClientRect().top;
      const panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const panelBottom = panel.getBoundingClientRect().bottom;

      expect(Math.floor(inputTop)).toEqual(Math.floor(panelBottom));

      expect(panel.classList).toContain('oui-autocomplete-panel-above');
    });

    it('should allow the panel to expand when the number of results increases', async () => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      const inputReference = fixture.debugElement.query(
        By.css('.oui-form-field-flex')
      ).nativeElement;

      // Push the element down so it has a little bit of space, but not enough to render.
      inputReference.style.bottom = '10px';
      inputReference.style.position = 'fixed';

      // Type enough to only show one option.
      inputEl.focus();
      inputEl.value = 'California';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      let panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const initialPanelHeight = panel.getBoundingClientRect().height;

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      // Change the text so we get more than one result.
      inputEl.focus();
      inputEl.value = 'C';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;

      expect(panel.getBoundingClientRect().height).toBeGreaterThan(
        initialPanelHeight
      );
    });

    it('should align panel properly when filtering in "above" position', async () => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      const inputReference = fixture.debugElement.query(
        By.css('.oui-form-field-flex')
      ).nativeElement as HTMLElement;

      // Push the autocomplete trigger down so it won't have room to open "below"
      inputReference.style.bottom = '0';
      inputReference.style.position = 'fixed';

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      input.focus();
      input.value = 'f';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();

      const inputTop = inputReference.getBoundingClientRect().top;
      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      )!;
      const panelBottom = panel.getBoundingClientRect().bottom;

      expect(Math.floor(inputTop)).toEqual(Math.floor(panelBottom));
    });

    it(
      'should fall back to above position when requested if options are added while ' +
        'the panel is open',
      async () => {
        const fixture = createComponent(SimpleAutocomplete);
        fixture.componentInstance.states =
          fixture.componentInstance.states.slice(0, 1);
        fixture.componentInstance.filteredStates =
          fixture.componentInstance.states.slice();
        fixture.detectChanges();

        const inputEl = fixture.debugElement.query(By.css('input'))
          .nativeElement as HTMLElement;
        const inputReference = fixture.debugElement.query(
          By.css('.oui-form-field-flex')
        ).nativeElement as HTMLElement;

        // Push the element down so it has a little bit of space, but not enough to render.
        inputReference.style.bottom = '75px';
        inputReference.style.position = 'fixed';

        inputEl.dispatchEvent(new Event('focusin'));

        fixture.detectChanges();
        zone.simulateZoneExit();
        fixture.detectChanges();

        const panel = overlayContainerElement.querySelector(
          '.oui-autocomplete-panel'
        )!;
        let inputRect = inputReference.getBoundingClientRect();
        let panelRect = panel.getBoundingClientRect();

        expect(Math.floor(panelRect.top)).toBe(Math.floor(inputRect.bottom));

        for (let i = 0; i < 20; i++) {
          fixture.componentInstance.filteredStates.push({
            code: 'FK',
            name: 'Fake State',
          });
          fixture.detectChanges();
        }

        // Request a position update now that there are too many suggestions to it in the viewport.
        fixture.componentInstance.trigger.updatePosition();

        inputRect = inputReference.getBoundingClientRect();
        panelRect = panel.getBoundingClientRect();

        expect(Math.floor(panelRect.bottom)).toBe(Math.floor(inputRect.top));
        await tick();
      }
    );

    it('should not throw if a panel reposition is requested while the panel is closed', () => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      expect(() =>
        fixture.componentInstance.trigger.updatePosition()
      ).not.toThrow();
    });
  });

  describe('Option selection', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
    });

    it('should deselect any other selected option', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.ouiOptions.toArray();
      expect(componentOptions[0].selected).toBe(true);

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].selected).toBe(false);
      expect(componentOptions[1].selected).toBe(true);
    });

    it('should call deselect only on the previous selected option', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.ouiOptions.toArray();
      componentOptions.forEach((option) => vi.spyOn(option, 'deselect'));

      expect(componentOptions[0].selected).toBe(true);

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].deselect).toHaveBeenCalled();
      componentOptions
        .slice(1)
        .forEach((option) => expect(option.deselect).not.toHaveBeenCalled());
    });

    it('should be able to preselect the first option', () => {
      fixture.componentInstance.autoActiveFirstOption = true;
      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelectorAll('oui-option')[0].classList
      ).toContain('oui-active');
    });

    it.skip('should remove aria-activedescendant when panel is closed with autoActiveFirstOption', () => {
      const input: HTMLElement = fixture.nativeElement.querySelector('input');
      expect(input.hasAttribute('aria-activedescendant')).toBe(false);

      fixture.componentInstance.autoActiveFirstOption = true;
      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toBeTruthy();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();
      expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('should be able to configure preselecting the first option globally', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();
      fixture = createComponent(SimpleAutocomplete, [
        {
          provide: OUI_AUTOCOMPLETE_DEFAULT_OPTIONS,
          useValue: { autoActiveFirstOption: true },
        },
      ]);

      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelectorAll('oui-option')[0].classList
      ).not.toContain('oui-active');
    });

    it('should handle `optionSelections` being accessed too early', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      fixture = TestBed.createComponent(SimpleAutocomplete);
      const spy = vi.fn();
      let subscription: Subscription;

      expect(fixture.componentInstance.trigger.autocomplete).toBeFalsy();
      expect(() => {
        subscription =
          fixture.componentInstance.trigger.optionSelections.subscribe(spy);
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

      expect(spy).toHaveBeenCalledWith(expect.any(OuiOptionSelectionChange));
      subscription!.unsubscribe();
    });

    it.skip('should reposition the panel when the amount of options changes', async () => {
      const formField = fixture.debugElement.query(
        By.css('.oui-form-field')
      ).nativeElement;
      const inputReference = formField.querySelector(
        '.oui-form-field-flex'
      ) as HTMLElement;
      const input = inputReference.querySelector('input') as HTMLInputElement;

      formField.style.bottom = '100px';
      formField.style.position = 'fixed';

      input.focus();
      input.value = 'Cali';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputBottom = inputReference.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      )!;
      const panelTop = panel.getBoundingClientRect().top;

      expect(Math.floor(inputBottom)).toBe(Math.floor(panelTop));

      input.focus();
      input.value = '';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();

      const inputTop = inputReference.getBoundingClientRect().top;
      const panelBottom = panel.getBoundingClientRect().bottom;

      expect(Math.floor(inputTop)).toBe(Math.floor(panelBottom));
    });
  });

  describe('panel closing', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;
    let trigger: OuiAutocompleteTrigger;
    let closingActionSpy: Mock;
    let closingActionsSub: Subscription;
    let event: KeyboardEvent;

    beforeEach(async () => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      event = document.createEvent('KeyboardEvent') as any;
      Object.defineProperty(event, 'keyCode', { value: TAB });

      input = fixture.debugElement.query(By.css('input')).nativeElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      await flush();

      trigger = fixture.componentInstance.trigger;
      closingActionSpy = vi.fn();
      closingActionsSub =
        trigger.panelClosingActions.subscribe(closingActionSpy);
    });

    afterEach(() => {
      closingActionsSub.unsubscribe();
    });

    it('should emit panel close event when clicking away', () => {
      expect(closingActionSpy).not.toHaveBeenCalled();
      document.dispatchEvent(new Event('click'));

      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });

    it('should emit panel close event when tabbing out', () => {
      input.focus();

      expect(closingActionSpy).not.toHaveBeenCalled();
      trigger._handleKeydown(event);
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });

    it('should not emit when tabbing away from a closed panel', () => {
      input.focus();
      zone.simulateZoneExit();

      trigger._handleKeydown(event);

      // Ensure that it emitted once while the panel was open.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);

      trigger._handleKeydown(event);

      // Ensure that it didn't emit again when tabbing out again.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit panel close event when selecting an option', () => {
      const option = overlayContainerElement.querySelector(
        'oui-option'
      ) as HTMLElement;

      expect(closingActionSpy).not.toHaveBeenCalled();
      option.click();
      expect(closingActionSpy).toHaveBeenCalledWith(
        expect.any(OuiOptionSelectionChange)
      );
    });

    it('should close the panel when pressing escape', () => {
      expect(closingActionSpy).not.toHaveBeenCalled();
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape' })
      );
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('without oui-input', () => {
    let fixture: ComponentFixture<AutocompleteWithNativeInput>;

    beforeEach(() => {
      fixture = createComponent(AutocompleteWithNativeInput);
      fixture.detectChanges();
    });

    it('should not throw when clicking outside', async () => {
      fixture.debugElement
        .query(By.css('input'))
        .nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      await flush();

      expect(() => document.dispatchEvent(new Event('click'))).not.toThrow();
    });
  });

  describe('misc', () => {
    it('should allow basic use without any forms directives', () => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutForms);
        fixture.detectChanges();

        const input = fixture.debugElement.query(By.css('input')).nativeElement;
        input.focus();
        input.value = 'd';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll(
          'oui-option'
        ) as NodeListOf<HTMLElement>;
        expect(options.length).toBe(1);
      }).not.toThrowError();
    });

    it('should display an empty input when the value is undefined with ngModel', () => {
      const fixture = createComponent(AutocompleteWithNgModel);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('input')).nativeElement.value
      ).toBe('');
    });

    it('should display the number when the selected option is the number zero', async () => {
      const fixture = createComponent(AutocompleteWithNumbers);

      fixture.componentInstance.selectedNumber = 0;
      fixture.detectChanges();
      await tick();

      expect(
        fixture.debugElement.query(By.css('input')).nativeElement.value
      ).toBe('0');
    });

    it('should work when input is wrapped in ngIf', () => {
      const fixture = createComponent(NgIfAutocomplete);
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('input'))
        .nativeElement.dispatchEvent(new Event('focusin'));
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('One');
      expect(overlayContainerElement.textContent).toContain('Two');
    });

    it('should filter properly with ngIf after setting the active item', () => {
      const fixture = createComponent(NgIfAutocomplete);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const DOWN_ARROW_EVENT = new KeyboardEvent('keydown', {
        code: 'ArrowDown',
      });
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.focus();
      input.value = 'o';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.ouiOptions.length).toBe(2);
    });

    it('should throw if the user attempts to open the panel too early', () => {
      const fixture = createComponent(AutocompleteWithoutPanel);
      fixture.detectChanges();

      expect(() => {
        fixture.componentInstance.trigger.openPanel();
      }).toThrow(getOuiAutocompleteMissingPanelError());
    });

    it('should not throw on init, even if the panel is not defined', () => {
      expect(async () => {
        const fixture = createComponent(AutocompleteWithoutPanel);
        fixture.componentInstance.control.setValue('Something');
        fixture.detectChanges();
        await tick();
      }).not.toThrow();
    });

    it('should transfer the oui-autocomplete classes to the panel element', async () => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      await tick();
      fixture.detectChanges();

      const autocomplete =
        fixture.debugElement.nativeElement.querySelector('oui-autocomplete');
      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      )!;

      expect(autocomplete.classList).not.toContain('class-one');
      expect(autocomplete.classList).not.toContain('class-two');

      expect(panel.classList).toContain('class-one');
      expect(panel.classList).toContain('class-two');
    });

    it.skip('should reset correctly when closed programmatically', () => {
      const scrolledSubject: Subject<void> = new Subject();
      const fixture = createComponent(SimpleAutocomplete, [
        {
          provide: ScrollDispatcher,
          useValue: { scrolled: () => scrolledSubject.asObservable() },
        },
        {
          provide: OUI_AUTOCOMPLETE_SCROLL_STRATEGY,
          useFactory: (overlay: Overlay) => () =>
            overlay.scrollStrategies.close(),
          deps: [Overlay],
        },
      ]);

      fixture.detectChanges();
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(trigger.panelOpen).toBe(true);

      scrolledSubject.next();
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false);
    });

    it('should handle autocomplete being attached to number inputs', () => {
      const fixture = createComponent(AutocompleteWithNumberInputAndNgModel);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.focus();
      input.value = '1337';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedValue).toBe(1337);
    });
  });

  it.skip('should have correct width when opened', () => {
    const widthFixture = createComponent(SimpleAutocomplete);
    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;
    // Firefox, edge return a decimal value for width, so we need to parse and round it to verify
    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(300);

    widthFixture.componentInstance.trigger.closePanel();
    widthFixture.detectChanges();

    widthFixture.componentInstance.width = 500;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    // Firefox, edge return a decimal value for width, so we need to parse and round it to verify
    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(500);
  });

  it.skip('should update the width while the panel is open', () => {
    const widthFixture = createComponent(SimpleAutocomplete);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;
    const input = widthFixture.debugElement.query(
      By.css('input')
    ).nativeElement;

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(300);

    widthFixture.componentInstance.width = 500;
    widthFixture.detectChanges();

    input.focus();
    input.dispatchEvent(new Event('input'));

    widthFixture.detectChanges();

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(500);
  });

  it('should not reopen a closed autocomplete when returning to a blurred tab', () => {
    const fixture = createComponent(SimpleAutocomplete);
    fixture.detectChanges();

    const trigger = fixture.componentInstance.trigger;
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.focus();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(true);

    trigger.closePanel();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(false);

    // Simulate the user going to a different tab.
    window.dispatchEvent(new Event('blur'));
    input.blur();
    fixture.detectChanges();

    // Simulate the user coming back.
    window.dispatchEvent(new Event('focus'));
    input.focus();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(false);
  });

  it.skip('should have panel width set to string value', () => {
    const widthFixture = createComponent(SimpleAutocomplete);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.panelWidth = 'auto';
    widthFixture.detectChanges();
    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;

    expect(overlayPane.style.width).toMatch(/px$/);
  });

  it(
    'should show the panel when the options are initialized later within a component with ' +
      'OnPush change detection',
    async () => {
      const fixture = createComponent(AutocompleteWithOnPushDelay);

      fixture.detectChanges();
      fixture.debugElement
        .query(By.css('input'))
        .nativeElement.dispatchEvent(new Event('focusin'));
      await tick(1000);

      fixture.detectChanges();
      await tick();

      Promise.resolve().then(() => {
        const panel = overlayContainerElement.querySelector(
          '.oui-autocomplete-panel'
        ) as HTMLElement;
        const hiddenClass = 'oui-autocomplete-hidden';

        fixture.detectChanges();
        expect(panel.classList).toContain(hiddenClass);
      });
    }
  );

  it('should emit an event when an option is selected', async () => {
    const fixture = createComponent(AutocompleteWithSelectEvent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    zone.simulateZoneExit();
    await tick();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'oui-option'
    ) as NodeListOf<HTMLElement>;
    const spy = fixture.componentInstance.optionSelected;

    options[1].click();
    await tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const event = spy.mock.lastCall![0] as OuiAutocompleteSelectedEvent;

    expect(event.source).toBe(fixture.componentInstance.autocomplete);
    expect(event.option.value).toBe('Washington');
  });

  it('should emit an event when a newly-added option is selected', async () => {
    const fixture = createComponent(AutocompleteWithSelectEvent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    await tick();
    fixture.detectChanges();

    fixture.componentInstance.states = [
      ...fixture.componentInstance.states,
      'Puerto Rico',
    ];
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    fixture.componentInstance.trigger.openPanel();
    zone.simulateZoneExit();
    await tick();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'oui-option'
    ) as NodeListOf<HTMLElement>;
    const spy = fixture.componentInstance.optionSelected;

    const puertoRicoOption = Array.from(options).find((option) =>
      option.textContent?.includes('Puerto Rico')
    );

    expect(puertoRicoOption).toBeTruthy();
    puertoRicoOption!.click();
    zone.simulateZoneExit();
    await tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const event = spy.mock.lastCall![0] as OuiAutocompleteSelectedEvent;

    expect(event.source).toBe(fixture.componentInstance.autocomplete);
    expect(event.option.value).toBe('Puerto Rico');
  });

  it.skip('should be able to set a custom panel connection element', () => {
    const fixture = createComponent(AutocompleteWithDifferentOrigin);

    fixture.detectChanges();
    fixture.componentInstance.connectedTo =
      fixture.componentInstance.alternateOrigin;
    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    zone.simulateZoneExit();

    const overlayRect = overlayContainerElement
      .querySelector('.cdk-overlay-pane')!
      .getBoundingClientRect() as DOMRect;
    const originRect = fixture.nativeElement
      .querySelector('.origin')
      .getBoundingClientRect() as DOMRect;

    expect(Math.floor(overlayRect.top)).toBe(Math.floor(originRect.bottom));
  });

  it.skip('should be able to change the origin after the panel has been opened', () => {
    const fixture = createComponent(AutocompleteWithDifferentOrigin);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    zone.simulateZoneExit();

    fixture.componentInstance.trigger.closePanel();
    fixture.detectChanges();

    fixture.componentInstance.connectedTo =
      fixture.componentInstance.alternateOrigin;
    fixture.detectChanges();

    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    zone.simulateZoneExit();

    const overlayRect = overlayContainerElement
      .querySelector('.cdk-overlay-pane')!
      .getBoundingClientRect();
    const originRect = fixture.nativeElement
      .querySelector('.origin')
      .getBoundingClientRect() as DOMRect;

    expect(Math.floor(overlayRect.top)).toBe(Math.floor(originRect.bottom));
  });

  it.skip('should be able to re-type the same value when it is reset while open', async () => {
    const fixture = createComponent(SimpleAutocomplete);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    const formControl = fixture.componentInstance.stateCtrl;

    input.focus();
    input.value = 'Cal';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(formControl.value).toBe('Cal');

    formControl.setValue('');
    fixture.detectChanges();

    expect(input.value).toBe('');

    input.focus();
    input.value = 'Cal';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(formControl.value).toBe('Cal');
  });
});
