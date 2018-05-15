# DATEPICKER

The datepicker allows users to enter a date by choosing a date from the calendar. This component uses material datepicker API.

## USAGE
Firstly, we need to import the datepicker module into the application module.
```js
import { DatepickerModule  } from '@once/ui/datepicker';
```

After importing it into the application module, add it to the imports array.
```js
@NgModule({
  imports: [
    DatepickerModule
  ]
})
````

Example of simple usage:

```html
<app-datepicker [(model)]="formControlObj"></app-datepicker>
```

Example of validation

```html
<app-datepicker
  [(model)]="formControlObj"
  [(maxDate)]="maxStartDate"></app-datepicker>
```

Example of Input and change events

```html
<app-datepicker
  [(model)]="formControlObj"
  [(maxDate)]="maxStartDate"></app-datepicker>
```

## PROPS

| Input     | TypeOf      | Default | Required | Description                                                                                 |
| --------- | ----------- | ------- | -------- | ------------------------------------------------------------------------------------------- |
| [model]   | FormControl | none    | yes      | This binds to value of datepicker                                                           |
| [maxDate] | Moment/Date | none    | no       | This will disable selecting date greater than maxDate. Default no validation will be there. |  |
| [minDate] | Moment/Date | none    | no       | This will disable selecting date lesser than minDate. Default no validation will be there.  |  |
| [isBorderLess] | boolean | false    | false       | Hide top/right/left border  |  |

| Output          | Description                 |
| --------------- | --------------------------- |
| dateChangeEvent | Fires when date got changed |

## BASIC EXAMPLE

```js
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  template: `<app-datepicker 
            [(model)]='selectedDate' 
            [minDate]='minDate' 
            [maxDate]='maxDate'>
            </app-datepicker>`,
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  minDate = moment();
  maxDate = moment().add(1,'month').subtract(1,'day');
  selectedDate = new FormControl(moment());
}
```

