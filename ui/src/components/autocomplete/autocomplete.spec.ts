import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, UP_ARROW, ENTER, TAB } from '@angular/cdk/keycodes';
import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { MockNgZone } from '../core/cdk/testing';
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
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
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
  `,
})
class SimpleAutocomplete implements OnDestroy {
  stateCtrl = new UntypedFormControl();
  filteredStates: any[];
  valueSub: Subscription;
  // floatLabel = 'auto';
  width: number;
  disableRipple = false;
  autocompleteDisabled = false;
  openedSpy = jasmine.createSpy('autocomplete opened spy');
  closedSpy = jasmine.createSpy('autocomplete closed spy');

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
    <oui-form-field *ngIf="isVisible">
      <input
        oui-input
        placeholder="Choose"
        [ouiAutocomplete]="auto"
        [formControl]="optionCtrl"
      />
    </oui-form-field>
    <oui-autocomplete #auto="ouiAutocomplete">
      <oui-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </oui-option>
    </oui-autocomplete>
  `,
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
      <oui-option *ngFor="let state of filteredStates" [value]="state">
        <span> {{ state }} </span>
      </oui-option>
    </oui-autocomplete>
  `,
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
      <oui-option *ngFor="let state of filteredStates" [value]="state">
        <span>{{ state }}</span>
      </oui-option>
    </oui-autocomplete>
  `,
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
      <oui-option *ngFor="let number of numbers" [value]="number">
        <span>{{ number }}</span>
      </oui-option>
    </oui-autocomplete>
  `,
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
      <oui-option *ngFor="let option of options" [value]="option">{{
        option
      }}</oui-option>
    </oui-autocomplete>
  `,
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
      <oui-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </oui-option>
    </oui-autocomplete>
  `,
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
      [ouiAutocomplete]="auto"
      [formControl]="control"
    />
  `,
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
      <oui-optgroup *ngFor="let group of stateGroups" [label]="group.label">
        <oui-option *ngFor="let state of group.states" [value]="state">
          <span>{{ state }}</span>
        </oui-option>
      </oui-optgroup>
    </oui-autocomplete>
  `,
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
      <oui-option *ngFor="let state of states" [value]="state">
        <span>{{ state }}</span>
      </oui-option>
    </oui-autocomplete>
  `,
})
class AutocompleteWithSelectEvent {
  selectedState: string;
  states = ['New York', 'Washington', 'Oregon'];
  optionSelected = jasmine.createSpy('optionSelected callback');

  @ViewChild(OuiAutocompleteTrigger)
  trigger: OuiAutocompleteTrigger;
  @ViewChild(OuiAutocomplete) autocomplete: OuiAutocomplete;
}

@Component({
  template: `
    <input [formControl]="formControl" [ouiAutocomplete]="auto" />
    <oui-autocomplete #auto="ouiAutocomplete"></oui-autocomplete>
  `,
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
      <oui-option *ngFor="let value of values" [value]="value">{{
        value
      }}</oui-option>
    </oui-autocomplete>
  `,
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
      <oui-option *ngFor="let value of values" [value]="value">{{
        value
      }}</oui-option>
    </oui-autocomplete>
  `,
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
})
class AutocompleteWithNativeAutocompleteAttribute {
  value: string;
}

@Component({
  template: '<input [ouiAutocomplete]="null" ouiAutocompleteDisabled>',
})
class InputWithoutAutocompleteAndDisabled {}

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
        NoopAnimationsModule,
      ],
      declarations: [component],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        ...providers,
      ],
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

      input.dispatchEvent(new Event('focusin'));

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
      input.dispatchEvent(new Event('focusin'));

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

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
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
      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();
      zone.simulateZoneExit();
      document.dispatchEvent(new Event('click'));

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
      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      flush();
      document.dispatchEvent(new Event('touchend'));

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
      input.dispatchEvent(new Event('focusin'));

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
      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();
      zone.simulateZoneExit();

      // Filter down the option list to a subset of original options ('Alabama', 'California')
      input.focus();
      input.value = 'al';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();

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
      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      ) as HTMLElement;

      expect(panel.classList).toContain(
        'oui-autocomplete-visible',
        `Expected panel to start out visible.`
      );

      // Filter down the option list such that no options match the value
      input.focus();
      input.value = 'af';
      input.dispatchEvent(new Event('input'));
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
      input.dispatchEvent(new Event('input'));

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

      input.focus();
      input.value = 'x';
      input.dispatchEvent(new Event('input'));
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

      input.focus();
      input.value = 'al';
      input.dispatchEvent(new Event('input'));
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

      input.dispatchEvent(new Event('focusin'));

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
      fixture.componentInstance.filteredStates =
        fixture.componentInstance.states = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).not.toHaveBeenCalled();
    });

    it('should not emit the opened event multiple times while typing', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);

      input.focus();
      input.value = 'Alabam';
      input.dispatchEvent(new Event('input'));
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
      fixture.componentInstance.filteredStates =
        fixture.componentInstance.states = [];
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

      input.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel to remain closed.`
      );
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

  xit('should update the panel direction if it changes for the trigger', () => {
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

      expect(fixture.componentInstance.stateCtrl.value).toEqual(
        'a',
        'Expected control value to be updated as user types.'
      );

      input.focus();
      input.value = 'al';
      input.dispatchEvent(new Event('input'));
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

      input.dispatchEvent(new Event('input'));

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

      input.focus();
      input.value = 'Californi';
      input.dispatchEvent(new Event('input'));
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
      fixture.componentInstance.ouiOptions.toArray()[1].value = 'test value';
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
        name: 'Alabama',
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
      input.focus();
      input.value = 'Alabama';
      input.dispatchEvent(new Event('input'));
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

      input.focus();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
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

      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(
        true,
        `Expected control to become touched on blur.`
      );
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

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      event = document.createEvent('KeyboardEvent') as any;
      input = fixture.debugElement.query(By.css('input')).nativeElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
    }));

    it('should not focus the option when DOWN key is pressed', () => {
      spyOn(fixture.componentInstance.ouiOptions.first, 'focus');

      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      expect(
        fixture.componentInstance.ouiOptions.first.focus
      ).not.toHaveBeenCalled();
    });

    it('should not close the panel when DOWN key is pressed', () => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);

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

      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.first
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('oui-active');
      expect(optionEls[1].classList).not.toContain('oui-active');

      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.toArray()[1]
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

      Object.defineProperty(event, 'keyCode', {
        value: UP_ARROW,
        configurable: true,
      });
      componentInstance.trigger._handleKeydown(event);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.ouiOptions.last
      ).toBe(true, 'Expected last option to be active.');
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
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('oui-active');
    });

    it('should set the active item properly after filtering', fakeAsync(() => {
      const componentInstance = fixture.componentInstance;

      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      componentInstance.trigger._handleKeydown(event);
      tick();
      fixture.detectChanges();
    }));

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
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('oui-active');
      expect(optionEls[1].classList).not.toContain('oui-active');
    });

    xit('should fill the text field when an option is selected with ENTER', fakeAsync(() => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      flush();
      fixture.detectChanges();

      Object.defineProperty(event, 'keyCode', { value: ENTER });
      fixture.componentInstance.trigger._handleKeydown(event);
      flush();
      fixture.detectChanges();
      expect(input.value).toContain(
        'Alabama',
        `Expected text field to fill with selected value on ENTER.`
      );
    }));

    xit('should prevent the default enter key action', fakeAsync(() => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      flush();

      Object.defineProperty(event, 'keyCode', { value: ENTER });
      fixture.componentInstance.trigger._handleKeydown(event);

      expect(event.defaultPrevented).toBe(
        true,
        'Expected the default action to have been prevented.'
      );
    }));
  });

  describe('option groups', () => {
    let fixture: ComponentFixture<AutocompleteWithGroups>;
    let container: HTMLElement;
    let event: KeyboardEvent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(AutocompleteWithGroups);
      fixture.detectChanges();
      event = document.createEvent('KeyboardEvent') as any;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      container = document.querySelector(
        '.oui-autocomplete-panel'
      ) as HTMLElement;
    }));

    it('should scroll to active options below the fold', fakeAsync(() => {
      Object.defineProperty(event, 'keyCode', { value: DOWN_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0, 'Expected the panel not to scroll.');

      // Press the down arrow five times.
      [1, 2, 3, 4, 5].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(event);
        tick();
      });

      // <option bottom> - <panel height> + <2x group labels> = 128
      // 288 - 256 + 96 = 128
      expect(container.scrollTop).toBe(
        128,
        'Expected panel to reveal the sixth option.'
      );
    }));

    xit('should scroll to active options on UP arrow', fakeAsync(() => {
      Object.defineProperty(event, 'keyCode', { value: UP_ARROW });
      fixture.componentInstance.trigger._handleKeydown(event);
      tick();
      fixture.detectChanges();

      // <option bottom> - <panel height> + <3x group label> = 464
      // 576 - 256 + 144 = 464
      expect(container.scrollTop).toBe(
        464,
        'Expected panel to reveal last option.'
      );
    }));

    it('should scroll to active options that are above the panel', fakeAsync(() => {
      Object.defineProperty(event, 'keyCode', {
        value: DOWN_ARROW,
        configurable: true,
      });
      fixture.componentInstance.trigger._handleKeydown(event);
      tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0, 'Expected panel not to scroll.');

      // These down arrows will set the 7th option active, below the fold.
      [1, 2, 3, 4, 5, 6].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(event);
        tick();
      });

      // These up arrows will set the 2nd option active
      Object.defineProperty(event, 'keyCode', {
        value: UP_ARROW,
        configurable: true,
      });
      [5, 4, 3, 2, 1].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(event);
        tick();
      });

      // Expect to show the top of the 2nd option at the top of the panel.
      // It is offset by 48, because there's a group label above it.
      expect(container.scrollTop).toBe(
        96,
        'Expected panel to scroll up when option is above panel.'
      );
    }));
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

    xit('should set aria-activedescendant based on the active option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.hasAttribute('aria-activedescendant')).toBe(
        false,
        'Expected aria-activedescendant to be absent if no active item.'
      );

      const DOWN_ARROW_EVENT = new KeyboardEvent('keydown', {
        code: 'ArrowDown',
      });
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.ouiOptions.first.id,
        'Expected aria-activedescendant to match the active item after 1 down arrow.'
      );

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.ouiOptions.toArray()[1].id,
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

      input.focus();
      input.value = 'zz';
      input.dispatchEvent(new Event('input'));
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
      ).nativeElement as HTMLElement;

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

  xdescribe('Fallback positions', () => {
    it('should use below positioning by default', fakeAsync(() => {
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

      expect(Math.floor(inputBottom)).toEqual(
        Math.floor(panelTop),
        `Expected panel top to match input bottom by default.`
      );
      expect(panel.classList).not.toContain('oui-autocomplete-panel-above');
    }));

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

      expect(Math.floor(inputBottom))
        .withContext(
          'Expected panel top to match input bottom after scrolling.'
        )
        .toEqual(Math.floor(panelTop));

      document.body.removeChild(spacer);
      window.scroll(0, 0);
    });

    it('should fall back to above position if panel cannot it below', fakeAsync(() => {
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

      expect(Math.floor(inputTop)).toEqual(
        Math.floor(panelBottom),
        `Expected panel to fall back to above position.`
      );

      expect(panel.classList).toContain('oui-autocomplete-panel-above');
    }));

    it('should allow the panel to expand when the number of results increases', fakeAsync(() => {
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
      tick();

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
      tick();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;

      expect(panel.getBoundingClientRect().height).toBeGreaterThan(
        initialPanelHeight
      );
    }));

    it('should align panel properly when filtering in "above" position', fakeAsync(() => {
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
      tick();

      const inputTop = inputReference.getBoundingClientRect().top;
      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      )!;
      const panelBottom = panel.getBoundingClientRect().bottom;

      expect(Math.floor(inputTop)).toEqual(
        Math.floor(panelBottom),
        `Expected panel to stay aligned after filtering.`
      );
    }));

    it(
      'should fall back to above position when requested if options are added while ' +
        'the panel is open',
      fakeAsync(() => {
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

        expect(Math.floor(panelRect.top)).toBe(
          Math.floor(inputRect.bottom),
          `Expected panel top to be below input before repositioning.`
        );

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

        expect(Math.floor(panelRect.bottom)).toBe(
          Math.floor(inputRect.top),
          `Expected panel to fall back to above position after repositioning.`
        );
        tick();
      })
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

      const componentOptions = fixture.componentInstance.ouiOptions.toArray();
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

      const componentOptions = fixture.componentInstance.ouiOptions.toArray();
      componentOptions.forEach((option) => spyOn(option, 'deselect'));

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
        .forEach((option) => expect(option.deselect).not.toHaveBeenCalled());
    }));

    it('should be able to preselect the first option', fakeAsync(() => {
      fixture.componentInstance.trigger.autocomplete.autoActiveFirstOption =
        true;
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelectorAll('oui-option')[0].classList
      ).toContain('oui-active', 'Expected first option to be highlighted.');
    }));

    xit('should remove aria-activedescendant when panel is closed with autoActiveFirstOption', fakeAsync(() => {
      const input: HTMLElement = fixture.nativeElement.querySelector('input');
      expect(input.hasAttribute('aria-activedescendant')).toBe(
        false,
        'Expected no active descendant on init.'
      );

      fixture.componentInstance.trigger.autocomplete.autoActiveFirstOption =
        true;
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toBeTruthy(
        'Expected active descendant while open.'
      );

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();
      expect(input.hasAttribute('aria-activedescendant')).toBe(
        false,
        'Expected no active descendant when closed.'
      );
    }));

    it('should be able to configure preselecting the first option globally', fakeAsync(() => {
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

      expect(spy).toHaveBeenCalledWith(jasmine.any(OuiOptionSelectionChange));
      subscription!.unsubscribe();
    }));

    xit('should reposition the panel when the amount of options changes', fakeAsync(() => {
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
      tick();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputBottom = inputReference.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector(
        '.oui-autocomplete-panel'
      )!;
      const panelTop = panel.getBoundingClientRect().top;

      expect(Math.floor(inputBottom)).toBe(
        Math.floor(panelTop),
        `Expected panel top to match input bottom when there is only one option.`
      );

      input.focus();
      input.value = '';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const inputTop = inputReference.getBoundingClientRect().top;
      const panelBottom = panel.getBoundingClientRect().bottom;

      expect(Math.floor(inputTop)).toBe(
        Math.floor(panelBottom),
        `Expected panel switch to the above position if the options no longer it.`
      );
    }));
  });

  describe('panel closing', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;
    let trigger: OuiAutocompleteTrigger;
    let closingActionSpy: jasmine.Spy;
    let closingActionsSub: Subscription;
    let event: KeyboardEvent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      event = document.createEvent('KeyboardEvent') as any;
      Object.defineProperty(event, 'keyCode', { value: TAB });

      input = fixture.debugElement.query(By.css('input')).nativeElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      flush();

      trigger = fixture.componentInstance.trigger;
      closingActionSpy = jasmine.createSpy('closing action listener');
      closingActionsSub =
        trigger.panelClosingActions.subscribe(closingActionSpy);
    }));

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
        jasmine.any(OuiOptionSelectionChange)
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

    it('should not throw when clicking outside', fakeAsync(() => {
      fixture.debugElement
        .query(By.css('input'))
        .nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      flush();

      expect(() => document.dispatchEvent(new Event('click'))).not.toThrow();
    }));
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

    it('should display the number when the selected option is the number zero', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithNumbers);

      fixture.componentInstance.selectedNumber = 0;
      fixture.detectChanges();
      tick();

      expect(
        fixture.debugElement.query(By.css('input')).nativeElement.value
      ).toBe('0');
    }));

    it('should work when input is wrapped in ngIf', () => {
      const fixture = createComponent(NgIfAutocomplete);
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('input'))
        .nativeElement.dispatchEvent(new Event('focusin'));
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to read open when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'One',
        `Expected panel to display when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Two',
        `Expected panel to display when input is focused.`
      );
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

    it('should not throw on init, even if the panel is not defined', fakeAsync(() => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutPanel);
        fixture.componentInstance.control.setValue('Something');
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));

    it('should transfer the oui-autocomplete classes to the panel element', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      tick();
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
    }));

    it('should reset correctly when closed programmatically', fakeAsync(() => {
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

      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

      scrolledSubject.next();
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');
    }));

    it('should handle autocomplete being attached to number inputs', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithNumberInputAndNgModel);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.focus();
      input.value = '1337';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedValue).toBe(1337);
    }));
  });

  xit('should have correct width when opened', () => {
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

  xit('should update the width while the panel is open', () => {
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

    expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

    trigger.closePanel();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');

    // Simulate the user going to a different tab.
    window.dispatchEvent(new Event('blur'));
    input.blur();
    fixture.detectChanges();

    // Simulate the user coming back.
    window.dispatchEvent(new Event('focus'));
    input.focus();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(false, 'Expected panel to remain closed.');
  });

  it('should have panel width set to string value', () => {
    const widthFixture = createComponent(SimpleAutocomplete);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.autocomplete.panelWidth = 'auto';
    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;

    expect(overlayPane.style.width).toBe('auto');
  });

  it(
    'should show the panel when the options are initialized later within a component with ' +
      'OnPush change detection',
    fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithOnPushDelay);

      fixture.detectChanges();
      fixture.debugElement
        .query(By.css('input'))
        .nativeElement.dispatchEvent(new Event('focusin'));
      tick(1000);

      fixture.detectChanges();
      tick();

      Promise.resolve().then(() => {
        const panel = overlayContainerElement.querySelector(
          '.oui-autocomplete-panel'
        ) as HTMLElement;
        const visibleClass = 'oui-autocomplete-visible';

        fixture.detectChanges();
        expect(panel.classList).toContain(
          visibleClass,
          `Expected panel to be visible.`
        );
      });
    })
  );

  it('should emit an event when an option is selected', fakeAsync(() => {
    const fixture = createComponent(AutocompleteWithSelectEvent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    zone.simulateZoneExit();
    tick();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'oui-option'
    ) as NodeListOf<HTMLElement>;
    const spy = fixture.componentInstance.optionSelected;

    options[1].click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const event = spy.calls.mostRecent()
      .args[0] as OuiAutocompleteSelectedEvent;

    expect(event.source).toBe(fixture.componentInstance.autocomplete);
    expect(event.option.value).toBe('Washington');
  }));

  it('should emit an event when a newly-added option is selected', fakeAsync(() => {
    const fixture = createComponent(AutocompleteWithSelectEvent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.states.push('Puerto Rico');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'oui-option'
    ) as NodeListOf<HTMLElement>;
    const spy = fixture.componentInstance.optionSelected;

    options[3].click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const event = spy.calls.mostRecent()
      .args[0] as OuiAutocompleteSelectedEvent;

    expect(event.source).toBe(fixture.componentInstance.autocomplete);
    expect(event.option.value).toBe('Puerto Rico');
  }));

  xit('should be able to set a custom panel connection element', () => {
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

    expect(Math.floor(overlayRect.top)).toBe(
      Math.floor(originRect.bottom),
      'Expected autocomplete panel to align with the bottom of the new origin.'
    );
  });

  xit('should be able to change the origin after the panel has been opened', () => {
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

    expect(Math.floor(overlayRect.top))
      .withContext(
        'Expected autocomplete panel to align with the bottom of the new origin.'
      )
      .toBe(Math.floor(originRect.bottom));
  });

  it('should be able to re-type the same value when it is reset while open', fakeAsync(() => {
    const fixture = createComponent(SimpleAutocomplete);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    const formControl = fixture.componentInstance.stateCtrl;

    input.focus();
    input.value = 'Cal';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(formControl.value).toBe(
      'Cal',
      'Expected initial value to be propagated to model'
    );

    formControl.setValue('');
    fixture.detectChanges();

    expect(input.value).toBe(
      '',
      'Expected input value to reset when model is reset'
    );

    input.focus();
    input.value = 'Cal';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(formControl.value).toBe(
      'Cal',
      'Expected new value to be propagated to model'
    );
  }));
});
