# Chips Autocomplete

`oui-chip-grid` combined with `oui-chips-autocomplete` provides a list of selectable chips and an input field that lets users add new entries, either by typing and pressing a separator key, or by selecting from a panel of suggested options.

See: https://material.angular.dev/components/chips/overview#chips-autocomplete

## Usage

```html
<oui-form-field>
  <oui-chip-grid #chipGrid [value]="fruits" (change)="onChange($event)">
    @for (fruit of fruits; track fruit) {
      <oui-chip-row [value]="fruit" (removed)="remove(fruit)">
        {{ fruit }}
        <button ouiChipRemove aria-label="remove">
          <oui-icon svgIcon="x-close-small"></oui-icon>
        </button>
      </oui-chip-row>
    }
    <input
      placeholder="New fruit..."
      [ouiChipInputFor]="chipGrid"
      [ouiChipInputSeparatorKeyCodes]="separatorKeysCodes"
      [ouiChipInputAddOnBlur]="addOnBlur"
      (ouiChipInputTokenEnd)="add($event)"
      [ouiChipAutocomplete]="auto"
      [formControl]="currentFruitCtrl"
    />
  </oui-chip-grid>
  <oui-chips-autocomplete #auto="ouiChipsAutocomplete" (optionSelected)="selected($event)">
    @for (fruit of filteredFruits; track fruit) {
      <oui-chips-option [value]="fruit">{{ fruit }}</oui-chips-option>
    }
  </oui-chips-autocomplete>
</oui-form-field>
```

The companion component typescript file contains the logic for adding/removing chips, listening to autocomplete selection, and computing the list of filtered options.

```ts
import { COMMA, ENTER } from '@angular/cdk/keycodes';

readonly separatorKeysCodes = [ENTER, COMMA];
readonly currentFruitCtrl = new UntypedFormControl<string>('');
readonly currentFruit = signal('');
readonly fruits = signal<string[]>(['Lemon']);
readonly allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
readonly filteredFruits = computed(() => {
  const currentFruit = this.currentFruit().toLowerCase();
  return currentFruit
    ? this.allFruits.filter((fruit) =>
        fruit.toLowerCase().includes(currentFruit)
      )
    : this.allFruits.slice();
});

add(event: OuiChipInputEvent): void {
  const value = (event.value || '').trim();
  if (value && !this.fruits().includes(value)) {
    this.fruits.update((fruits) => [...fruits, value]);
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
}

selected(event: ChipsAutocompleteSelectedEvent): void {
  const value = event.option.viewValue;
  if (value && !this.fruits().includes(value)) {
    this.fruits.update((fruits) => [...fruits, value]);
  }
  this.currentFruitCtrl.setValue('');
  event.option.deselect();
}
```

### Adding chips on blur

Set `ouiChipInputAddOnBlur` to `true` on the input to also add the typed value when the input loses focus.

```html
<input
  [ouiChipInputFor]="chipGrid"
  [ouiChipInputSeparatorKeyCodes]="separatorKeysCodes"
  [ouiChipInputAddOnBlur]="true"
  (ouiChipInputTokenEnd)="add($event)"
/>
```

### Custom separator keys

Use `ouiChipInputSeparatorKeyCodes` to define which keys create a chip.

```html
<input
  [ouiChipInputFor]="chipGrid"
  [ouiChipInputSeparatorKeyCodes]="[ENTER, COMMA, TAB]"
  (ouiChipInputTokenEnd)="add($event)"
/>
```

### Keyboard interaction

- `LEFT_ARROW` / `RIGHT_ARROW`: Move focus between chips.
- `BACKSPACE`: When the chip input is empty, focus the last chip.
- `DELETE`: Remove the currently focused chip.
- `ENTER` / configured separators: Commit the typed value as a chip.
- `DOWN_ARROW` / `UP_ARROW`: Navigate through autocomplete options when the panel is open.
- `ENTER`: Select the highlighted autocomplete option (panel must be open).
- `ESCAPE`: Close the autocomplete panel.

## Stackblitz demo link

https://stackblitz.com/edit/oui-chips-autocomplete

## Accessibility

`oui-chip-grid` exposes the chip grid as `role="grid"` once it contains chips. The chip input is automatically given a combobox relationship with the autocomplete panel via `ouiChipAutocomplete`. Each chip row exposes a `ouiChipRemove` button that can be reached with the keyboard and should always be given a meaningful `aria-label`.

The autocomplete panel uses `role="listbox"` with each option using `role="option"`. The active option is tracked via `aria-activedescendant` on the input element.

## Directives

### `OuiChipGrid`

Selector: `oui-chip-grid`

Exported as: `ouiChipGrid`

### `OuiChipSet`

Selector: `oui-chip-set`

Exported as: `ouiChipSet`

### `OuiChipRow`

Selector: `oui-chip-row, [oui-chip-row], oui-basic-chip-row, [oui-basic-chip-row]`

Exported as: `ouiChipRow`

### `OuiChip`

Selector: `oui-basic-chip, [oui-basic-chip], oui-chip, [oui-chip]`

Exported as: `ouiChip`

### `OuiChipInput`

Selector: `input[ouiChipInputFor]`

Exported as: `ouiChipInput, ouiChipInputFor`

### `OuiChipRemove`

Selector: `[ouiChipRemove]`

### `ChipsAutocomplete`

Selector: `oui-chips-autocomplete`

Exported as: `ouiChipsAutocomplete`

### `ChipsAutocompleteTrigger`

Selector: `input[ouiChipAutocomplete]`

Exported as: `ouiChipAutocompleteTrigger`

## Properties

### `OuiChipGrid`

| Name | Description | Default | Control |
| ---- | ----------- | ------- | ------- |
| `@Input() disabled: boolean` | Whether the chip grid is disabled. | `false` | boolean |
| `@Input() placeholder: string` | Placeholder text for the chip input. | `''` | text |
| `@Input() required: boolean` | Whether the chip grid is required. | `false` | boolean |
| `@Input() value: any[]` | The current value of the chip grid. | `[]` | — |
| `@Input() tabIndex: number` | Tabindex for the chip grid. | `0` | number |
| `@Input() errorStateMatcher: ErrorStateMatcher` | Matcher used to compute the error state. | `ErrorStateMatcher` | — |
| `@Output() change: EventEmitter<OuiChipGridChange>` | Emitted when the chip grid value changes. | — | — |
| `@Output() valueChange: EventEmitter<any>` | Emitted whenever the value changes. | — | — |

### `OuiChipSet`

| Name | Description | Default | Control |
| ---- | ----------- | ------- | ------- |
| `@Input() disabled: boolean` | Whether the chip set is disabled. | `false` | boolean |
| `@Input() role: string` | ARIA role applied to the chip set. | `'presentation'` | text |
| `@Input() tabIndex: number` | Tabindex of the chip set. | `0` | number |

### `OuiChipRow`

| Name | Description | Default | Control |
| ---- | ----------- | ------- | ------- |
| `@Input() value: any` | The value associated with the chip. | content text | text |
| `@Input() removable: boolean` | Whether the chip can be removed. | `true` | boolean |
| `@Input() disabled: boolean` | Whether the chip is disabled. | `false` | boolean |
| `@Input() color: string` | Color theme of the chip (primary, accent, warn). | `'primary'` | select |
| `@Input() highlighted: boolean` | Whether the chip is highlighted. | `false` | boolean |
| `@Output() removed: EventEmitter<OuiChipEvent>` | Emitted when the chip is removed. | — | — |
| `@Output() destroyed: EventEmitter<OuiChipEvent>` | Emitted when the chip is destroyed. | — | — |

### `OuiChipInput`

| Name | Description | Default | Control |
| ---- | ----------- | ------- | ------- |
| `@Input('ouiChipInputFor') chipGrid: OuiChipGrid` | The chip grid this input belongs to. | — | — |
| `@Input('ouiChipInputAddOnBlur') addOnBlur: boolean` | Whether to emit `chipEnd` on blur. | `false` | boolean |
| `@Input('ouiChipInputSeparatorKeyCodes') separatorKeyCodes: number[]` | Key codes that emit `chipEnd`. | `[ENTER]` | — |
| `@Input() placeholder: string` | Placeholder text. | `''` | text |
| `@Input() disabled: boolean` | Whether the input is disabled. | `false` | boolean |
| `@Input() readonly: boolean` | Whether the input is readonly. | `false` | boolean |
| `@Input('ouiChipInputDisabledInteractive') disabledInteractive: boolean` | Whether the input remains interactive when disabled. | `false` | boolean |
| `@Output('ouiChipInputTokenEnd') chipEnd: EventEmitter<OuiChipInputEvent>` | Emitted when a chip is to be added. | — | — |

### `ChipsAutocomplete`

| Name | Description | Default | Control |
| ---- | ----------- | ------- | ------- |
| `@Input() displayWith: (value: any) => string` | Function that maps an option's value to its display string. | `null` | — |
| `@Input() autoActiveFirstOption: boolean` | Whether the first option is highlighted when the panel opens. | `false` | boolean |
| `@Input() panelWidth: string \| number` | Width of the autocomplete panel. Matches host width if unset. | — | — |
| `@Input() class: string` | CSS classes applied to the panel element. | `''` | text |
| `@Output() optionSelected: EventEmitter<ChipsAutocompleteSelectedEvent>` | Emitted when an option is selected. | — | — |
| `@Output() opened: EventEmitter<void>` | Emitted when the panel is opened. | — | — |
| `@Output() closed: EventEmitter<void>` | Emitted when the panel is closed. | — | — |

### `ChipsAutocompleteTrigger`

| Name | Description | Default | Control |
| ---- | ----------- | ------- | ------- |
| `@Input('ouiChipAutocomplete') autocomplete: ChipsAutocomplete` | The autocomplete panel to attach to this trigger. | — | — |
| `@Input('autocomplete') autocompleteAttribute: string` | `autocomplete` attribute for the native input. | `'off'` | text |
| `@Input('ouiChipAutocompleteDisabled') autocompleteDisabled: boolean` | Whether the autocomplete is disabled. | `false` | boolean |

### `ChipsAutocompleteSelectedEvent`

| Name | Description |
| ---- | ----------- |
| `source: ChipsAutocomplete` | The autocomplete panel that emitted the event. |
| `option: ChipsOption` | The option that was selected. |
| `option.viewValue: string` | The display text of the selected option. |
