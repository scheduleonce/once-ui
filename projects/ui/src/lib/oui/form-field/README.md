`<oui-form-field>` is a component used to wrap several Once UI components and apply common
[Text field](https://ouierial.io/guidelines/components/text-fields.html) styles such as the
underline, floating label, and hint messages.

In this document, "form field" refers to the wrapper component `<oui-form-field>` and
"form field control" refers to the component that the `<oui-form-field>` is wrapping
(e.g. the input, textarea, select, etc.)

The following Once UI components are designed to work inside a `<oui-form-field>`:

- `<input ouiInput>` &amp; `<textarea ouiInput>`

<!-- example(form-field-overview) -->

<!-- example(form-field-appearance) -->

### Example usages

```html
<oui-form-field> <input placeholder="Just a placeholder" /> </oui-form-field>
```

### Accessibility

The user should label the form field control themselves using `aria-label`, `aria-labelledby` or `<label for=...>`.

### Stackblitz demo link

https://stackblitz.com/edit/form-field-component
