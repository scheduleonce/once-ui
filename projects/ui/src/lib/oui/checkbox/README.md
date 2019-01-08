## Overview

## oui-checkbox

`<oui-checkbox>` provides the same functionality as a native `<input type="checkbox">`.

## Checkbox label

The checkbox label is provided as the content to the `<oui-checkbox>` element. The label can be positioned before or after the checkbox by setting the labelPosition property to `before` or `after`.

If you don't want the label to appear next to the checkbox, you can use `aria-label` or `aria-labelledby` to specify an appropriate label.

## Use with @angular/forms

`<oui-checkbox>` is compatible with @angular/forms and supports both FormsModule and ReactiveFormsModule.

## Accessibility

The <oui-checkbox> uses an internal <input type="checkbox"> to provide an accessible experience. This internal checkbox receives focus and is automatically labelled by the text content of the <oui-checkbox> element.

Checkboxes without text or labels should be given a meaningful label via aria-label or aria-labelledby.

# API

```
import {OuiCheckboxModule} from '@once/ui';
```

## Directives

### OuiCheckbox

It supports all of the functionality of an HTML5 checkbox, and exposes a similar API. A OuiCheckbox can be either checked, unchecked or disabled. Note that all additional accessibility attributes are taken care of by the component, so there is no need to provide them yourself. However, if you want to omit a label and still have the checkbox be accessible, you may supply an [aria-label] input.

Selector: `oui-checkbox`

Exported as: `ouiCheckbox`

**Properties**
<br/>

| Name                                                     | Description                                                                         |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| @Input() <br/>`aria-label:String`                        | Used to set the aria-label attribute on the underlying element.                     |
| @Input() <br/>`aria-labelledby: String`                  | Used to set the aria-labelledby attribute on the underlying element.                |
| @Input() <br/>`checked: boolean`                         | Whether the checkbox is checked.                                                    |
| @Input() <br/>`disabled: any`                            | Whether the checkbox is disabled.                                                   |
| @Input() <br/>`id: string`                               | A unique id for the checkbox input. If none is supplied, it will be auto-generated. |
| @Input() <br/>`labelPosition: 'before' OR 'after'`       | Whether the label should appear after or before the checkbox. Defaults to 'after'.  |
| @Input() <br/>`name: string OR null`                     | Name value will be applied to the input element if present.                         |
| @Input() <br/>`required: boolean`                        | Whether the checkbox is required.                                                   |
| @Input() <br/>`value: string`                            | The value attribute of the native input element.                                    |
| @Output() <br/>`change: EventEmitter<OuiCheckboxChange>` | Event emitted when the checkbox's checked value changes.                            |

**Method**
<br/>

| Name   | Description                                |
| ------ | ------------------------------------------ |
| focus  | Focuses the checkbox.                      |
| toggle | Toggles the checked state of the checkbox. |

## Examples

```
<oui-checkbox
    class="example-margin"
    [(ngModel)]="checked"
    [labelPosition]="labelPosition"
    [disabled]="disabled">
    I'm a checkbox
</oui-checkbox>
```

## Stackblitz demo link

[https://stackblitz.com/edit/oui-checkbox-component](https://stackblitz.com/edit/oui-checkbox-component)

You can click here and can change code to try and test different scenarios.
