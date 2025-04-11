import {
  DOWN_ARROW,
  ENTER,
  RIGHT_ARROW,
  SPACE,
  TAB,
  A,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  UntypedFormControl,
  UntypedFormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiOption } from '../core/option/option';
import { ErrorStateMatcher } from '../core/error/error-options';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject, Subscription } from 'rxjs';
import { OuiSelectModule } from './select-module';
import { OuiSelect } from './select.component';
import {
  getOuiSelectDynamicMultipleError,
  getOuiSelectNonArrayValueError,
  getOuiSelectNonFunctionValueError,
} from './select-errors';

import { OuiOptionSelectionChange } from '../core';
import {
  wrappedErrorMessage,
  dispatchFakeEvent,
  dispatchEvent,
} from '../core/test/utils';

@Component({
  selector: 'oui-basic-select',
  template: `
    <div [style.height.px]="heightAbove"></div>
    <oui-form-field>
      <oui-select
        placeholder="Food"
        [formControl]="control"
        [required]="isRequired"
        [tabIndex]="tabIndexOverride"
        [aria-label]="ariaLabel"
        [aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass"
      >
        <oui-option
          *ngFor="let food of foods"
          [value]="food.value"
          [disabled]="food.disabled"
        >
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
    <div [style.height.px]="heightBelow"></div>
  `,
  standalone: false,
})
class BasicSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos', disabled: true },
    { value: 'sandwich-3', viewValue: 'Sandwich' },
    { value: 'chips-4', viewValue: 'Chips' },
    { value: 'eggs-5', viewValue: 'Eggs' },
    { value: 'pasta-6', viewValue: 'Pasta' },
    { value: 'sushi-7', viewValue: 'Sushi' },
  ];
  control = new UntypedFormControl();
  isRequired: boolean;
  heightAbove = 0;
  heightBelow = 0;
  tabIndexOverride: number;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = ['custom-one', 'custom-two'];

  @ViewChild(OuiSelect, { static: true }) select: OuiSelect;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;
}

@Component({
  selector: 'oui-ng-model-select',
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" ngModel [disabled]="isDisabled">
        <oui-option *ngFor="let food of foods" [value]="food.value"
          >{{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class NgModelSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  isDisabled: boolean;

  @ViewChild(OuiSelect) select: OuiSelect;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;
}

@Component({
  selector: 'oui-many-selects',
  template: `
    <oui-form-field>
      <oui-select placeholder="First">
        <oui-option value="one">one</oui-option>
        <oui-option value="two">two</oui-option>
      </oui-select>
    </oui-form-field>
    <oui-form-field>
      <oui-select placeholder="Second">
        <oui-option value="three">three</oui-option>
        <oui-option value="four">four</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class ManySelects {}

@Component({
  selector: 'oui-select-with-change-event',
  template: `
    <oui-form-field>
      <oui-select (selectionChange)="changeListener($event)">
        <oui-option *ngFor="let food of foods" [value]="food">{{
          food
        }}</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class SelectWithChangeEvent {
  foods: string[] = [
    'steak-0',
    'pizza-1',
    'tacos-2',
    'sandwich-3',
    'chips-4',
    'eggs-5',
    'pasta-6',
    'sushi-7',
  ];

  changeListener = jasmine.createSpy('OuiSelect change listener');
}

@Component({
  selector: 'oui-select-init-without-options',
  template: `
    <oui-form-field>
      <oui-select
        placeholder="Food I want to eat right now"
        [formControl]="control"
      >
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class SelectInitWithoutOptions {
  foods: any[];
  control = new UntypedFormControl('pizza-1');

  @ViewChild(OuiSelect) select: OuiSelect;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;

  addOptions() {
    this.foods = [
      { value: 'steak-0', viewValue: 'Steak' },
      { value: 'pizza-1', viewValue: 'Pizza' },
      { value: 'tacos-2', viewValue: 'Tacos' },
    ];
  }
}

@Component({
  selector: 'oui-basic-select-on-push',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" [formControl]="control">
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class BasicSelectOnPush {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new UntypedFormControl();
}

@Component({
  selector: 'oui-basic-select-on-push-preselected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" [formControl]="control">
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class BasicSelectOnPushPreselected {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new UntypedFormControl('pizza-1');
}

@Component({
  selector: 'oui-multi-select',
  template: `
    <oui-form-field>
      <oui-select
        multiple
        placeholder="Food"
        [formControl]="control"
        [sortComparator]="sortComparator"
      >
        <oui-option *ngFor="let food of foods" [value]="food.value"
          >{{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class MultiSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: 'sandwich-3', viewValue: 'Sandwich' },
    { value: 'chips-4', viewValue: 'Chips' },
    { value: 'eggs-5', viewValue: 'Eggs' },
    { value: 'pasta-6', viewValue: 'Pasta' },
    { value: 'sushi-7', viewValue: 'Sushi' },
  ];
  control = new UntypedFormControl();

  @ViewChild(OuiSelect) select: OuiSelect;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;
  sortComparator: (a: OuiOption, b: OuiOption, options: OuiOption[]) => number;
}

@Component({
  selector: 'oui-select-with-plain-tabindex',
  template: `
    <oui-form-field><oui-select tabindex="5"></oui-select></oui-form-field>
  `,
  standalone: false,
})
class SelectWithPlainTabindex {}

@Component({
  selector: 'oui-select-early-sibling-access',
  template: `
    <oui-form-field>
      <oui-select #select="ouiSelect"></oui-select>
    </oui-form-field>
    <div *ngIf="select.selected"></div>
  `,
  standalone: false,
})
class SelectEarlyAccessSibling {}

@Component({
  selector: 'oui-basic-select-initially-hidden',
  template: `
    <oui-form-field>
      <oui-select [style.display]="isVisible ? 'block' : 'none'">
        <oui-option value="value">There are no other options</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class BasicSelectInitiallyHidden {
  isVisible = false;
}

@Component({
  selector: 'oui-basic-select-no-placeholder',
  template: `
    <oui-form-field>
      <oui-select>
        <oui-option value="value">There are no other options</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class BasicSelectNoPlaceholder {}

@Component({
  selector: 'oui-reset-values-select',
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" [formControl]="control">
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
        <oui-option>None</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class ResetValuesSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: false, viewValue: 'Falsy' },
    { viewValue: 'Undefined' },
    { value: null, viewValue: 'Null' },
  ];
  control = new UntypedFormControl();

  @ViewChild(OuiSelect) select: OuiSelect;
}

@Component({
  selector: 'oui-select-with-groups',
  template: `
    <oui-form-field>
      <oui-select placeholder="Pokemon" [formControl]="control">
        <oui-optgroup
          *ngFor="let group of pokemonTypes"
          [label]="group.name"
          [disabled]="group.disabled"
        >
          <oui-option
            *ngFor="let pokemon of group.pokemon"
            [value]="pokemon.value"
          >
            {{ pokemon.viewValue }}
          </oui-option>
        </oui-optgroup>
        <oui-option value="mime-11">Mr. Mime</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class SelectWithGroups {
  control = new UntypedFormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' },
      ],
    },
    {
      name: 'Water',
      disabled: true,
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' },
      ],
    },
    {
      name: 'Fire',
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' },
      ],
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ],
    },
  ];

  @ViewChild(OuiSelect) select: OuiSelect;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;
}

@Component({
  selector: 'oui-select-with-groups',
  template: `
    <oui-form-field>
      <oui-select placeholder="Pokemon" [formControl]="control">
        <oui-optgroup *ngFor="let group of pokemonTypes" [label]="group.name">
          <ng-container *ngFor="let pokemon of group.pokemon">
            <oui-option [value]="pokemon.value">{{
              pokemon.viewValue
            }}</oui-option>
          </ng-container>
        </oui-optgroup>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class SelectWithGroupsAndNgContainer {
  control = new UntypedFormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [{ value: 'bulbasaur-0', viewValue: 'Bulbasaur' }],
    },
  ];
}

@Component({
  template: `
    <form>
      <oui-form-field>
        <oui-select [(ngModel)]="value"></oui-select>
      </oui-form-field>
    </form>
  `,
  standalone: false,
})
class InvalidSelectInForm {
  value: any;
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <oui-form-field>
        <oui-select placeholder="Food" formControlName="food">
          <oui-option value="steak-0">Steak</oui-option>
          <oui-option value="pizza-1">Pizza</oui-option>
        </oui-select>

        <label>This field is required</label>
      </oui-form-field>
    </form>
  `,
  standalone: false,
})
class SelectInsideFormGroup {
  @ViewChild(FormGroupDirective)
  formGroupDirective: FormGroupDirective;
  @ViewChild(OuiSelect) select: OuiSelect;
  formControl = new UntypedFormControl('', Validators.required);
  formGroup = new UntypedFormGroup({
    food: this.formControl,
  });
}

@Component({
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" [(value)]="selectedFood">
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class BasicSelectWithoutForms {
  selectedFood: string | null;
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(OuiSelect) select: OuiSelect;
}

@Component({
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" [(value)]="selectedFood">
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class BasicSelectWithoutFormsPreselected {
  selectedFood = 'pizza-1';
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];

  @ViewChild(OuiSelect) select: OuiSelect;
}

@Component({
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" [(value)]="selectedFoods" multiple>
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class BasicSelectWithoutFormsMultiple {
  selectedFoods: string[];
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(OuiSelect) select: OuiSelect;
}

@Component({
  selector: 'oui-select-with-custom-trigger',
  template: `
    <oui-form-field>
      <oui-select
        placeholder="Food"
        [formControl]="control"
        #select="ouiSelect"
      >
        <oui-select-trigger>
          {{ select.selected?.viewValue.split('').reverse().join('') }}
        </oui-select-trigger>
        <oui-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class SelectWithCustomTrigger {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];
  control = new UntypedFormControl();
}

@Component({
  selector: 'oui-ng-model-compare-with',
  template: `
    <oui-form-field>
      <oui-select
        [(value)]="selectedFood"
        (selectionChange)="setFoodByCopy($event)"
        [compareWith]="comparator"
      >
        <oui-option *ngFor="let food of foods" [value]="food">{{
          food.viewValue
        }}</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class NgModelCompareWithSelect {
  foods: { value: string; viewValue: string }[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  selectedFood: { value: string; viewValue: string } = {
    value: 'pizza-1',
    viewValue: 'Pizza',
  };
  comparator: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  @ViewChild(OuiSelect) select: OuiSelect;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;

  useCompareByValue() {
    this.comparator = this.compareByValue;
  }

  useCompareByReference() {
    this.comparator = this.compareByReference;
  }

  useNullComparator() {
    this.comparator = null;
  }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.value === f2.value;
  }

  compareByReference(f1: any, f2: any) {
    return f1 === f2;
  }

  setFoodByCopy(newValue: { value: string; viewValue: string }) {
    this.selectedFood = { ...{}, ...newValue };
  }
}

@Component({
  template: `
    <oui-select
      placeholder="Food"
      [formControl]="control"
      [errorStateMatcher]="errorStateMatcher"
    >
      <oui-option *ngFor="let food of foods" [value]="food.value">
        {{ food.viewValue }}
      </oui-option>
    </oui-select>
  `,
  standalone: false,
})
class CustomErrorBehaviorSelect {
  @ViewChild(OuiSelect) select: OuiSelect;
  control = new UntypedFormControl();
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];
  errorStateMatcher: ErrorStateMatcher;
}

@Component({
  template: `
    <oui-form-field>
      <oui-select placeholder="Food" [(ngModel)]="selectedFoods">
        <oui-option *ngFor="let food of foods" [value]="food.value"
          >{{ food.viewValue }}
        </oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class SingleSelectWithPreselectedArrayValues {
  foods: any[] = [
    { value: ['steak-0', 'steak-1'], viewValue: 'Steak' },
    { value: ['pizza-1', 'pizza-2'], viewValue: 'Pizza' },
    { value: ['tacos-2', 'tacos-3'], viewValue: 'Tacos' },
  ];

  selectedFoods = this.foods[1].value;

  @ViewChild(OuiSelect) select: OuiSelect;
  @ViewChildren(OuiOption) options: QueryList<OuiOption>;
}

@Component({
  template: `
    <oui-form-field>
      <label>Select a thing</label>

      <oui-select [placeholder]="placeholder">
        <oui-option value="thing">A thing</oui-option>
      </oui-select>
    </oui-form-field>
  `,
  standalone: false,
})
class SelectWithFormFieldLabel {
  placeholder: string;
}

/** Dispatches a keydown event from an element. */
function createKeyboardEvent(keyCode: any, target?: Element, key?: any) {
  const event = document.createEvent('KeyboardEvent') as any;
  event.initKeyboardEvent('keydown', true, true, window, 0, key, 0, '', false);

  Object.defineProperties(event, {
    keyCode: { get: () => keyCode },
    key: { get: () => key },
    target: { get: () => target },
  });

  return event as Event;
}

/** Shorthand to dispatch a keyboard event with a specified key code. */
function dispatchKeyboardEvent(
  node: Node,
  type: any,
  keyCode: any,
  target?: Element
): KeyboardEvent {
  return dispatchEvent(
    node,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    createKeyboardEvent(type, keyCode, target)
  ) as KeyboardEvent;
}

describe('OuiSelect', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();

  /**
   * Configures the test module for OuiSelect with the given declarations. This is broken out so
   * that we're only compiling the necessary test components for each test in order to speed up
   * overall test time.
   *
   * @param declarations Components to declare for this block
   */
  function configureOuiSelectTestingModule(declarations: any[]) {
    TestBed.configureTestingModule({
      imports: [
        OuiFormFieldModule,
        OuiSelectModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations,
      providers: [
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject.asObservable(),
          }),
        },
      ],
    }).compileComponents();

    inject([OverlayContainer, Platform], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(waitForAsync(() => {
      configureOuiSelectTestingModule([
        BasicSelect,
        MultiSelect,
        SelectWithGroups,
        SelectWithGroupsAndNgContainer,
        SelectWithFormFieldLabel,
        SelectWithChangeEvent,
      ]);
    }));

    describe('accessibility', () => {
      describe('for select', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let select: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          select = fixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;
        }));

        it('should set the role of the select to listbox', fakeAsync(() => {
          expect(select.getAttribute('role')).toEqual('listbox');
        }));

        it('should set the aria label of the select to the placeholder', fakeAsync(() => {
          expect(select.getAttribute('aria-label')).toEqual('Food');
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should not set an aria-label if aria-labelledby is specified', fakeAsync(() => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toBeFalsy(
            'Expected no aria-label to be set.'
          );
          expect(select.getAttribute('aria-labelledby')).toBe('myLabelId');
        }));

        it('should not have aria-labelledby in the DOM if it`s not specified', fakeAsync(() => {
          fixture.detectChanges();
          expect(select.hasAttribute('aria-labelledby')).toBeFalsy();
        }));

        it('should set the tabindex of the select to 0 by default', fakeAsync(() => {
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();

          expect(select.getAttribute('tabindex')).toBe('3');
        }));

        it('should set aria-required for required selects', fakeAsync(() => {
          expect(select.getAttribute('aria-required')).toEqual(
            'false',
            `Expected aria-required attr to be false for normal selects.`
          );

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.getAttribute('aria-required')).toEqual(
            'true',
            `Expected aria-required attr to be true for required selects.`
          );
        }));

        it('should set the oui-select-required class for required selects', fakeAsync(() => {
          expect(select.classList).not.toContain(
            'oui-select-required',
            `Expected the oui-select-required class not to be set.`
          );

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.classList).toContain(
            'oui-select-required',
            `Expected the oui-select-required class to be set.`
          );
        }));

        it('should set aria-invalid for selects that are invalid and touched', fakeAsync(() => {
          expect(select.getAttribute('aria-invalid')).toEqual(
            'false',
            `Expected aria-invalid attr to be false for valid selects.`
          );

          fixture.componentInstance.isRequired = true;
          fixture.componentInstance.control.markAsTouched();
          fixture.detectChanges();

          expect(select.getAttribute('aria-invalid')).toEqual(
            'true',
            `Expected aria-invalid attr to be true for invalid selects.`
          );
        }));

        it('should set aria-disabled for disabled selects', fakeAsync(() => {
          expect(select.getAttribute('aria-disabled')).toEqual('false');

          fixture.componentInstance.control.disable();
          fixture.detectChanges();

          expect(select.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the select to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.control.disable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('-1');

          fixture.componentInstance.control.enable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should not set `aria-labelledby` if there is a placeholder', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(
            SelectWithFormFieldLabel
          );
          labelFixture.componentInstance.placeholder = 'Thing selector';
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeFalsy();
        });

        it('should not set `aria-labelledby` if there is no form field label', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(SelectWithChangeEvent);
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeFalsy();
        });

        it('should resume focus from selected item after selecting via click', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          (
            overlayContainerElement.querySelectorAll(
              'oui-option'
            )[3] as HTMLElement
          ).click();
          fixture.detectChanges();
          flush();

          expect(formControl.value).toBe(options[3].value);
          flush();
        }));

        it('should be able to select options by typing on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchEvent(select, createKeyboardEvent(80, undefined, 'p'));
          tick(200);

          expect(options[1].selected).toBe(
            true,
            'Expected second option to be selected.'
          );
          expect(formControl.value).toBe(
            options[1].value,
            'Expected value from second option to have been set on the model.'
          );

          dispatchEvent(select, createKeyboardEvent(69, undefined, 'e'));
          tick(200);

          expect(options[5].selected).toBe(
            true,
            'Expected sixth option to be selected.'
          );
          expect(formControl.value).toBe(
            options[5].value,
            'Expected value from sixth option to have been set on the model.'
          );
        }));

        it('should do nothing when typing on a closed multi-select', fakeAsync(() => {
          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).toBe(
            false,
            'Expected panel to be closed.'
          );

          dispatchEvent(select, createKeyboardEvent(80, undefined, 'p'));

          expect(instance.select.panelOpen).toBe(
            false,
            'Expected panel to stay closed.'
          );
          expect(instance.control.value).toBe(
            initialValue,
            'Expected value to stay the same.'
          );
          fixture.destroy();
          flush();
        }));

        it('should do nothing if the key manager did not change the active item', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          expect(formControl.value).toBeNull(
            'Expected form control value to be empty.'
          );
          expect(formControl.pristine).toBe(
            true,
            'Expected form control to be clean.'
          );

          dispatchKeyboardEvent(select, 'keydown', 16); // Press a random key.

          expect(formControl.value).toBeNull(
            'Expected form control value to stay empty.'
          );
          expect(formControl.pristine).toBe(
            true,
            'Expected form control to stay clean.'
          );
          fixture.destroy();
          flush();
        }));

        it('should continue from the selected option when the value is set programmatically', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          fixture.detectChanges();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('eggs-5');
          expect(fixture.componentInstance.options.toArray()[5].selected).toBe(
            true
          );
          fixture.destroy();
          flush();
        }));

        it('should not cycle through the options if the control is disabled', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          formControl.disable();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe(
            'eggs-5',
            'Expected value to remain unchaged.'
          );
          fixture.destroy();
          flush();
        }));

        it('should not open a multiple select when tabbing through', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;

          expect(multiFixture.componentInstance.select.panelOpen).toBe(
            false,
            'Expected panel to be closed initially.'
          );

          dispatchKeyboardEvent(select, 'keydown', TAB);

          expect(multiFixture.componentInstance.select.panelOpen).toBe(
            false,
            'Expected panel to stay closed.'
          );
          fixture.destroy();
          flush();
        }));

        it('should not prevent the default actions on selection keys when pressing a modifier', fakeAsync(() => {
          [ENTER, SPACE].forEach((key) => {
            const event = createKeyboardEvent(key);
            Object.defineProperty(event, 'shiftKey', { get: () => true });
            expect(event.defaultPrevented).toBe(false);
          });
        }));

        it('should be able to focus the select trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already

          fixture.componentInstance.select.focus();

          expect(document.activeElement).toBe(
            select,
            'Expected select element to be focused.'
          );
        }));

        // Having `aria-hidden` on the trigger avoids issues where
        // screen readers read out the wrong amount of options.
        it('should set aria-hidden on the trigger element', fakeAsync(() => {
          const trigger = fixture.debugElement.query(
            By.css('.oui-select-trigger')
          ).nativeElement;

          expect(trigger.getAttribute('aria-hidden')).toBe(
            'true',
            'Expected aria-hidden to be true when the select is open.'
          );
        }));

        it('should set `aria-multiselectable` to true on multi-select instances', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;

          expect(select.getAttribute('aria-multiselectable')).toBe('true');
        }));

        it('should set aria-multiselectable false on single-selection instances', fakeAsync(() => {
          expect(select.getAttribute('aria-multiselectable')).toBe('false');
        }));

        it('should set aria-activedescendant only while the panel is open', fakeAsync(() => {
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();

          const host = fixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;

          expect(host.hasAttribute('aria-activedescendant')).toBe(
            false,
            'Expected no aria-activedescendant on init.'
          );

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options =
            overlayContainerElement.querySelectorAll('oui-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[4].id,
            'Expected aria-activedescendant to match the active option.'
          );

          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          expect(host.hasAttribute('aria-activedescendant')).toBe(
            false,
            'Expected no aria-activedescendant when closed.'
          );
        }));

        it('should set aria-activedescendant based on the focused option', fakeAsync(() => {
          const host = fixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options =
            overlayContainerElement.querySelectorAll('oui-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[0].id
          );
          flush();
        }));

        it('should not change the aria-activedescendant using the horizontal arrow keys', fakeAsync(() => {
          const host = fixture.debugElement.query(By.css('oui-select'))
            .nativeElement as HTMLElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options =
            overlayContainerElement.querySelectorAll('oui-option');
          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[0].id
          );

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', RIGHT_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[0].id
          );
          fixture.destroy();
          flush();
        }));

        it('should restore focus to the trigger after selecting an option in multi-select mode', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(
            By.css('oui-select')
          ).nativeElement;
          instance.select.open();
          multiFixture.detectChanges();

          // Ensure that the select isn't focused to begin with.
          select.blur();
          expect(document.activeElement).not.toBe(
            select,
            'Expected trigger not to be focused.'
          );

          const option = overlayContainerElement.querySelector(
            'oui-option'
          )! as HTMLElement;
          option.click();
          multiFixture.detectChanges();

          expect(document.activeElement).toBe(
            select,
            'Expected trigger to be focused.'
          );
          flush();
        }));
      });
    });

    describe('overlay panel', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(
          By.css('.oui-select-trigger')
        ).nativeElement;
      }));

      it('should not throw when attempting to open too early', () => {
        // Create component and then immediately open without running change detection
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        expect(() => fixture.componentInstance.select.open()).not.toThrow();
      });

      it('should open the panel when trigger is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(overlayContainerElement.textContent).toContain('Steak');
        expect(overlayContainerElement.textContent).toContain('Pizza');
        expect(overlayContainerElement.textContent).toContain('Tacos');
      }));

      it('should close the panel when an item is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'oui-option'
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should close the panel when a click occurs outside the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop'
        ) as HTMLElement;

        backdrop.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should set the width of the overlay based on the trigger', fakeAsync(() => {
        trigger.style.width = '200px';

        trigger.click();
        fixture.detectChanges();
        flush();

        const pane = overlayContainerElement.querySelector(
          '.cdk-overlay-pane'
        ) as HTMLElement;
        expect(pane.style.minWidth).toBe('200px');
      }));

      it('should not attempt to open a select that does not have any options', fakeAsync(() => {
        fixture.componentInstance.foods = [];
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should focus the first option when pressing HOME', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex
        ).toBe(1);
      }));

      it('should focus the last option when pressing END', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        fixture.detectChanges();
        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex
        ).toBe(1);
        flush();
      }));

      it('should be able to set extra classes on the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const panel = overlayContainerElement.querySelector(
          '.oui-select-panel'
        ) as HTMLElement;

        expect(panel.classList).toContain('custom-one');
        expect(panel.classList).toContain('custom-two');
        flush();
      }));

      it('should be able to render options inside groups with an ng-container', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(
          SelectWithGroupsAndNgContainer
        );
        groupFixture.detectChanges();
        trigger = groupFixture.debugElement.query(
          By.css('.oui-select-trigger')
        ).nativeElement;
        trigger.click();
        groupFixture.detectChanges();

        expect(
          document.querySelectorAll('.cdk-overlay-container oui-option').length
        ).toBeGreaterThan(0, 'Expected at least one option to be rendered.');
        flush();
      }));

      it(
        'should not consider itself as blurred if the trigger loses focus while the ' +
          'panel is still open',
        fakeAsync(() => {
          const selectElement = fixture.nativeElement.querySelector(
            '.oui-select'
          ) as HTMLElement;
          const selectInstance = fixture.componentInstance.select;

          dispatchFakeEvent(selectElement, 'focus');
          fixture.detectChanges();

          expect(selectInstance.focused).toBe(
            true,
            'Expected select to be focused.'
          );

          selectInstance.open();
          fixture.detectChanges();
          flush();
          dispatchFakeEvent(selectElement, 'blur');
          fixture.detectChanges();

          expect(selectInstance.focused).toBe(
            true,
            'Expected select element to remain focused.'
          );
          flush();
        })
      );
    });

    describe('selection logic', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;
      let formField: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(
          By.css('.oui-select-trigger')
        ).nativeElement;
        formField = fixture.debugElement.query(
          By.css('.oui-form-field')
        ).nativeElement;
      }));

      it('should not float label if no option is selected', fakeAsync(() => {
        expect(formField.classList.contains('oui-focused oui-focused')).toBe(
          false,
          'Label should not be floating'
        );
        flush();
      }));

      it('should focus the first option if no option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex
        ).toEqual(0);
        flush();
      }));

      it('should select an option when it is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        let option = overlayContainerElement.querySelector(
          'oui-option'
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        option = overlayContainerElement.querySelector(
          'oui-option'
        ) as HTMLElement;

        expect(option.classList).toContain('oui-selected');
        expect(fixture.componentInstance.options.first.selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.first
        );
        flush();
      }));

      it('should be able to select an option using the OuiOption API', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const optionInstances = fixture.componentInstance.options.toArray();
        const optionNodes: NodeListOf<HTMLElement> =
          overlayContainerElement.querySelectorAll('oui-option');

        optionInstances[1].select();
        fixture.detectChanges();

        expect(optionNodes[1].classList).toContain('oui-selected');
        expect(optionInstances[1].selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(
          optionInstances[1]
        );
        flush();
      }));

      it('should deselect other options when one is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        let options = overlayContainerElement.querySelectorAll(
          'oui-option'
        ) as NodeListOf<HTMLElement>;

        options[0].click();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll(
          'oui-option'
        ) as NodeListOf<HTMLElement>;
        expect(options[1].classList).not.toContain('oui-selected');
        expect(options[2].classList).not.toContain('oui-selected');

        const optionInstances = fixture.componentInstance.options.toArray();
        expect(optionInstances[1].selected).toBe(false);
        expect(optionInstances[2].selected).toBe(false);
        flush();
      }));

      it('should deselect other options when one is programmatically selected', fakeAsync(() => {
        const control = fixture.componentInstance.control;
        const foods = fixture.componentInstance.foods;

        trigger.click();
        fixture.detectChanges();
        flush();

        let options = overlayContainerElement.querySelectorAll(
          'oui-option'
        ) as NodeListOf<HTMLElement>;

        options[0].click();
        fixture.detectChanges();
        flush();

        control.setValue(foods[1].value);
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll(
          'oui-option'
        ) as NodeListOf<HTMLElement>;

        expect(options[0].classList).not.toContain(
          'oui-selected',
          'Expected first option to no longer be selected'
        );
        expect(options[1].classList).toContain(
          'oui-selected',
          'Expected second option to be selected'
        );

        const optionInstances = fixture.componentInstance.options.toArray();

        expect(optionInstances[0].selected).toBe(
          false,
          'Expected first option to no longer be selected'
        );
        expect(optionInstances[1].selected).toBe(
          true,
          'Expected second option to be selected'
        );
        flush();
      }));

      it('should remove selection if option has been removed', fakeAsync(() => {
        const select = fixture.componentInstance.select;

        trigger.click();
        fixture.detectChanges();
        flush();

        const firstOption = overlayContainerElement.querySelectorAll(
          'oui-option'
        )[0] as HTMLElement;

        firstOption.click();
        fixture.detectChanges();

        expect(select.selected).toBe(
          select.options.first,
          'Expected first option to be selected.'
        );

        fixture.componentInstance.foods = [];
        fixture.detectChanges();
        flush();

        expect(select.selected).toBeUndefined(
          'Expected selection to be removed when option no longer exists.'
        );
        flush();
      }));

      it('should display the selected option in the trigger', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'oui-option'
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        const value = fixture.debugElement.query(
          By.css('.oui-select-value')
        ).nativeElement;

        expect(value.textContent).toContain('Steak');
        flush();
      }));

      it('should focus the selected option if an option is selected', fakeAsync(() => {
        // must wait for initial writeValue promise to finish
        flush();

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        // must wait for animation to finish
        fixture.detectChanges();
        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex
        ).toEqual(1);
        flush();
      }));

      it('should select an option that was added after initialization', fakeAsync(() => {
        fixture.componentInstance.foods.push({
          viewValue: 'Potatoes',
          value: 'potatoes-8',
        });
        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll(
          'oui-option'
        ) as NodeListOf<HTMLElement>;
        options[8].click();
        fixture.detectChanges();
        flush();

        expect(trigger.textContent).toContain('Potatoes');
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.last
        );
        flush();
      }));

      it('should update the trigger when the selected option label is changed', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        expect(trigger.textContent!.trim()).toBe('Pizza');

        fixture.componentInstance.foods[1].viewValue = 'Calzone';
        fixture.detectChanges();

        expect(trigger.textContent!.trim()).toBe('Calzone');
        flush();
      }));

      it('should not select disabled options', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll(
          'oui-option'
        ) as NodeListOf<HTMLElement>;
        options[2].click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[2].classList).not.toContain('oui-selected');
        expect(fixture.componentInstance.select.selected).toBeUndefined();
        flush();
      }));

      it('should not select options inside a disabled group', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroups);
        groupFixture.detectChanges();
        groupFixture.debugElement
          .query(By.css('.oui-select-trigger'))
          .nativeElement.click();
        groupFixture.detectChanges();

        const disabledGroup =
          overlayContainerElement.querySelectorAll('oui-optgroup')[1];
        const options = disabledGroup.querySelectorAll('oui-option');

        (options[0] as HTMLElement).click();
        groupFixture.detectChanges();

        expect(groupFixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[0].classList).not.toContain('oui-selected');
        expect(groupFixture.componentInstance.select.selected).toBeUndefined();
        flush();
      }));

      it('should not throw if triggerValue accessed with no selected value', fakeAsync(() => {
        expect(
          () => fixture.componentInstance.select.triggerValue
        ).not.toThrow();
      }));

      it('should emit to `optionSelectionChanges` when an option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jasmine.createSpy('option selection spy');
        const subscription =
          fixture.componentInstance.select.optionSelectionChanges.subscribe(
            spy
          );
        const option = overlayContainerElement.querySelector(
          'oui-option'
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(jasmine.any(OuiOptionSelectionChange));

        subscription.unsubscribe();
      }));

      it('should handle accessing `optionSelectionChanges` before the options are initialized', fakeAsync(() => {
        fixture.destroy();
        fixture = TestBed.createComponent(BasicSelect);
        const spy = jasmine.createSpy('option selection spy');
        let subscription: Subscription;

        expect(fixture.componentInstance.select.options).toBeFalsy();
        expect(() => {
          subscription =
            fixture.componentInstance.select.optionSelectionChanges.subscribe(
              spy
            );
        }).not.toThrow();

        fixture.detectChanges();
        trigger = fixture.debugElement.query(
          By.css('.oui-select-trigger')
        ).nativeElement;

        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'oui-option'
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(jasmine.any(OuiOptionSelectionChange));

        subscription!.unsubscribe();
      }));
    });

    describe('disabled behavior', () => {
      it('should disable itself when control is disabled programmatically', fakeAsync(() => {
        const fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();

        fixture.componentInstance.control.disable();
        fixture.detectChanges();
        const trigger = fixture.debugElement.query(
          By.css('.oui-select-trigger')
        ).nativeElement as HTMLElement;
        expect(getComputedStyle(trigger).getPropertyValue('cursor')).toEqual(
          'default',
          `Expected cursor to be default arrow on disabled control.`
        );

        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toEqual(
          '',
          `Expected select panel to stay closed.`
        );
        expect(fixture.componentInstance.select.panelOpen).toBe(
          false,
          `Expected select panelOpen property to stay false.`
        );

        fixture.componentInstance.control.enable();
        fixture.detectChanges();
        expect(getComputedStyle(trigger).getPropertyValue('cursor')).toEqual(
          'pointer',
          `Expected cursor to be a pointer on enabled control.`
        );

        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toContain(
          'Steak',
          `Expected select panel to open normally on re-enabled control`
        );
        expect(fixture.componentInstance.select.panelOpen).toBe(
          true,
          `Expected select panelOpen property to become true.`
        );
        flush();
      }));
    });
  });

  describe('when initialized without options', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([SelectInitWithoutOptions])));

    it('should select the proper option when option list is initialized later', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectInitWithoutOptions);
      const instance = fixture.componentInstance;

      fixture.detectChanges();
      flush();

      // Wait for the initial writeValue promise.
      expect(instance.select.selected).toBeFalsy();

      instance.addOptions();
      fixture.detectChanges();
      flush();

      // Wait for the next writeValue promise.
      expect(instance.select.selected).toBe(instance.options.toArray()[1]);
    }));
  });

  describe('with a selectionChange event handler', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([SelectWithChangeEvent])));

    let fixture: ComponentFixture<SelectWithChangeEvent>;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectWithChangeEvent);
      fixture.detectChanges();

      trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;
    }));

    it('should emit an event when the selected option has changed', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      (
        overlayContainerElement.querySelector('oui-option') as HTMLElement
      ).click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalled();
      flush();
    }));

    it('should not emit multiple change events for the same option', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector(
        'oui-option'
      ) as HTMLElement;

      option.click();
      option.click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
      flush();
    }));
  });

  describe('with ngModel', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([NgModelSelect])));

    it('should disable itself when control is disabled using the property', fakeAsync(() => {
      const fixture = TestBed.createComponent(NgModelSelect);
      fixture.detectChanges();

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      flush();

      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.oui-select-trigger'))
        .nativeElement as HTMLElement;
      expect(getComputedStyle(trigger).getPropertyValue('cursor')).toEqual(
        'default',
        `Expected cursor to be default arrow on disabled control.`
      );

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected select panel to stay closed.`
      );
      expect(fixture.componentInstance.select.panelOpen).toBe(
        false,
        `Expected select panelOpen property to stay false.`
      );

      fixture.componentInstance.isDisabled = false;
      fixture.detectChanges();
      flush();

      fixture.detectChanges();
      expect(getComputedStyle(trigger).getPropertyValue('cursor')).toEqual(
        'pointer',
        `Expected cursor to be a pointer on enabled control.`
      );

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain(
        'Steak',
        `Expected select panel to open normally on re-enabled control`
      );
      expect(fixture.componentInstance.select.panelOpen).toBe(
        true,
        `Expected select panelOpen property to become true.`
      );
      flush();
    }));
  });

  describe('with multiple oui-select elements in one view', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([ManySelects])));

    let fixture: ComponentFixture<ManySelects>;
    let triggers: DebugElement[];
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ManySelects);
      fixture.detectChanges();
      triggers = fixture.debugElement.queryAll(By.css('.oui-select-trigger'));

      triggers[0].nativeElement.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
    }));

    it('should set aria-owns properly', fakeAsync(() => {
      const selects = fixture.debugElement.queryAll(By.css('oui-select'));

      expect(selects[0].nativeElement.getAttribute('aria-owns')).toContain(
        options[0].id,
        `Expected aria-owns to contain IDs of its child options.`
      );
      expect(selects[0].nativeElement.getAttribute('aria-owns')).toContain(
        options[1].id,
        `Expected aria-owns to contain IDs of its child options.`
      );

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      triggers[1].nativeElement.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      expect(selects[1].nativeElement.getAttribute('aria-owns')).toContain(
        options[0].id,
        `Expected aria-owns to contain IDs of its child options.`
      );
      expect(selects[1].nativeElement.getAttribute('aria-owns')).toContain(
        options[1].id,
        `Expected aria-owns to contain IDs of its child options.`
      );
      flush();
    }));

    it('should remove aria-owns when the options are not visible', fakeAsync(() => {
      const select = fixture.debugElement.query(By.css('oui-select'));

      expect(select.nativeElement.hasAttribute('aria-owns')).toBe(
        true,
        'Expected select to have aria-owns while open.'
      );

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      expect(select.nativeElement.hasAttribute('aria-owns')).toBe(
        false,
        'Expected select not to have aria-owns when closed.'
      );
      flush();
    }));

    it('should set the option id properly', fakeAsync(() => {
      const firstOptionID = options[0].id;

      expect(options[0].id).toContain(
        'oui-option',
        `Expected option ID to have the correct prefix.`
      );
      expect(options[0].id).not.toEqual(
        options[1].id,
        `Expected option IDs to be unique.`
      );

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      triggers[1].nativeElement.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      expect(options[0].id).toContain(
        'oui-option',
        `Expected option ID to have the correct prefix.`
      );
      expect(options[0].id).not.toEqual(
        firstOptionID,
        `Expected option IDs to be unique.`
      );
      expect(options[0].id).not.toEqual(
        options[1].id,
        `Expected option IDs to be unique.`
      );
      flush();
    }));
  });

  describe('with tabindex', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([SelectWithPlainTabindex])));

    it('should be able to set the tabindex via the native attribute', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const select = fixture.debugElement.query(
        By.css('oui-select')
      ).nativeElement;
      expect(select.getAttribute('tabindex')).toBe('5');
    }));
  });

  describe('change events', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([SelectWithPlainTabindex])));

    it('should complete the stateChanges stream on destroy', () => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const debugElement = fixture.debugElement.query(By.directive(OuiSelect));
      const select = debugElement.componentInstance;

      const spy = jasmine.createSpy('stateChanges complete');
      const subscription = select.stateChanges.subscribe(
        undefined,
        undefined,
        spy
      );

      fixture.destroy();
      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  describe('when initially hidden', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([BasicSelectInitiallyHidden])));

    it('should set the width of the overlay if the element was hidden initially', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectInitiallyHidden);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;
      trigger.style.width = '200px';
      fixture.componentInstance.isVisible = true;
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      flush();

      const pane = overlayContainerElement.querySelector(
        '.cdk-overlay-pane'
      ) as HTMLElement;
      expect(pane.style.minWidth).toBe('200px');
      flush();
    }));
  });

  describe('with no placeholder', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([BasicSelectNoPlaceholder])));

    it('should set the width of the overlay if there is no placeholder', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectNoPlaceholder);

      fixture.detectChanges();
      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      const pane = overlayContainerElement.querySelector(
        '.cdk-overlay-pane'
      ) as HTMLElement;
      expect(parseInt(pane.style.minWidth as string, 10)).toBeGreaterThan(0);
      flush();
    }));
  });

  describe('when invalid inside a form', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([InvalidSelectInForm])));

    it('should not throw SelectionModel errors in addition to ngModel errors', fakeAsync(() => {
      const fixture = TestBed.createComponent(InvalidSelectInForm);

      // The first change detection run will throw the "ngModel is missing a name" error.
      expect(() => fixture.detectChanges()).toThrowError(
        /the name attribute must be set/g
      );

      // The second run shouldn't throw selection-model related errors.
      expect(() => fixture.detectChanges()).not.toThrow();
      flush();
    }));
  });

  describe('with ngModel using compareWith', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([NgModelCompareWithSelect])));

    let fixture: ComponentFixture<NgModelCompareWithSelect>;
    let instance: NgModelCompareWithSelect;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NgModelCompareWithSelect);
      instance = fixture.componentInstance;
      fixture.detectChanges();
    }));

    describe('comparing by reference', () => {
      beforeEach(fakeAsync(() => {
        spyOn(instance, 'compareByReference').and.callThrough();
        instance.useCompareByReference();
        fixture.detectChanges();
      }));

      it('should use the comparator', fakeAsync(() => {
        expect(instance.compareByReference).toHaveBeenCalled();
      }));

      it('should throw an error when using a non-function comparator', fakeAsync(() => {
        instance.useNullComparator();

        expect(() => {
          fixture.detectChanges();
        }).toThrowError(
          wrappedErrorMessage(getOuiSelectNonFunctionValueError())
        );
      }));
    });
  });

  describe(`when the select's value is accessed on initialization`, () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([SelectEarlyAccessSibling])));

    it('should not throw when trying to access the selected value on init', fakeAsync(() => {
      expect(() => {
        TestBed.createComponent(SelectEarlyAccessSibling).detectChanges();
      }).not.toThrow();
    }));
  });

  describe('inside of a form group', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([SelectInsideFormGroup])));

    let fixture: ComponentFixture<SelectInsideFormGroup>;
    let testComponent: SelectInsideFormGroup;
    let select: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectInsideFormGroup);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      select = fixture.debugElement.query(By.css('oui-select')).nativeElement;
    }));

    it('should not set the invalid class on a clean select', fakeAsync(() => {
      expect(testComponent.formGroup.untouched).toBe(
        true,
        'Expected the form to be untouched.'
      );
      expect(testComponent.formControl.invalid).toBe(
        true,
        'Expected form control to be invalid.'
      );
      expect(select.classList).not.toContain(
        'oui-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );
    }));

    it('should appear as invalid if it becomes touched', fakeAsync(() => {
      expect(select.classList).not.toContain(
        'oui-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );

      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList).toContain(
        'oui-select-invalid',
        'Expected select to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to true.'
      );
    }));

    it('should not have the invalid class when the select becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList).toContain(
        'oui-select-invalid',
        'Expected select to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to true.'
      );

      testComponent.formControl.setValue('pizza-1');
      fixture.detectChanges();

      expect(select.classList).not.toContain(
        'oui-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );
    }));

    it('should appear as invalid when the parent form group is submitted', fakeAsync(() => {
      expect(select.classList).not.toContain(
        'oui-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );

      dispatchFakeEvent(
        fixture.debugElement.query(By.css('form')).nativeElement as HTMLElement,
        'submit'
      );
      fixture.detectChanges();

      expect(select.classList).toContain(
        'oui-select-invalid',
        'Expected select to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to true.'
      );
    }));

    it('should override error matching behavior via injection token', fakeAsync(() => {
      const errorStateMatcher: ErrorStateMatcher = {
        isErrorState: jasmine
          .createSpy('error state matcher')
          .and.returnValue(true),
      };

      fixture.destroy();

      TestBed.resetTestingModule().configureTestingModule({
        imports: [
          OuiFormFieldModule,
          OuiSelectModule,
          ReactiveFormsModule,
          FormsModule,
          NoopAnimationsModule,
        ],
        declarations: [SelectInsideFormGroup],
        providers: [
          { provide: ErrorStateMatcher, useValue: errorStateMatcher },
        ],
      });

      const errorFixture = TestBed.createComponent(SelectInsideFormGroup);
      const component = errorFixture.componentInstance;

      errorFixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(errorStateMatcher.isErrorState).toHaveBeenCalled();
    }));
  });

  describe('with custom error behavior', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([CustomErrorBehaviorSelect])));

    it('should be able to override the error matching behavior via an @Input', fakeAsync(() => {
      const fixture = TestBed.createComponent(CustomErrorBehaviorSelect);
      const component = fixture.componentInstance;
      const matcher = jasmine
        .createSpy('error state matcher')
        .and.returnValue(true);

      fixture.detectChanges();

      expect(component.control.invalid).toBe(false);
      expect(component.select.errorState).toBe(false);

      fixture.componentInstance.errorStateMatcher = { isErrorState: matcher };
      fixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(matcher).toHaveBeenCalled();
    }));
  });

  describe('with preselected array values', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([
        SingleSelectWithPreselectedArrayValues,
      ])));

    it('should be able to preselect an array value in single-selection mode', fakeAsync(() => {
      const fixture = TestBed.createComponent(
        SingleSelectWithPreselectedArrayValues
      );
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;

      expect(trigger.textContent).toContain('Pizza');
    }));
  });

  describe('with OnPush', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([
        BasicSelectOnPush,
        BasicSelectOnPushPreselected,
      ])));

    it('should set the trigger text based on the value when initialized', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPushPreselected);

      fixture.detectChanges();
      flush();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;

      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');
    }));

    it('should update the trigger based on the value', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPush);
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');
      flush();
    }));
  });

  describe('with custom trigger', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([SelectWithCustomTrigger])));

    it('should allow the user to customize the label', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectWithCustomTrigger);
      fixture.detectChanges();

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();

      const label = fixture.debugElement.query(
        By.css('.oui-select-value')
      ).nativeElement;

      expect(label.textContent).toContain(
        'azziP',
        'Expected the displayed text to be "Pizza" in reverse.'
      );
    }));
  });

  describe('when reseting the value by setting null or undefined', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([ResetValuesSelect])));

    let fixture: ComponentFixture<ResetValuesSelect>;
    let trigger: HTMLElement;
    let formField: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ResetValuesSelect);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;
      formField = fixture.debugElement.query(
        By.css('.oui-form-field')
      ).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();
      fixture.detectChanges();
      flush();
    }));

    it('should reset when an option with an undefined value is selected', fakeAsync(() => {
      options[4].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeUndefined();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(formField.classList).not.toContain('oui-focused oui-focused');
      expect(trigger.textContent).not.toContain('Undefined');
    }));

    it('should reset when an option with a null value is selected', fakeAsync(() => {
      options[5].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeNull();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(formField.classList).not.toContain('oui-focused oui-focused');
      expect(trigger.textContent).not.toContain('Null');
    }));

    it('should reset when a blank option is selected', fakeAsync(() => {
      options[6].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeUndefined();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(formField.classList).not.toContain('oui-focused oui-focused');
      expect(trigger.textContent).not.toContain('None');
    }));

    it('should not mark the reset option as selected ', fakeAsync(() => {
      options[5].click();
      fixture.detectChanges();
      flush();

      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();

      expect(options[5].classList).not.toContain('oui-selected');
    }));

    it('should not consider the reset values as selected when resetting the form control', fakeAsync(() => {
      expect(formField.classList).toContain('oui-focused');

      fixture.componentInstance.control.reset();
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toBeNull();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(formField.classList).not.toContain('oui-formf-field-should-float');
      expect(trigger.textContent).not.toContain('Null');
      expect(trigger.textContent).not.toContain('Undefined');
    }));
  });

  describe('without Angular forms', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([
        BasicSelectWithoutForms,
        BasicSelectWithoutFormsPreselected,
        BasicSelectWithoutFormsMultiple,
      ])));

    it('should set the value when options are clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      (
        overlayContainerElement.querySelector('oui-option') as HTMLElement
      ).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('steak-0');
      expect(fixture.componentInstance.select.value).toBe('steak-0');
      expect(trigger.textContent).toContain('Steak');

      trigger.click();
      fixture.detectChanges();
      flush();

      (
        overlayContainerElement.querySelectorAll('oui-option')[2] as HTMLElement
      ).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('sandwich-2');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
      expect(trigger.textContent).toContain('Sandwich');
    }));

    it('should mark options as selected when the value is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      fixture.componentInstance.selectedFood = 'sandwich-2';
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;
      expect(trigger.textContent).toContain('Sandwich');

      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelectorAll('oui-option')[2];

      expect(option.classList).toContain('oui-selected');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
      flush();
    }));

    it('should reset the label when a null value is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      (
        overlayContainerElement.querySelector('oui-option') as HTMLElement
      ).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('steak-0');
      expect(fixture.componentInstance.select.value).toBe('steak-0');
      expect(trigger.textContent).toContain('Steak');

      fixture.componentInstance.selectedFood = null;
      fixture.detectChanges();

      expect(fixture.componentInstance.select.value).toBeNull();
      expect(trigger.textContent).not.toContain('Steak');
    }));

    it('should reflect the preselected value', fakeAsync(() => {
      const fixture = TestBed.createComponent(
        BasicSelectWithoutFormsPreselected
      );

      fixture.detectChanges();
      flush();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;
      fixture.detectChanges();
      expect(trigger.textContent).toContain('Pizza');

      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelectorAll('oui-option')[1];

      expect(option.classList).toContain('oui-selected');
      expect(fixture.componentInstance.select.value).toBe('pizza-1');
      flush();
    }));

    it('should be able to select multiple values', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsMultiple);

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedFoods).toBeFalsy();

      const trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;

      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual(['steak-0']);
      expect(fixture.componentInstance.select.value).toEqual(['steak-0']);
      expect(trigger.textContent).toContain('Steak');

      options[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual([
        'steak-0',
        'sandwich-2',
      ]);
      expect(fixture.componentInstance.select.value).toEqual([
        'steak-0',
        'sandwich-2',
      ]);

      const textContent = trigger.textContent.trim().split(/\s*,\s*/);
      const string = `${textContent[0]}, ${textContent[1]}`;
      expect(string).toContain('Steak, Sandwich');

      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual([
        'steak-0',
        'pizza-1',
        'sandwich-2',
      ]);
      expect(fixture.componentInstance.select.value).toEqual([
        'steak-0',
        'pizza-1',
        'sandwich-2',
      ]);

      const triggerVal = trigger.textContent.trim().split(/\s*,\s*/);
      const stringToTrigger = `${triggerVal[0]}, ${triggerVal[1]}, ${triggerVal[2]}`;
      expect(stringToTrigger).toContain('Steak, Pizza, Sandwich');
      flush();
    }));

    it('should not restore focus to the host element when clicking outside', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const select = fixture.debugElement.nativeElement.querySelector(
        'oui-select'
      ) as HTMLElement;

      fixture.detectChanges();
      fixture.debugElement
        .query(By.css('.oui-select-trigger'))
        .nativeElement.click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement)
        .withContext('Expected trigger to be focused.')
        .toBe(select);

      select.blur(); // Blur manually since the programmatic click might not do it.
      (
        overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop'
        ) as HTMLElement
      ).click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement).not.toBe(
        select,
        'Expected trigger not to be focused.'
      );
    }));

    it('should update the data binding before emitting the change event', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const instance = fixture.componentInstance;
      const spy = jasmine.createSpy('change spy');

      fixture.detectChanges();
      instance.select.selectionChange.subscribe(() =>
        spy(instance.selectedFood)
      );

      expect(instance.selectedFood).toBeFalsy();

      fixture.debugElement
        .query(By.css('.oui-select-trigger'))
        .nativeElement.click();
      fixture.detectChanges();
      flush();

      (
        overlayContainerElement.querySelector('oui-option') as HTMLElement
      ).click();
      fixture.detectChanges();
      flush();

      expect(instance.selectedFood).toBe('steak-0');
      expect(spy).toHaveBeenCalledWith('steak-0');
    }));
  });

  describe('with multiple selection', () => {
    beforeEach(waitForAsync(() =>
      configureOuiSelectTestingModule([MultiSelect])));

    let fixture;
    let testInstance: MultiSelect;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MultiSelect);
      testInstance = fixture.componentInstance;
      fixture.detectChanges();

      trigger = fixture.debugElement.query(
        By.css('.oui-select-trigger')
      ).nativeElement;
    }));

    it('should be able to select multiple values', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([
        'steak-0',
        'tacos-2',
        'eggs-5',
      ]);
      flush();
    }));

    it('should be able to toggle an option on and off', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector(
        'oui-option'
      ) as HTMLElement;

      option.click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0']);

      option.click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([]);
      flush();
    }));

    it('should update the label', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();

      const textContent = trigger.textContent.trim().split(/\s*,\s*/);
      const string = `${textContent[0]}, ${textContent[1]}, ${textContent[2]}`;

      expect(string).toContain('Steak, Tacos, Eggs');

      options[2].click();
      fixture.detectChanges();

      const textContentVal = trigger.textContent.trim().split(/\s*,\s*/);
      const stringValue = `${textContentVal[0]}, ${textContentVal[1]}`;

      expect(stringValue).toContain('Steak, Eggs');
    }));

    it('should be able to set the selected value by taking an array', fakeAsync(() => {
      trigger.click();
      testInstance.control.setValue(['steak-0', 'eggs-5']);
      fixture.detectChanges();

      const optionNodes = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      const optionInstances = testInstance.options.toArray();

      expect(optionNodes[0].classList).toContain('oui-selected');
      expect(optionNodes[5].classList).toContain('oui-selected');

      expect(optionInstances[0].selected).toBe(true);
      expect(optionInstances[5].selected).toBe(true);
      flush();
    }));

    it('should override the previously-selected value when setting an array', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      fixture.detectChanges();

      expect(options[0].classList).toContain('oui-selected');

      testInstance.control.setValue(['eggs-5']);
      fixture.detectChanges();

      expect(options[0].classList).not.toContain('oui-selected');
      expect(options[5].classList).toContain('oui-selected');
      flush();
    }));

    it('should not close the panel when clicking on options', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[1].click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);
      flush();
    }));

    it('should sort the selected options based on their order in the panel', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[2].click();
      options[0].click();
      options[1].click();
      fixture.detectChanges();

      const triggerVal = trigger.textContent.trim().split(/\s*,\s*/);
      const stringToTrigger = `${triggerVal[0]}, ${triggerVal[1]}, ${triggerVal[2]}`;

      expect(stringToTrigger).toContain('Steak, Pizza, Tacos');
      expect(fixture.componentInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
      ]);
    }));

    it('should sort the selected options in reverse in rtl', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[2].click();
      options[0].click();
      options[1].click();
      fixture.detectChanges();

      const triggerVal = trigger.textContent.trim().split(/\s*,\s*/);
      const stringToTrigger = `${triggerVal[0]}, ${triggerVal[1]}, ${triggerVal[2]}`;

      expect(stringToTrigger).toContain('Steak, Pizza, Tacos');
      expect(fixture.componentInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
      ]);
    }));

    it('should be able to customize the value sorting logic', fakeAsync(() => {
      fixture.componentInstance.sortComparator = (a, b, optionsArray) =>
        optionsArray.indexOf(b) - optionsArray.indexOf(a);
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      for (let i = 0; i < 3; i++) {
        options[i].click();
      }
      fixture.detectChanges();

      const triggerVal = trigger.textContent.trim().split(/\s*,\s*/);
      const stringToTrigger = `${triggerVal[0]}, ${triggerVal[1]}, ${triggerVal[2]}`;

      // Expect the items to be in reverse order.
      expect(stringToTrigger).toContain('Tacos, Pizza, Steak');

      // expect(fixture.componentInstance.control.value).toEqual(['tacos-2', 'pizza-1', 'steak-0']);
      flush();
    }));

    it('should sort the values that get set via the model based on the panel order', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      testInstance.control.setValue(['tacos-2', 'steak-0', 'pizza-1']);
      fixture.detectChanges();

      const textContent = trigger.textContent.trim().split(/\s*,\s*/);
      const string = `${textContent[0]}, ${textContent[1]}, ${textContent[2]}`;

      expect(string).toContain('Steak, Pizza, Tacos');
      flush();
    }));

    it('should reverse sort the values, that get set via the model in rtl', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      testInstance.control.setValue(['tacos-2', 'steak-0', 'pizza-1']);
      fixture.detectChanges();
      const textContent = trigger.textContent.trim().split(/\s*,\s*/);
      const string = `${textContent[2]}, ${textContent[1]}, ${textContent[0]}`;

      expect(string).toContain('Tacos, Pizza, Steak');
      flush();
    }));

    it('should throw an exception when trying to set a non-array value', fakeAsync(() => {
      expect(() => {
        testInstance.control.setValue('not-an-array');
      }).toThrowError(wrappedErrorMessage(getOuiSelectNonArrayValueError()));
    }));

    it('should throw an exception when trying to change multiple mode after init', fakeAsync(() => {
      expect(() => {
        testInstance.select.multiple = false;
      }).toThrowError(wrappedErrorMessage(getOuiSelectDynamicMultipleError()));
    }));

    it('should pass the `multiple` value to all of the option instances', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      expect(
        testInstance.options.toArray().every((option) => !!option.multiple)
      ).toBe(
        true,
        'Expected `multiple` to have been added to initial set of options.'
      );

      testInstance.foods.push({ value: 'cake-8', viewValue: 'Cake' });
      fixture.detectChanges();

      expect(
        testInstance.options.toArray().every((option) => !!option.multiple)
      ).toBe(
        true,
        'Expected `multiple` to have been set on dynamically-added option.'
      );
    }));

    it('should update the active item index on click', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(
        0
      );

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(
        2
      );
    }));

    it('should be to select an option with a `null` value', fakeAsync(() => {
      fixture.componentInstance.foods = [
        { value: null, viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: null, viewValue: 'Tacos' },
      ];

      fixture.detectChanges();
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'oui-option'
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[1].click();
      options[2].click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([null, 'pizza-1', null]);
      flush();
    }));

    it('should select all options when pressing ctrl + a', () => {
      const selectElement = fixture.nativeElement.querySelector(
        'oui-select'
      ) as HTMLElement;
      const options = fixture.componentInstance.options.toArray();

      expect(testInstance.control.value).toBeFalsy();
      expect(options.every((option) => option.selected)).toBe(false);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent(A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(options.every((option) => option.selected)).toBe(true);
      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
    });

    it('should skip disabled options when using ctrl + a', () => {
      const selectElement = fixture.nativeElement.querySelector(
        'oui-select'
      ) as HTMLElement;
      const options = fixture.componentInstance.options.toArray();

      for (let i = 0; i < 3; i++) {
        options[i].disabled = true;
      }

      expect(testInstance.control.value).toBeFalsy();

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent(A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
    });

    it('should select all options when pressing ctrl + a when some options are selected', () => {
      const selectElement = fixture.nativeElement.querySelector(
        'oui-select'
      ) as HTMLElement;
      const options = fixture.componentInstance.options.toArray();

      options[0].select();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0']);
      expect(options.some((option) => option.selected)).toBe(true);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent(A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(options.every((option) => option.selected)).toBe(true);
      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
    });

    it('should deselect all options with ctrl + a if all options are selected', () => {
      const selectElement = fixture.nativeElement.querySelector(
        'oui-select'
      ) as HTMLElement;
      const options = fixture.componentInstance.options.toArray();

      options.forEach((option) => option.select());
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
      expect(options.every((option) => option.selected)).toBe(true);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent(A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(options.some((option) => option.selected)).toBe(false);
      expect(testInstance.control.value).toEqual([]);
    });
  });
});
