`ouiInput` is a directive that allows native `<input>` and `<textarea>` elements to work with
[`<oui-form-field>`](https://material.angular.io/components/form-field/overview).

<!-- example(input-overview) -->

### `<input>` and `<textarea>` attributes

All of the attributes that can be used with normal `<input>` and `<textarea>` elements can be used
on elements inside `<oui-form-field>` as well. This includes Angular directives such as `ngModel`
and `formControl`.

The only limitation is that the `type` attribute can only be one of the values supported by
`ouiInput`.

### Supported `<input>` types

The following [input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) can
be used with `ouiInput`:

- text

### Future supported `<input>` types (Not implemented so far)

This is under development and the following [input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) can
be used with `ouiInput` in future:

- color
- date
- datetime-local
- email
- month
- number
- password
- search
- tel
- time
- url
- week

### Changing when error messages are shown

The `<oui-form-field>` allows you to [associate error messages] with your `ouiInput`. By default, these error messages are shown when the control is invalid and either the user has interacted with (touched) the element or the parent form has been submitted.

## API

Directive that allows a native input to work inside a OuiFormField.

Selector: `input[ouiInput], textarea[ouiInput]`

Exported as: `ouiInput`

| Input | Type   | Default | Required | Description                |
| ----- | ------ | ------- | -------- | -------------------------- |
| type  | string | text    | no       | Input type of the element. |

### Accessibility

The `ouiInput` directive works with native `<input>` to provide an accessible experience.

If the containing <oui-form-field> has a label it will automatically be used as the aria-label for the `<input>`.
However, if there's no label specified in the form field, aria-label, aria-labelledby or <label for=...> should be added.

### Stackblitz demo link

https://stackblitz.com/edit/oui-input-field
