import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UntypedFormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChipsAutocompleteSelectedEvent,
  OuiChipInputEvent,
  OuiIconRegistry,
} from '../../components';
import { FRUITS, INITIAL_FRUITS } from './const';

@Component({
  selector: 'oui-chips-autocomplete-storybook',
  template: `
    <oui-form-field
      [appearance]="appearance()"
      style="max-width: 400px; display: block;"
    >
      <oui-chip-grid
        #chipGrid
        [disabled]="disabled()"
        [value]="fruits()"
        (change)="onChange($event)"
      >
        @for (fruit of fruits(); track fruit) {
        <oui-chip-row [value]="fruit" (removed)="remove(fruit)">
          {{ fruit }}
          <button ouiChipRemove aria-label="Remove {{ fruit }}">
            <oui-icon svgIcon="x-close-small"></oui-icon>
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
        [ouiChipInputAddOnBlur]="addOnBlur()"
        (ouiChipInputTokenEnd)="add($event)"
      />
      <oui-chips-autocomplete
        #auto="ouiChipsAutocomplete"
        (optionSelected)="selected($event)"
      >
        @for (fruit of filteredFruits(); track fruit) {
        <oui-chips-option [value]="fruit">{{ fruit }}</oui-chips-option>
        }
      </oui-chips-autocomplete>
    </oui-form-field>
  `,
  standalone: false,
})
export class OuiChipsAutocompleteStorybook {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentFruitCtrl = new UntypedFormControl('');
  private _cdr = inject(ChangeDetectorRef);

  readonly currentFruit = signal('');
  readonly fruits = signal<string[]>([...INITIAL_FRUITS]);

  readonly filteredFruits = computed(() => {
    const currentFruit = this.currentFruit().toLowerCase();
    return currentFruit
      ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(currentFruit))
      : FRUITS.slice();
  });

  readonly appearance = input<string>('standard');
  readonly disabled = input<boolean>(false);
  readonly addOnBlur = input<boolean>(true);

  readonly chipAdded = output<string>();
  readonly chipRemoved = output<string>();
  readonly autocompleteOptionSelected = output<string>();

  constructor() {
    const ouiIconRegistry = inject(OuiIconRegistry);
    const domSanitizer = inject(DomSanitizer);

    ouiIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?v7tuaj'
      )
    );

    this.currentFruitCtrl.valueChanges.subscribe((value: string) => {
      this.currentFruit.set(value ?? '');
    });

    effect(() => {
      this.fruits();
      this._cdr.markForCheck();
    });
  }

  add(event: OuiChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.fruits().includes(value)) {
      this.fruits.update((fruits) => [...fruits, value]);
      this.chipAdded.emit(value);
    }

    event.chipInput.clear();
    this.currentFruitCtrl.setValue('');
  }

  remove(fruit: string): void {
    this.fruits.update((fruits) => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }
      const next = [...fruits];
      next.splice(index, 1);
      return next;
    });
    this.chipRemoved.emit(fruit);
  }

  selected(event: ChipsAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value && !this.fruits().includes(value)) {
      this.fruits.update((fruits) => [...fruits, value]);
      this.autocompleteOptionSelected.emit(value);
    }
    this.currentFruitCtrl.setValue('');
    event.option.deselect();
  }

  onChange(_event: any): void {}
}
