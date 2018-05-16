# Angular once-ui-dropdown

# Table of contents

* [Features](#features)
* [Getting started](#getting-started)
* [API](#api)
* [Basic example](#basic-example)

## Features

* [x] Custom model bindings to property or object
* [x] Custom options, default option (label)
* [x] Scrollbar after a fixed height
* [x] Flexible client side search
* [x] Custom options with image
* [x] Group dropdown options

## Getting started

```js
import { DropDownModule } from '@once/ui/drop-down';
````

The only remaining part is to list the imported module in your application module.:

```js
import { DropDownModule } from '@once/ui/drop-down';

@NgModule({
  imports: [
    DropDownModule
  ]
})
```

## API

| Input            | Type            | Default                 | Required | Description                                                                                         |
| ---------------- | --------------- | ----------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| [options]        | Array<NgOption> | `[]`                    | yes      | Options array                                                                                       |
| [default]        | Object          | `{text: '', value: ''}` | no       | Object property to use for label. Default `label`.                                                   |
| [allowSearch]    | boolean         | `false`                 | no       | Allow to search value. Default `false`.                                                              |
| [showImage]    | boolean         | `false`                 | no       | Show image in dropdown option. Default `false`.                                                              |
| [errorCondition] | boolean         | `false`                 | no       | If form control and there is any error, the drop down is sorrounded by error class. Default `false`. |
| [key]            | string          | `text`                  | no       | Default key is ‘text’. If the default value is changed other then ‘text’, then we should have that changed value of key in the object as well to get the appropriate dropdown list.                    |
| [truncateTextAfter]            | string          | `number`                  | no       | If non-zero then truncate the option value and suffix it with three dots (...).
| [selectedOption]            | string          | `number`                  | no       | If non-zero then makes a particular option selected.
| [customClick]    | Function        | `false`                 | no       | Allow to create custom click function that is invoked onChange event of drop down.                  |
| [defaultOptionTitle]    | string        | `text`                 | no       | Value to show in dd option if it has no options present or when only fixed text needed to be shown([fixedTitle] should be `true` for this). If attribute is not defined, it will display ‘Please select’ by default.                  |
| [searchPlaceholderText]    | string        | `Search`                 | no       | Placeholder for search input field. Visible, only if [allowSearch] is true.                 |
| [isBorderLess]    | boolean        | `false`                 | no       | Set left/top/right border to none.                  |
| [borderBottomColor]    | string        | `text`                 | no       | Application only if [isBorderLess] is true. It will be displayed on click with 2px border at the bottom.                  |
| [selectedAndDisabledOptions]    | array        |                   | no       | Array of pre-selected and disabled options.                 |
| [fixedTitle]    | boolean        |      `false`             | no       | Set fixed text value passed with `defaultOptionTitle` API in place where selected option is shown, this will be fixed text no matters what user have selected.                   |
| [disabledDropdown]    | boolean        |      `false`             | no       | If true disables dropdown with no actions.                   |

| Output    | Description                              |
| --------- | ---------------------------------------- |
| value     | Value is `-1`, it becomes group heading  |
| imageLink | imageLink is provided, the images appear |


### Basic example

```js
@Component({
  selector: 'app-localization-editor',
  template: `
        <label>Custom locale</label>
          <once-ui-dropdown
                [options]="customLanguages"
                [default]="selectedLocaleName"
                [errorCondition]="duplicatedFromNotProvided"
                [key]="'CustomName'"
                [truncateTextAfter]="20"
                (customClick)="customClick($event)">
           </once-ui-dropdown>
        <p>
            Selected city ID: {{selectedCityId}}
        </p>
    `
})
export class LocalizationEditorComponent {
  customLanguages = [
    {
      text: `Master pages`,
      imageLink: '',
      value: '-1'
    },
    {
      text: `MBPLabel`,
      imageLink: '',
      value: '1'
    },
    {
      text: `MBPRequest`,
      imageLink: 'https://cdnudaan.azureedge.net/images/navigationSprite.png',
      value: '2'
    },
    {
      text: `WithoutE`,
      value: '3'
    },
    {
      text: `WithoutEWithoutEWithoutEWithoutEWithoutEWithoutE`,
      value: '3'
    }
  ];
  selectedLocaleName = {
    text: `MBPLabel`,
    value: '1'
  };
}
```
