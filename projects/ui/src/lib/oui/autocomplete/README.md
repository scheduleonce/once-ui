The autocomplete is a normal text input enhanced by a panel of suggested options.

### Simple autocomplete

Start by adding a regular `ouiInput` to your template. Let's assume you're using the `formControl`
directive from `ReactiveFormsModule` to track the value of the input.

*my-comp.html*
```html
<oui-form-field>
  <input type="text" ouiInput [formControl]="myControl">
</oui-form-field>
```

Next, create the autocomplete panel and the options displayed inside it. Each option should be
defined by a `oui-option` tag. Set each option's value property to whatever you'd like the value
of the text input to be upon that option's selection.

*my-comp.html*
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

*my-comp.html*
```html
<oui-form-field>
  <input type="text" ouiInput [formControl]="myControl" [ouiAutocomplete]="auto">
</oui-form-field>

<oui-autocomplete #auto="ouiAutocomplete">
  <oui-option *ngFor="let option of options" [value]="option">{{option}}</oui-option>
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
<div class="custom-wrapper-example" ouiAutocompleteOrigin #origin="ouiAutocompleteOrigin">
  <input
    ouiInput
    [formControl]="myControl"
    [ouiAutocomplete]="auto"
    [ouiAutocompleteConnectedTo]="origin">
</div>

<oui-autocomplete #auto="ouiAutocomplete">
  <oui-option *ngFor="let option of options" [value]="option">{{option}}</oui-option>
</oui-autocomplete>
```

### Keyboard interaction
- <kbd>DOWN_ARROW</kbd>: Next option becomes active.
- <kbd>UP_ARROW</kbd>: Previous option becomes active.
- <kbd>ENTER</kbd>: Select currently active item.

### Accessibility

The input for an `autocomplete` without text or labels should be given a meaningful label via `aria-label` or `aria-labelledby`.

The autocomplete trigger is given `role="combobox"`. The trigger sets `aria-owns` to the autocomplete's id, and sets `aria-activedescendant` to the active option's id.
