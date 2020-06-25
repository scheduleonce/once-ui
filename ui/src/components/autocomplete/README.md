The autocomplete is a normal text input enhanced by a panel of suggested options.

### Simple autocomplete

Start by adding a regular `ouiInput` to your template. Let's assume you're using the `formControl`
directive from `ReactiveFormsModule` to track the value of the input.

_my-comp.html_

```html
<oui-form-field>
  <input type="text" ouiInput [formControl]="myControl" />
</oui-form-field>
```

Next, create the autocomplete panel and the options displayed inside it. Each option should be
defined by a `oui-option` tag. Set each option's value property to whatever you'd like the value
of the text input to be upon that option's selection.

_my-comp.html_

```html
<oui-autocomplete>
  <oui-option *ngFor="let option of options" [value]="option">
    {{ option }}
  </oui-option>
</oui-autocomplete>
```

Now we'll need to link the text input to its panel. We can do this by exporting the autocomplete
panel instance into a local template variable (here we called it "auto"), and binding that variable
to the input's `ouiAutocomplete` property.

_my-comp.html_

```html
<oui-form-field>
  <input
    type="text"
    ouiInput
    [formControl]="myControl"
    [ouiAutocomplete]="auto"
  />
</oui-form-field>

<oui-autocomplete #auto="ouiAutocomplete">
  <oui-option *ngFor="let option of options" [value]="option"
    >{{option}}</oui-option
  >
</oui-autocomplete>
```

### Automatically highlighting the first option

If your use case requires for the first autocomplete option to be highlighted when the user opens
the panel, you can do so by setting the `autoActiveFirstOption` input on the `oui-autocomplete`
component.

<!-- example(autocomplete-auto-active-first-option) -->

### Attaching the autocomplete panel to a different element

By default the autocomplete panel will be attached to your input element, however in some cases you
may want it to attach to a different container element. You can change the element that the
autocomplete is attached to using the `ouiAutocompleteOrigin` directive together with the
`ouiAutocompleteConnectedTo` input:

```html
<div
  class="custom-wrapper-example"
  ouiAutocompleteOrigin
  #origin="ouiAutocompleteOrigin"
>
  <input
    ouiInput
    [formControl]="myControl"
    [ouiAutocomplete]="auto"
    [ouiAutocompleteConnectedTo]="origin"
  />
</div>

<oui-autocomplete #auto="ouiAutocomplete">
  <oui-option *ngFor="let option of options" [value]="option"
    >{{option}}</oui-option
  >
</oui-autocomplete>
```

### Keyboard interaction

- <kbd>DOWN_ARROW</kbd>: Next option becomes active.
- <kbd>UP_ARROW</kbd>: Previous option becomes active.
- <kbd>ENTER</kbd>: Select currently active item.

## Directives

### `OuiAutocomplete`

Selector: `oui-autocomplete`

Exported as: `ouiAutocomplete`

## Properties

| Name                                                                        | Description                                                                                                                                  |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| @Input() <br/>`autoActiveFirstOption: boolean`                              | Whether the first option should be highlighted when the autocomplete panel is opened.                                                        |
| @Input('class') <br/>`classList: string`                                    | Takes classes set on the host oui-autocomplete element and applies them to the panel inside the overlay container to allow for easy styling. |
| @Input() <br/>`displayWith: ((value: any) => string) | null`                | Function that maps an option's control value to its display value in the trigger.                                                            |
| @Input() <br/>`panelWidth: string | number`                                 | Used to set the aria-label attribute on the underlying element.                                                                              |
| @Output() <br/>`closed: EventEmitter<void>`                                 | Event that is emitted when the autocomplete panel is closed.                                                                                 |
| @Output() <br/>`opened: EventEmitter<void>`                                 | Event that is emitted when the autocomplete panel is opened.                                                                                 |
| @Output() <br/>`optionSelected: EventEmitter<OuiAutocompleteSelectedEvent>` | Event that is emitted whenever an option from the list is selected.                                                                          |

### `OuiAutocompleteTrigger`

Selector: `input[ouiAutocomplete]` `textarea[ouiAutocomplete]`

Exported as: ouiAutocompleteTrigger

## Properties

| Name                                                                           | Description                                                                                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| @Input('ouiAutocomplete') <br/>`autocomplete: OuiAutocomplete`                 | The autocomplete panel to be attached to this trigger.                                                                                     |
| @Input('ouiAutocompleteDisabled') <br/>`autocompleteDisabled: boolean`         | Whether the autocomplete is disabled. When disabled, the element will act as a regular input and the user won't be able to open the panel. |
| @Input('ouiAutocompleteConnectedTo') <br/>`connectedTo: OuiAutocompleteOrigin` | Reference relative to which to position the autocomplete panel. Defaults to the autocomplete trigger element.                              |

### Accessibility

The input for an `autocomplete` without text or labels should be given a meaningful label via `aria-label` or `aria-labelledby`.

The autocomplete trigger is given `role="combobox"`. The trigger sets `aria-owns` to the autocomplete's id, and sets `aria-activedescendant` to the active option's id.

### Stackblitz demo link

https://stackblitz.com/edit/oui-autocomplete
