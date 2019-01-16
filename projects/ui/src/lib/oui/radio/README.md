`<oui-radio>` provides the same functionality as a native `<input type="radio">` enhanced with
design styling and animations.

All radio-buttons with the same `name` comprise a set from which only one may be selected at a time.

## Getting started

### Usage

```js
import { OuiRadioModule } from '@once/ui';

@NgModule({
  imports: [
    OuiRadioModule
  ]
})
```

## Usage Example

```html
<oui-radio-group [(ngModel)]="gender">
  <oui-radio-button [value]="male"> Male </oui-radio-button>
  <oui-radio-button [value]="female"> Female </oui-radio-button>
</oui-radio-group>
```

## API OuiRadioGroupComponent

| Input         | Type                | Default | Description                                                                                                                                                                                                                                                                                    |
| ------------- | ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disabled      | boolean             | false   | Whether the radio group is disabled                                                                                                                                                                                                                                                            |
| labelPosition | 'before' or 'after' | 'after' | Whether the labels should appear after or before the radio-buttons. Defaults to 'after'                                                                                                                                                                                                        |
| name          | string              | null    | Name of the radio button group. All radio buttons inside this group will use this name.                                                                                                                                                                                                        |
| required      | boolean             | false   | Whether the radio group is required                                                                                                                                                                                                                                                            |
| selected      | OuiRadioButton      | null    | The currently selected radio button. If set to a new radio button, the radio group value will be updated to match the new selected button.                                                                                                                                                     |
| value         | any                 | false   | Value for the radio-group. Should equal the value of the selected radio button if there is a corresponding radio button with a matching value. If there is not such a corresponding radio button, this value persists to be applied in case a new radio button is added with a matching value. |

| Output | Type                          | Description                                                                                                                                                                                |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| change | Event Emitter<OuiRadioChange> | Event emitted when the group value changes. Change events are only emitted when the value changes due to user interaction with a radio button (the same behavior as <input type-"radio">). |

## API OuiRadioButtonComponent

| Input           | Type                | Default | Description                                                                           |
| --------------- | ------------------- | ------- | ------------------------------------------------------------------------------------- |
| ariaDescribedby | string              | null    | The 'aria-describedby' attribute is read after the element's label and field type.    |
| ariaLabel       | string              | null    | Used to set the 'aria-label' attribute on the underlying input element.               |
| ariaLabelledby  | string              | null    | The 'aria-labelledby' attribute takes precedence as the element's text alternative.   |
| checked         | boolean             | false   | Whether this radio button is checked.                                                 |
| disabled        | boolean             | false   | Whether the radio button is disabled.                                                 |
| id              | string              | random  | The unique ID for the radio button.                                                   |
| labelPosition   | 'before' or 'after' | 'after' | Whether the label should appear after or before the radio button. Defaults to 'after' |
| name            | string              | null    | Analog to HTML 'name' attribute used to group radios for unique selection.            |
| required        | boolean             | false   | Whether the radio button is required.                                                 |
| value           | any                 | null    | The value of this radio button.                                                       |
| radioGroup      | OuiRadioGroup       | null    | The parent radio group. May or may not be present.                                    |

| Output | Type                          | Description                                                                                                                                                                                                         |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Event Emitter<OuiRadioChange> | Event emitted when the checked state of this radio button changes. Change events are only emitted when the value changes due to user interaction with the radio button (the same behavior as <input type-"radio">). |

| Method | Description               |
| ------ | ------------------------- |
| focus  | Focuses the radio button. |

## Classes

#### OuiRadioChange

Properties

| Method                 | Description                                     |
| ---------------------- | ----------------------------------------------- |
| source: OuiRadioButton | The OuiRadioButton that emits the change event. |
| value: any             | The value of the OuiRadioButton.                |

### Radio-button label

The radio-button label is provided as the content to the `<oui-radio-button>` element. The label can
be positioned before or after the radio-button by setting the `labelPosition` property to `'before'`
or `'after'`.

If you don't want the label to appear next to the radio-button, you can use
[`aria-label`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-label) or
[`aria-labelledby`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby) to
specify an appropriate label.

### Radio groups

Radio-buttons should typically be placed inside of an `<oui-radio-group>` unless the DOM structure
would make that impossible (e.g., radio-buttons inside of table cells). The radio-group has a
`value` property that reflects the currently selected radio-button inside of the group.

Individual radio-buttons inside of a radio-group will inherit the `name` of the group.

### Use with `@angular/forms`

`<oui-radio-group>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

## Stackblitz demo link

[https://stackblitz.com/edit/oui-radio-button](https://stackblitz.com/edit/oui-radio-button)

You can click here and can change code to try and test different scenarios.

### Accessibility

The `<oui-radio-button>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the
`<oui-radio-button>` element.

Radio button groups should be given a meaningful label via `aria-label` or `aria-labelledby`.
