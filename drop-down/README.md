# Angular app-drop-down

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
| [default]        | Object          | `{text: '', value: ''}` | no       | Object property to use for label. Default `label`                                                   |
| [allowSearch]    | boolean         | `false`                 | no       | Allow to search value. Default `false`                                                              |
| [showImage]    | boolean         | `false`                 | no       | Show image in dropdown option. Default `false`                                                              |
| [errorCondition] | boolean         | `false`                 | no       | If form control and there is any error, the drop down is sorrounded by error class. Default `false` |
| [key]            | string          | `text`                  | no       | Key to search in option. It's the value/text of dropdown Default key is `text`                      |
| [truncateTextAfter]            | string          | `number`                  | no       | If non 0 then truncate the option value and suffix it with three dots (...)
| [selectedOption]            | string          | `number`                  | no       | If non 0 then makes a particular option selected
| [customClick]    | Function        | `false`                 | no       | Allow to create custom click function that is invoked onChange event of drop down.                  |

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
          <app-drop-down
                [options]="customLanguages"
                [default]="selectedLocaleName"
                [errorCondition]="duplicatedFromNotProvided"
                [key]="'CustomName'"
                [truncateTextAfter]="20"
                (customClick)="customClick($event)">
           </app-drop-down>
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
