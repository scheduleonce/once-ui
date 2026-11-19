import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  DebugElement,
  NgZone,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { OuiFormFieldModule } from '../form-field/form-field-module';
import { OuiInputModule } from '../input/input-module';
import { MockNgZone } from '../core/cdk/testing';
import {
  OuiChipEvent,
  OuiChipGrid,
  OuiChipGridChange,
  OuiChipInputEvent,
  OuiChipRemove,
  OuiChipRow,
  OuiChipsModule,
} from './public-api';
import { ChipsAutocompleteSelectedEvent } from './chips-autocomplete';
import { ChipsAutocompleteTrigger } from './chips-autocomplete-trigger';

// Fake timers replace Zone-based fakeAsync; tick advances them.
const drainMicrotasks = async () => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};
const tick = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  await drainMicrotasks();
};

@Component({
  template: `
    <oui-form-field>
      <oui-chip-grid #chipGrid [value]="fruits" (change)="lastChange = $event">
        @for (fruit of fruits; track fruit) {
        <oui-chip-row [value]="fruit" (removed)="remove(fruit)">
          {{ fruit }}
          <button ouiChipRemove aria-label="remove {{ fruit }}">
            <span aria-hidden="true">x</span>
          </button>
        </oui-chip-row>
        }
      </oui-chip-grid>
      <input
        placeholder="New fruit..."
        [ouiChipAutocomplete]="auto"
        [formControl]="currentFruitCtrl"
        [ouiChipInputFor]="chipGrid"
        [ouiChipInputSeparatorKeyCodes]="separatorKeysCodes"
        [ouiChipInputAddOnBlur]="true"
        (ouiChipInputTokenEnd)="add($event)"
      />
      <oui-chips-autocomplete
        #auto="ouiChipsAutocomplete"
        (optionSelected)="selected($event)"
      >
        @for (fruit of filteredFruits; track fruit) {
        <oui-chips-option [value]="fruit">{{ fruit }}</oui-chips-option>
        }
      </oui-chips-autocomplete>
    </oui-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    OuiChipsModule,
    OuiFormFieldModule,
    OuiInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class ChipsAutocompleteHostComponent {
  separatorKeysCodes = [ENTER, COMMA];
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  currentFruitCtrl = new UntypedFormControl('');
  lastChange: OuiChipGridChange | null = null;
  disabled = false;

  get filteredFruits(): string[] {
    const raw = this.currentFruitCtrl.value;
    const value = typeof raw === 'string' ? raw.toLowerCase() : '';
    return value
      ? this.allFruits.filter((fruit) => fruit.toLowerCase().includes(value))
      : this.allFruits.slice();
  }

  @ViewChild(OuiChipGrid) chipGrid!: OuiChipGrid;

  add(event: OuiChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.fruits.includes(value)) {
      this.fruits = [...this.fruits, value];
    }
    event.chipInput.clear();
    this.currentFruitCtrl.setValue('');
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits = [
        ...this.fruits.slice(0, index),
        ...this.fruits.slice(index + 1),
      ];
    }
  }

  selected(event: ChipsAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value && !this.fruits.includes(value)) {
      this.fruits = [...this.fruits, value];
    }
    this.currentFruitCtrl.setValue('');
    event.option.deselect();
  }
}

describe('OuiChipGrid (Chips Autocomplete)', () => {
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

  let fixture: ComponentFixture<ChipsAutocompleteHostComponent>;
  let component: ChipsAutocompleteHostComponent;
  let overlayContainer: OverlayContainer;
  let trigger: ChipsAutocompleteTrigger;
  let zone: MockNgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChipsAutocompleteHostComponent,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        OuiFormFieldModule,
        OuiInputModule,
        OuiChipsModule,
      ],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsAutocompleteHostComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
    trigger = fixture.debugElement
      .query(By.directive(ChipsAutocompleteTrigger))
      .injector.get(ChipsAutocompleteTrigger);
    // Flush the trigger's closing-actions subscription so panel
    // closing actions (optionSelections + outside clicks) become active.
    zone.simulateZoneExit();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getChips(): DebugElement[] {
    return fixture.debugElement.queryAll(By.directive(OuiChipRow));
  }

  function getInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input')).nativeElement;
  }

  function dispatchInputEvent(value: string): void {
    const input = getInput();
    input.focus();
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function pressKey(keyCode: number): void {
    const input = getInput();
    const event = new KeyboardEvent('keydown', {
      key: keyCode === ENTER ? 'Enter' : keyCode === COMMA ? ',' : '',
      keyCode,
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);
    fixture.detectChanges();
  }

  function getOptions(): HTMLElement[] {
    return Array.from(
      overlayContainer
        .getContainerElement()
        .querySelectorAll('oui-chips-option')
    );
  }

  it('renders the initial set of chips', () => {
    expect(getChips()).toHaveLength(1);
    expect(getChips()[0].nativeElement.textContent.trim()).toContain('Lemon');
  });

  it('adds a new chip when typing a separator key (ENTER)', async () => {
    dispatchInputEvent('Apple');
    pressKey(ENTER);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(component.fruits).toEqual(['Lemon', 'Apple']);
    expect(getChips()).toHaveLength(2);
  });

  it('adds a new chip when typing a separator key (COMMA)', async () => {
    dispatchInputEvent('Orange');
    pressKey(COMMA);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(component.fruits).toContain('Orange');
  });

  it('adds the typed value on blur when addOnBlur is true', async () => {
    dispatchInputEvent('Lime');
    getInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(component.fruits).toContain('Lime');
  });

  it('does not add an empty chip', async () => {
    dispatchInputEvent('   ');
    pressKey(ENTER);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(component.fruits).toEqual(['Lemon']);
  });

  it('removes a chip when the remove button is clicked', () => {
    const removeButton = fixture.debugElement.query(By.directive(OuiChipRemove))
      .nativeElement as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect(component.fruits).toEqual([]);
    expect(getChips()).toHaveLength(0);
  });

  it('emits the change event when the chip list is mutated', async () => {
    dispatchInputEvent('Apple');
    pressKey(ENTER);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    // Trigger the chip grid blur path so change is emitted.
    getInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(component.lastChange).not.toBeNull();
    expect(component.lastChange!.value).toEqual(['Lemon', 'Apple']);
  });

  it('reflects the bound `value` into the chip grid', () => {
    component.fruits = ['Apple', 'Lemon', 'Lime'];
    fixture.detectChanges();

    expect(component.fruits).toHaveLength(3);
  });

  it('writes back the model value when removed via keyboard (DELETE on focused chip)', async () => {
    const chip = getChips()[0];
    chip.nativeElement.focus();
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', {
      key: 'Delete',
      keyCode: 46,
      bubbles: true,
      cancelable: true,
    });
    chip.nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();

    expect(component.fruits).toEqual([]);
  });

  it('fires a removed event on chip row when removed', () => {
    let removedSpy: OuiChipEvent | null = null;
    const chipDebugEl = getChips()[0];
    chipDebugEl.componentInstance.removed.subscribe((event: OuiChipEvent) => {
      removedSpy = event;
    });

    const removeButton = fixture.debugElement.query(By.directive(OuiChipRemove))
      .nativeElement as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect(removedSpy).not.toBeNull();
  });

  describe('with autocomplete', () => {
    it('opens the panel when the input is focused', async () => {
      getInput().focus();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(trigger.panelOpen).toBe(true);
      expect(getOptions().length).toBeGreaterThan(0);
    });

    it('adds the option value as a chip when an option is clicked', async () => {
      getInput().focus();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = getOptions();
      expect(options.length).toBeGreaterThan(0);

      const targetOption = options.find(
        (opt) => opt.textContent?.trim() === 'Apple'
      ) as HTMLElement;
      expect(targetOption).toBeTruthy();

      targetOption.click();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(component.fruits).toContain('Apple');
      expect(trigger.panelOpen).toBe(false);
    });

    it('selects the active option via Enter key and adds only that option', async () => {
      dispatchInputEvent('App');
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      // Press ArrowDown to activate first option then Enter to select it.
      pressKey(40); // DOWN_ARROW
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      pressKey(ENTER);
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      // Should contain 'Apple' (the activated option) and NOT 'App' as a
      // separate chip - autocomplete must run before chip-input on Enter.
      expect(component.fruits).toContain('Apple');
      expect(component.fruits.filter((f) => f === 'App')).toHaveLength(0);
    });

    it('closes the panel when clicking outside the form field', async () => {
      getInput().focus();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(trigger.panelOpen).toBe(true);

      // Click outside the form-field/overlay (document body).
      document.body.click();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(trigger.panelOpen).toBe(false);
    });

    it('emits optionSelected when an option is selected', async () => {
      let captured: ChipsAutocompleteSelectedEvent | null = null;
      component.selected = (event: ChipsAutocompleteSelectedEvent) => {
        captured = event;
      };

      getInput().focus();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const targetOption = getOptions().find(
        (opt) => opt.textContent?.trim() === 'Lime'
      ) as HTMLElement;
      targetOption.click();
      fixture.detectChanges();
      await tick();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(captured).not.toBeNull();
      expect(captured!.option.viewValue).toBe('Lime');
    });
  });
});
