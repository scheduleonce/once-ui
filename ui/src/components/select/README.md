# Overview

`<oui-select>` is a form control for selecting a value from a set of options, similar to the native `<select>` element. It is designed to work inside of a `<oui-form-field>` element.

To add options to the select, add <oui-option> elements to the `<oui-select>`. Each `<oui-option>` has a value property that can be used to set the value that will be selected if the user chooses this option. The content of the `<oui-option>` is what will be shown to the user.

### Basic select

```angular2html
      <oui-form-field>
        <oui-select placeholder="Favorite Bank">
          <oui-option *ngFor="let bank of banks" [value]="bank.id">
            {{ bank.name }}
          </oui-option>
        </oui-select>
      </oui-form-field>
```

## Getting and setting the select value

The `<oui-select>` supports 2-way binding to the value property without the need for Angular forms.

```angular2html
      <oui-form-field color="accent">
        <oui-select [(value)]="selectedOption">
          <oui-option>None</oui-option>
          <oui-option value="option1">Option 1</oui-option>
          <oui-option value="option2">Option 2</oui-option>
          <oui-option value="option3">Option 3</oui-option>
        </oui-select>
      </oui-form-field>
      <p>You selected: {{ selectedOption }}</p>
```

## Form field features

There are a number of `<oui-form-field>` features that can be used with both `<select>` and `<oui-select>`. These include error messages, hint text, prefix & suffix, and theming.

```angular2html
    <oui-form-field color="accent">
      <oui-select [(value)]="selectedOption" placeholder="Option">
        <oui-option>None</oui-option>
        <oui-option value="option1">Option 1</oui-option>
        <oui-option value="option2">Option 2 with long text</oui-option>
        <oui-option value="option3">Option 3</oui-option>
      </oui-select>
    </oui-form-field>
```

## Disabling the select or individual options

It is possible to disable the entire select or individual options in the select by using the disabled property on the `<select>` or `<oui-select>` and the `<option>` or elements respectively.

```angular2html
    <oui-checkbox [formControl]="disableSelect">Disable select</oui-checkbox>

    <oui-form-field>
      <oui-select
        placeholder="Choose an option"
        [disabled]="disableSelect.value"
      >
        <oui-option value="option1">Option 1</oui-option>
        <oui-option value="option2" disabled>Option 2 (disabled)</oui-option>
        <oui-option value="option3">Option 3</oui-option>
      </oui-select>
    </oui-form-field>
```

## Resetting the select value

If you want one of your options to reset the select's value, you can omit specifying its value.

```angular2html
  <oui-form-field color="accent">
      <oui-select [(value)]="selectedOption">
        <oui-option>None</oui-option>
        <oui-option value="option1">Option 1</oui-option>
        <oui-option value="option2">Option 2 with long text</oui-option>
        <oui-option value="option3">Option 3</oui-option>
      </oui-select>
    </oui-form-field>
```

## Creating groups of options

The `<oui-optgroup>` element can be used to group common options under a subheading. The name of the group can be set using the label property of `<oui-optgroup>`. Like individual `<oui-option>` elements, an entire `<oui-optgroup>` can be disabled or enabled by setting the disabled property on the group.

```angular2html
      <oui-form-field>
        <oui-select placeholder="Pokemon">
          <oui-option>-- None --</oui-option>
          <oui-optgroup
            *ngFor="let group of pokemonGroups"
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
        </oui-select>
      </oui-form-field>
```

## Multiple selection

`<oui-select>` defaults to single-selection mode, but can be configured to allow multiple selection by setting the multiple property. This will allow the user to select multiple values at once. When using the `<oui-select>` in multiple selection mode, its value will be a sorted list of all selected values rather than a single value.

```angular2html
      <oui-form-field [appearance]="'underline'">
        <oui-select placeholder="Favorite food" multiple>
          <oui-option *ngFor="let bank of banks" [value]="bank.id">
            {{ bank.name }}
          </oui-option>
        </oui-select>
      </oui-form-field>
```

## Customizing the trigger label

If you want to display a custom trigger label inside a `<oui-select>`, you can use the <oui-select-trigger> element.

```angular2html
    <oui-select placeholder="Toppings" [formControl]="toppings" multiple>
        <oui-select-trigger>
          {{ toppings.value ? toppings.value[0] : '' }}
          <span
            *ngIf="toppings.value?.length > 1"
            class="example-additional-selection"
          >
            (+{{ toppings.value.length - 1 }}
            {{ toppings.value?.length === 2 ? 'other' : 'others' }})
          </span>
        </oui-select-trigger>
        <oui-select-search [(ngModel)]="keyword"></oui-select-search>
        <oui-option
          *ngFor="let topping of (toppingList | filterOptions: keyword)"
          [value]="topping"
          >{{ topping }}
        </oui-option>
        <div
          *ngIf="!(toppingList | filterOptions: keyword).length"
          class="noResults"
        >
          No results match "{{ keyword }}"
        </div>
    </oui-select>
```

## Adding custom styles to the dropdown panel

In order to facilitate easily styling the dropdown panel, `<oui-select>` has a panelClass property which can be used to apply additional CSS classes to the dropdown panel.

```angular2html
    <oui-form-field>
      <oui-select
        placeholder="Panel color"
        [formControl]="panelColor"
        panelClass="example-panel-{{ panelColor.value }}"
      >
        <oui-option value="red">Red</oui-option>
        <oui-option value="green">Green</oui-option>
        <oui-option value="blue">Blue</oui-option>
      </oui-select>
    </oui-form-field>
```

## Changing when error messages are shown

The `<oui-form-field>` allows you to associate error messages with your `<select>` or `<oui-select>`. By default, these error messages are shown when the control is invalid and either the user has interacted with (touched) the element or the parent form has been submitted. If you wish to override this behavior (e.g. to show the error as soon as the invalid control is dirty or when a parent form group is invalid), you can use the errorStateMatcher property of the `<oui-select>`. The property takes an instance of an ErrorStateMatcher object. An ErrorStateMatcher must implement a single method isErrorState which takes the FormControl for this `<oui-select>` as well as the parent form and returns a boolean indicating whether errors should be shown. (true indicating that they should be shown, and false indicating that they should not.)

```angular2html
    <oui-form-field>
        <oui-select
          placeholder="Choose one"
          [formControl]="selected"
          [errorStateMatcher]="matcher"
        >
          <oui-option>Clear</oui-option>
          <oui-option value="valid">Valid option</oui-option>
          <oui-option value="invalid">Invalid option</oui-option>
        </oui-select>
        <oui-error *ngIf="selected.hasError('required')"
          >You must make a selection
        </oui-error>
        <oui-error
          *ngIf="selected.hasError('pattern') && !selected.hasError('required')"
        >
          Your selection is invalid
        </oui-error>
      </oui-form-field>
```

A global error state matcher can be specified by setting the ErrorStateMatcher provider. This applies to all inputs. For convenience, ShowOnDirtyErrorStateMatcher is available in order to globally cause input errors to show when the input is dirty and invalid.

```
@NgModule({
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]
})
```

## Keyboard interaction

- DOWN_ARROW: Focus next option
- UP_ARROW: Focus previous option
- ENTER or SPACE: Select focused item

# Accessibility

The `<oui-select>` component without text or label should be given a meaningful label via aria-label or aria-labelledby.

The `<oui-select>` component has role="listbox" and options inside select have role="option".

---

# API

```
import {OuiSelectModule} from '@oncehub/ui';
```

## Directives

**OuiSelectTrigger**
Allows the user to customize the trigger that is displayed when the select has a value.

Selector: oui-select-trigger

**OuiSelect**
Selector: oui-select
Exported as: ouiSelect

## Pipes

**filterOptions**
This allows to filter the select box options

Selector: filterOptions

**How to use?**

```
  *ngFor="let bank of (banks | filterOptions: test:'name')"

  Param 1: The keyword
  Param 2: The field name
```

## Component

**oui-select-search**

This component can be used if someone want to have the search input field inside the select box.

```angular2html
  <oui-select-search [(ngModel)]="test"></oui-select-search>
```

## Properties

| Name                                                         | Description                                                                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| @Input('aria-label') ariaLabel: string                       | Aria label of the select. If not specified, the placeholder will be used as label.                                           |
| @Input('aria-labelledby') ariaLabelledby: string             | Input that can be used to specify the aria-labelledby attribute.                                                             |
| @Input() disabled: boolean                                   | Whether the component is disabled.                                                                                           |
| @Input() errorStateMatcher: ErrorStateMatcher                | Object used to control when error messages are shown.                                                                        |
| @Input() id: string                                          | Unique id of the element.                                                                                                    |
| @Input() multiple: boolean                                   | Whether the user should be allowed to select multiple options.                                                               |
| @Input() panelClass: string                                  | Classes to be passed to the select panel. Supports the same syntax as ngClass.                                               |
| @Input() placeholder: string                                 | Placeholder to be shown if no value has been selected.                                                                       |
| @Input() required: boolean                                   | Whether the component is required.                                                                                           |
| @Input() value: any                                          | Value of the select control.                                                                                                 |
| @Input() large: boolean                                      | Set max height of oui-select to 392px. Default is 272px.                                                                     |
| @Output() openedChange: EventEmitter`<boolean>`              | Event emitted when the select panel has been toggled.                                                                        |
| @Output() selectionChange: EventEmitter`<OuiSelectChange>`   | Event emitted when the selected value has been changed by the user.                                                          |
| autofilled: boolean                                          | Whether the input is currently in an autofilled state. If property is not present on the control it is assumed to be false.  |
| controlType: 'oui-select'                                    | A name for this control that can be used by oui-form-field.                                                                  |
| empty: boolean                                               | Whether the select has a value.                                                                                              |
| errorState: boolean                                          | Whether the control is in an error state.                                                                                    |
| focused: boolean                                             | Whether the select is focused.                                                                                               |
| optionGroups: QueryList<OuiOptgroup>                         | All of the defined groups of options.                                                                                        |
| optionSelectionChanges: Observable<OuiOptionSelectionChange> | Combined stream of all of the child options' change events.                                                                  |
| options: QueryList<OuiOption>                                | All of the defined select options.                                                                                           |
| overlayDir: CdkConnectedOverlay                              | Overlay pane containing the options.                                                                                         |
| panel: ElementRef                                            | Panel containing the select options.                                                                                         |
| panelOpen: boolean                                           | Whether or not the overlay panel is open.                                                                                    |
| selected: OuiOption                                          | OuiOption[]                                                                                                                  | The currently selected option. |
| stateChanges: Observable`<void>`                             | Stream that emits whenever the state of the control changes such that the parent OuiFormField needs to run change detection. |
| trigger: ElementRef                                          | Trigger that opens the select.                                                                                               |
| triggerValue: string                                         | The value displayed in the trigger.                                                                                          |

## Methods

| Name   | Description                                            |
| ------ | ------------------------------------------------------ |
| close  | Closes the overlay panel and focuses the host element. |
| open   | Opens the overlay panel.                               |
| toggle | Toggles the overlay panel open or closed.              |

## Stackblitz demo link

You can see the [https://stackblitz.com/edit/oui-select-box](https://stackblitz.com/edit/oui-select-box) demo for more details.
