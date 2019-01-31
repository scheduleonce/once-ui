# Overview

`<oui-select>` is a form control for selecting a value from a set of options, similar to the native `<select>` element. It is designed to work inside of a `<oui-form-field>` element.

To add options to the select, add <oui-option> elements to the `<oui-select>`. Each `<oui-option>` has a value property that can be used to set the value that will be selected if the user chooses this option. The content of the `<oui-option>` is what will be shown to the user.

Once-ui also supports use of the native `<select>` element inside of `<oui-form-field>`. The native control has several performance, accessibility, and usability advantages. See the documentation for form-field for more information.

To use a native select inside`<oui-form-field>`, add the ouiNativeControl attribute to the `<select>` element.

### Basic select

[Oui Basic Select](https://stackblitz.com/edit/oui-select-basic-example)

## Getting and setting the select value

The `<oui-select>` supports 2-way binding to the value property without the need for Angular forms.
[Oui select with 2 way value binding](https://stackblitz.com/edit/oui-select-with-2-way-value-binding)

## Form field features

There are a number of `<oui-form-field>` features that can be used with both `<select>` and `<oui-select>`. These include error messages, hint text, prefix & suffix, and theming.

[Form field features](https://stackblitz.com/edit/oui-form-field-features)

## Disabling the select or individual options

It is possible to disable the entire select or individual options in the select by using the disabled property on the `<select>` or `<oui-select>` and the `<option>` or elements respectively.

[Oui select Disabling the select or individual options](https://stackblitz.com/edit/oui-select-disabling-the-select-or-individual)

## Resetting the select value

If you want one of your options to reset the select's value, you can omit specifying its value.

[Oui select Disabling resetting the select value](https://stackblitz.com/edit/oui-select-disabling-resetting-the-select-value)

## Creating groups of options

The `<oui-optgroup>` element can be used to group common options under a subheading. The name of the group can be set using the label property of `<oui-optgroup>`. Like individual `<oui-option>` elements, an entire `<oui-optgroup>` can be disabled or enabled by setting the disabled property on the group.

[Oui select creating groups of options](https://stackblitz.com/edit/oui-select-creating-groups-of-options)

## Multiple selection

`<oui-select>` defaults to single-selection mode, but can be configured to allow multiple selection by setting the multiple property. This will allow the user to select multiple values at once. When using the `<oui-select>` in multiple selection mode, its value will be a sorted list of all selected values rather than a single value.

Using multiple selection with a native select element (`<select multiple>`) is discouraged inside `<oui-form-field>`, as the inline listbox appearance is inconsistent with other Oui Design components.

[Oui select multiple selection](https://stackblitz.com/edit/oui-select-multiple-selection)

## Customizing the trigger label

If you want to display a custom trigger label inside a `<oui-select>`, you can use the <oui-select-trigger> element.

[Customizing the trigger label](https://stackblitz.com/edit/oui-select-customizing-the-trigger-label)

## Adding custom styles to the dropdown panel

In order to facilitate easily styling the dropdown panel, `<oui-select>` has a panelClass property which can be used to apply additional CSS classes to the dropdown panel.

[Adding custom styles to the dropdown panel](https://stackblitz.com/edit/oui-select-with-custom-panel-styling)

## Changing when error messages are shown

The `<oui-form-field>` allows you to associate error messages with your `<select>` or `<oui-select>`. By default, these error messages are shown when the control is invalid and either the user has interacted with (touched) the element or the parent form has been submitted. If you wish to override this behavior (e.g. to show the error as soon as the invalid control is dirty or when a parent form group is invalid), you can use the errorStateMatcher property of the `<oui-select>`. The property takes an instance of an ErrorStateMatcher object. An ErrorStateMatcher must implement a single method isErrorState which takes the FormControl for this `<oui-select>` as well as the parent form and returns a boolean indicating whether errors should be shown. (true indicating that they should be shown, and false indicating that they should not.)

[Changing when error messages are shown](https://stackblitz.com/edit/oui-changing-when-error-messages-are-shown)

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

The native `<select>` offers the best accessibility because it is supported directly by screen-readers.

---

# API

```
import {OuiSelectModule} from '@once/ui';
```

## Directives

**OuiSelectTrigger**
Allows the user to customize the trigger that is displayed when the select has a value.

Selector: oui-select-trigger

**OuiSelect**
Selector: oui-select
Exported as: ouiSelect

## Properties

| Name                                                         | Description                                                                                                                                                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @Input('aria-label') ariaLabel: string                       | Aria label of the select. If not specified, the placeholder will be used as label.                                                                                                    |
| @Input('aria-labelledby') ariaLabelledby: string             | Input that can be used to specify the aria-labelledby attribute.                                                                                                                      |
| @Input() compareWith: (o1: any, o2: any) => boolean          | Function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection. A boolean should be returned. |
| @Input() disableOptionCentering: boolean                     | Whether to center the active option over the trigger.                                                                                                                                 |
| @Input() disabled: boolean                                   | Whether the component is disabled.                                                                                                                                                    |
| @Input() errorStateMatcher: ErrorStateMatcher                | Object used to control when error messages are shown.                                                                                                                                 |
| @Input() id: string                                          | Unique id of the element.                                                                                                                                                             |
| @Input() multiple: boolean                                   | Whether the user should be allowed to select multiple options.                                                                                                                        |
| @Input() panelClass: string                                  | Classes to be passed to the select panel. Supports the same syntax as ngClass.                                                                                                        |
| @Input() placeholder: string                                 | Placeholder to be shown if no value has been selected.                                                                                                                                |
| @Input() required: boolean                                   | Whether the component is required.                                                                                                                                                    |
| @Input() value: any                                          | Value of the select control.                                                                                                                                                          |
| @Output() openedChange: EventEmitter`<boolean>`                | Event emitted when the select panel has been toggled.                                                                                                                                 |
| @Output() selectionChange: EventEmitter`<OuiSelectChange>`     | Event emitted when the selected value has been changed by the user.                                                                                                                   |
| autofilled: boolean                                          | Whether the input is currently in an autofilled state. If property is not present on the control it is assumed to be false.                                                           |
| controlType: 'oui-select'                                    | A name for this control that can be used by oui-form-field.                                                                                                                           |
| empty: boolean                                               | Whether the select has a value.                                                                                                                                                       |
| errorState: boolean                                          | Whether the control is in an error state.                                                                                                                                             |
| focused: boolean                                             | Whether the select is focused.                                                                                                                                                        |
| optionGroups: QueryList<OuiOptgroup>                         | All of the defined groups of options.                                                                                                                                                 |
| optionSelectionChanges: Observable<OuiOptionSelectionChange> | Combined stream of all of the child options' change events.                                                                                                                           |
| options: QueryList<OuiOption>                                | All of the defined select options.                                                                                                                                                    |
| overlayDir: CdkConnectedOverlay                              | Overlay pane containing the options.                                                                                                                                                  |
| panel: ElementRef                                            | Panel containing the select options.                                                                                                                                                  |
| panelOpen: boolean                                           | Whether or not the overlay panel is open.                                                                                                                                             |
| selected: OuiOption                                          | OuiOption[]                                                                                                                                                                           | The currently selected option. |
| stateChanges: Observable`<void>`                               | Stream that emits whenever the state of the control changes such that the parent OuiFormField needs to run change detection.                                                          |
| trigger: ElementRef                                          | Trigger that opens the select.                                                                                                                                                        |
| triggerValue: string                                         | The value displayed in the trigger.                                                                                                                                                   |

## Methods

| Name   | Description                                            |
| ------ | ------------------------------------------------------ |
| close  | Closes the overlay panel and focuses the host element. |
| open   | Opens the overlay panel.                               |
| toggle | Toggles the overlay panel open or closed.              |

## Constants

**SELECT_PANEL_MAX_HEIGHT**

The max height of the select's overlay panel

```
const SELECT_PANEL_MAX_HEIGHT: 256;
```

**SELECT_PANEL_PADDING_X**

The panel's padding on the x-axis

```
const SELECT_PANEL_PADDING_X: 16;
```

**SELECT_PANEL_INDENT_PADDING_X**

The panel's x axis padding if it is indented (e.g. there is an option group).

```
const SELECT_PANEL_INDENT_PADDING_X: number;
```

**SELECT_ITEM_HEIGHT_EM**
The height of the select items in em units.

```
const SELECT_ITEM_HEIGHT_EM: 3;
```

**SELECT_MULTIPLE_PANEL_PADDING_X**
Distance between the panel edge and the option text in multi-selection mode.

Calculated as: (SELECT_PANEL_PADDING_X \* 1.5) + 20 = 44 The padding is multiplied by 1.5 because the checkbox's margin is half the padding. The checkbox width is 16px.

```
const SELECT_MULTIPLE_PANEL_PADDING_X: number;
```

**SELECT_PANEL_VIEWPORT_PADDING**

The select panel will only "fit" inside the viewport if it is positioned at this value or more away from the viewport boundary.

```
const SELECT_PANEL_VIEWPORT_PADDING: 8;
```

**OUI_SELECT_SCROLL_STRATEGY**

Injection token that determines the scroll handling while a select is open.

```
const OUI_SELECT_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
```

---

# Examples

- [Oui Basic Select](https://stackblitz.com/edit/oui-select-basic-example)
- [Form field features](https://stackblitz.com/edit/oui-form-field-features)
- [Oui select Disabling the select or individual options](https://stackblitz.com/edit/oui-select-disabling-the-select-or-individual)
- [Oui select Disabling resetting the select value](https://stackblitz.com/edit/oui-select-disabling-resetting-the-select-value)
- [Oui select creating groups of options](https://stackblitz.com/edit/oui-select-creating-groups-of-options)
- [Oui select multiple selection](https://stackblitz.com/edit/oui-select-multiple-selection)
- [Customizing the trigger label](https://stackblitz.com/edit/oui-select-customizing-the-trigger-label)
- [Adding custom styles to the dropdown panel](https://stackblitz.com/edit/oui-select-with-custom-panel-styling)
- [Changing when error messages are shown](https://stackblitz.com/edit/oui-changing-when-error-messages-are-shown)
