# Datepicker

The datepicker allows users to enter a date through choosing a date from the calendar. This component is using material datepicker API.

## Usage

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

## API

| Input     | TypeOf      | Default | Required | Description                                                                                 |
| --------- | ----------- | ------- | -------- | ------------------------------------------------------------------------------------------- |
| [model]   | FormControl | none    | yes      | This binds to value of datepicker                                                           |
| [maxDate] | Moment/Date | none    | no       | This will disable selecting date greater than maxDate. Default no validation will be there. |  |
| [minDate] | Moment/Date | none    | no       | This will disable selecting date lesser than minDate. Default no validation will be there.  |  |

| Output          | Description                 |
| --------------- | --------------------------- |
| dateChangeEvent | Fires when date got changed |
