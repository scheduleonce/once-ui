# Angular app-drop-down

# Table of contents

* [Features](#features)
* [Getting started](#getting-started)
* [API](#api)
* [Examples](#examples)
  * [Basic example](#basic-example)

## Features

* [x] Custom model bindings to property or object
* [x] Custom options, default option (label)
* [x] Scrollbar after a fixed height
* [x] Flexible client side search
* [x] Custom options with image
* [x] Group dropdown options

## Getting started

`app-drop-down` is in `/share/ui/drop-down`.

````
you need to import our `app-drop-down` in `shared.module.ts` module:
```js
import {DropDownComponent} from './ui/drop-down/drop-down.component';
````

The only remaining part is to list the imported module in your application module.:

```js
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropDownComponent } from './ui/drop-down/drop-down.component';

const COMPONENTS = [DropDownComponent];
@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedModule {}
```

## API

| Input            | Type            | Default                 | Required | Description                                                                                         |
| ---------------- | --------------- | ----------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| [options]        | Array<NgOption> | `[]`                    | yes      | Options array                                                                                       |
| [default]        | Object          | `{text: '', value: ''}` | no       | Object property to use for label. Default `label`                                                   |
| [allowSearch]    | boolean         | `false`                 | no       | Allow to search value. Default `false`                                                              |
| [errorCondition] | boolean         | `false`                 | no       | If form control and there is any error, the drop down is sorrounded by error class. Default `false` |
| [key]            | string          | `text`                  | no       | Key to search in option. It's the value/text of dropdown Default key is `text`                      |
| [customClick]    | Function        | `false`                 | no       | Allow to create custom click function that is invoked onChange event of drop down.                  |

| Output    | Description                              |
| --------- | ---------------------------------------- |
| value     | Value is `-1`, it becomes group heading  |
| imageLink | imageLink is provided, the images appear |

## Examples

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
    }
  ];
  selectedLocaleName = {
    text: `MBPLabel`,
    value: '1'
  };
}
```
