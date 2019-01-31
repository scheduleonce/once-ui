The datepicker allows users to enter a date either through text input, or by choosing a date from
the calendar. It is made up of several components and directives that work together.

<!-- example(datepicker-overview) -->

## API OuiDatepicker

| Input                                             | Type     | Default | Description                                                                            |
| ------------------------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------- |
| id                                                | string   | null    | The id for the datepicker calendar.                                                    |
| color                                             | string   | primary | Theme color palette for the component                                                  |
| dateClass: (date: D) => OuiCalendarCellCssClasses | function | null    | Function that can be used to add custom CSS classes to dates.                          |
| disabled                                          | boolean  | false   | Whether the datepicker pop-up should be disabled.                                      |
| opened                                            | boolean  | false   | Whether the calendar is open.                                                          |
| panelClass                                        | string   | null    | A unique id for the slide-toggle input. If none is supplied, it will be auto-generated |
| startAt                                           | Date     | null    | The date to open the calendar to initially.                                            |
| startView                                         | 'month'  | 'year'  | 'multi-year'                                                                           | 'month' | The view that the calendar should start in. |

| Output        | Type               | Description                                                                              |
| ------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| closed        | EventEmitter<void> | Emits when the datepicker has been closed.                                               |
| monthSelected | EventEmitter<Date> | Emits selected month in year view. This doesn't imply a change on the selected date.     |
| opened        | EventEmitter<void> | Emits when the datepicker has been opened.                                               |
| yearSelected  | EventEmitter<Date> | Emits selected year in multiyear view. This doesn't imply a change on the selected date. |

| Method       | Description         |
| ------------ | ------------------- |
| close        | Close the calendar. |
| open         | Open the calendar.  |
| select(Date) | Select the Date.    |

## Type aliases

### OuiCalendarCellCssClasses

Extra CSS classes that can be associated with a calendar cell.

```
type OuiCalendarCellCssClasses = string | string[] | Set<string> | {
    [key: string]: any;
};
```

## API OuiDatepickerInput

| Input                                     | Type          | Default | Description                                                          |
| ----------------------------------------- | ------------- | ------- | -------------------------------------------------------------------- |
| disabled                                  | boolean       | false   | Whether the datepicker-input is disabled.                            |
| OuiDatepicker                             | OuiDatepicker | null    | The datepicker that this input is associated with.                   |
| OuiDatepickerFilter: (date: D) => boolean | function      | null    | Function that can be used to filter out dates within the datepicker. |
| max                                       | Date          | null    | The maximum valid date.                                              |
| min                                       | Date          | null    | The minimum valid date.                                              |
| value                                     | Date          | null    | The value of the input.                                              |

| Output     | Type                                        | Description                                           |
| ---------- | ------------------------------------------- | ----------------------------------------------------- |
| dateChange | EventEmitter<OuiDatepickerInputEvent<Date>> | Emits when a change event is fired on this `<input>`. |
| dateInput  | EventEmitter<OuiDatepickerInputEvent<Date>> | Emits when an input event is fired on this `<input>`. |

| Method                    | ReturnType | Description                                                        |
| ------------------------- | ---------- | ------------------------------------------------------------------ |
| getConnectedOverlayOrigin | ElementRef | Gets the element that the datepicker popup should be connected to. |

## Classes

### OuiDatepickerInputEvent

| Name          | Type               | Description                                                                 |
| ------------- | ------------------ | --------------------------------------------------------------------------- |
| target        | OuiDatepickerInput | Reference to the datepicker input component that emitted the event.         |
| targetElement | HTMLElement        | Reference to the native input element associated with the datepicker input. |
| value         | Date               | The new value for the target datepicker input.                              |

## API OuiDatepickerToggle

| Input    | Type          | Default | Description                                      |
| -------- | ------------- | ------- | ------------------------------------------------ |
| for      | OuiDatepicker | null    | Datepicker instance that the button will toggle. |
| disabled | boolean       | false   | Whether the toggle button is disabled.           |

### Connecting a datepicker to an input

A datepicker is composed of a text input and a calendar pop-up, connected via the `ouiDatepicker`
property on the text input.

```html
<input [ouiDatepicker]="myDatepicker" />
<oui-datepicker #myDatepicker></oui-datepicker>
```

An optional datepicker toggle button is available. A toggle can be added to the example above:

```html
<input [ouiDatepicker]="myDatepicker" />
<oui-datepicker-toggle [for]="myDatepicker"></oui-datepicker-toggle>
<oui-datepicker #myDatepicker></oui-datepicker>
```

This works exactly the same with an input that is part of an `<oui-form-field>` and the toggle
can easily be used as a prefix or suffix on the material input:

```html
<oui-form-field>
  <input ouiInput [ouiDatepicker]="myDatepicker" />
  <oui-datepicker-toggle ouiSuffix [for]="myDatepicker"></oui-datepicker-toggle>
  <oui-datepicker #myDatepicker></oui-datepicker>
</oui-form-field>
```

If you want to customize the icon that is rendered inside the `oui-datepicker-toggle`, you can do so
by using the `ouiDatepickerToggleIcon` directive:

<!-- example(datepicker-custom-icon) -->

### Setting the calendar starting view

The `startView` property of `<oui-datepicker>` can be used to set the view that will show up when
the calendar first opens. It can be set to `month`, `year`, or `multi-year`; by default it will open
to month view.

The month, year, or range of years that the calendar opens to is determined by first checking if any
date is currently selected, if so it will open to the month or year containing that date. Otherwise
it will open to the month or year containing today's date. This behavior can be overridden by using
the `startAt` property of `<oui-datepicker>`. In this case the calendar will open to the month or
year containing the `startAt` date.

<!-- example(datepicker-start-view) -->

#### Watching the views for changes on selected years and months

When a year or a month is selected in `multi-year` and `year` views respectively, the `yearSelected`
and `monthSelected` outputs emit a normalized date representing the chosen year or month. By
"normalized" we mean that the dates representing years will have their month set to January and
their day set to the 1st. Dates representing months will have their day set to the 1st of the
month. For example, if `<oui-datepicker>` is configured to work with javascript native Date
objects, the `yearSelected` will emit `new Date(2017, 0, 1)` if the user selects 2017 in
`multi-year` view. Similarly, `monthSelected` will emit `new Date(2017, 1, 1)` if the user
selects **February** in `year` view and the current date value of the connected `<input>` was
set to something like `new Date(2017, MM, dd)` when the calendar was opened (the month and day are
irrelevant in this case).

Notice that the emitted value does not affect the current value in the connected `<input>`, which
is only bound to the selection made in the `month` view. So if the end user closes the calendar
after choosing a year in `multi-view` mode (by pressing the `ESC` key, for example), the selected
year, emitted by `yearSelected` output, will not cause any change in the value of the date in the
associated `<input>`.

The following example uses `yearSelected` and `monthSelected` outputs to emulate a month and year
picker (if you're not familiar with the usage of `MomentDateAdapter` and `OUI_DATE_FORMATS`
you can [read more about them](#choosing-a-date-implementation-and-date-foroui-settings) below in
this document to fully understand the example).

<!-- example(datepicker-views-selection) -->

### Setting the selected date

The type of values that the datepicker expects depends on the type of `DateAdapter` provided in your
application. The `NativeDateAdapter`, for example, works directly with plain JavaScript `Date`
objects. When using the `MomentDateAdapter`, however, the values will all be Moment.js instances.
This use of the adapter pattern allows the datepicker component to work with any arbitrary date
representation with a custom `DateAdapter`.
See [_Choosing a date implementation_](#choosing-a-date-implementation-and-date-foroui-settings)
for more information.

Depending on the `DateAdapter` being used, the datepicker may automatically deserialize certain date
formats for you as well. For example, both the `NativeDateAdapter` and `MomentDateAdapter` allow
[ISO 8601](https://tools.ietf.org/html/rfc3339) strings to be passed to the datepicker and
automatically converted to the proper object type. This can be convenient when binding data directly
from your backend to the datepicker. However, the datepicker will not accept date strings formatted
in user format such as `"1/2/2017"` as this is ambiguous and will mean different things depending on
the locale of the browser running the code.

As with other types of `<input>`, the datepicker works with `@angular/forms` directives such as
`formGroup`, `formControl`, `ngModel`, etc.

<!-- example(datepicker-value) -->

### Changing the datepicker colors

The datepicker popup will automatically inherit the color palette (`primary`, `accent`, or `warn`)
from the `oui-form-field` it is attached to. If you would like to specify a different palette for
the popup you can do so by setting the `color` property on `oui-datepicker`.

<!-- example(datepicker-color) -->

### Date validation

There are three properties that add date validation to the datepicker input. The first two are the
`min` and `max` properties. In addition to enforcing validation on the input, these properties will
disable all dates on the calendar popup before or after the respective values and prevent the user
from advancing the calendar past the `month` or `year` (depending on current view) containing the
`min` or `max` date.

<!-- example(datepicker-min-max) -->

The second way to add date validation is using the `ouiDatepickerFilter` property of the datepicker
input. This property accepts a function of `<D> => boolean` (where `<D>` is the date type used by
the datepicker, see
[_Choosing a date implementation_](#choosing-a-date-implementation-and-date-foroui-settings)).
A result of `true` indicates that the date is valid and a result of `false` indicates that it is
not. Again this will also disable the dates on the calendar that are invalid. However, one important
difference between using `ouiDatepickerFilter` vs using `min` or `max` is that filtering out all
dates before or after a certain point, will not prevent the user from advancing the calendar past
that point.

<!-- example(datepicker-filter) -->

In this example the user can back past 2005, but all of the dates before then will be unselectable.
They will not be able to go further back in the calendar than 2000. If they manually type in a date
that is before the min, after the max, or filtered out, the input will have validation errors.

Each validation property has a different error that can be checked:

- A value that violates the `min` property will have a `ouiDatepickerMin` error.
- A value that violates the `max` property will have a `ouiDatepickerMax` error.
- A value that violates the `ouiDatepickerFilter` property will have a `ouiDatepickerFilter` error.

### Input and change events

The input's native `(input)` and `(change)` events will only trigger due to user interaction with
the input element; they will not fire when the user selects a date from the calendar popup.
Therefore, the datepicker input also has support for `(dateInput)` and `(dateChange)` events. These
trigger when the user interacts with either the input or the popup.

The `(dateInput)` event will fire whenever the value changes due to the user typing or selecting a
date from the calendar. The `(dateChange)` event will fire whenever the user finishes typing input
(on `<input>` blur), or when the user chooses a date from the calendar.

<!-- example(datepicker-events) -->

### Disabling parts of the datepicker

As with any standard `<input>`, it is possible to disable the datepicker input by adding the
`disabled` property. By default, the `<oui-datepicker>` and `<oui-datepicker-toggle>` will inherit
their disabled state from the `<input>`, but this can be overridden by setting the `disabled`
property on the datepicker or toggle elements. This can be useful if you want to disable text input
but allow selection via the calendar or vice-versa.

### Manually opening and closing the calendar

The calendar popup can be programmatically controlled using the `open` and `close` methods on the
`<oui-datepicker>`. It also has an `opened` property that reflects the status of the popup.

#### Customizing the calendar header

The header section of the calendar (the part containing the view switcher and previous and next
buttons) can be replaced with a custom component if desired. This is accomplished using the
`calendarHeaderComponent` property of `<oui-datepicker>`. It takes a component class and constructs
an instance of the component to use as the header.

In order to interact with the calendar in your custom header component, you can inject the parent
`MatCalendar` in the constructor. To make sure your header stays in sync with the calendar,
subscribe to the `stateChanges` observable of the calendar and mark your header component for change
detection.

<!-- example(datepicker-custom-header) -->

#### Localizing labels and messages

The various text strings used by the datepicker are provided through `OuiDatepickerIntl`.
Localization of these messages can be done by providing a subclass with translated values in your
application root module.

```ts
@NgModule({
  imports: [OuiDatepickerModule, OuiNativeDateModule],
  providers: [{ provide: OuiDatepickerIntl, useClass: MyIntl }]
})
export class MyApp {}
```

#### Highlighting specific dates

If you want to apply one or more CSS classes to some dates in the calendar (e.g. to highlight a
holiday), you can do so with the `dateClass` input. It accepts a function which will be called
with each of the dates in the calendar and will apply any classes that are returned. The return
value can be anything that is accepted by `ngClass`.

<!-- example(datepicker-date-class) -->

### Accessibility

The `OuiDatepickerInput` and `OuiDatepickerToggle` directives add the `aria-haspopup` attribute to
the native input and toggle button elements respectively, and they trigger a calendar dialog with
`role="dialog"`.

`OuiDatepickerIntl` includes strings that are used for `aria-label`s. The datepicker input
should have a placeholder or be given a meaningful label via `aria-label`, `aria-labelledby` or
`OuiDatepickerIntl`.

#### Keyboard shortcuts

The datepicker supports the following keyboard shortcuts:

| Shortcut             | Action                    |
| -------------------- | ------------------------- |
| `ALT` + `DOWN_ARROW` | Open the calendar pop-up  |
| `ESCAPE`             | Close the calendar pop-up |

In month view:

| Shortcut            | Action                                   |
| ------------------- | ---------------------------------------- |
| `LEFT_ARROW`        | Go to previous day                       |
| `RIGHT_ARROW`       | Go to next day                           |
| `UP_ARROW`          | Go to same day in the previous week      |
| `DOWN_ARROW`        | Go to same day in the next week          |
| `HOME`              | Go to the first day of the month         |
| `END`               | Go to the last day of the month          |
| `PAGE_UP`           | Go to the same day in the previous month |
| `ALT` + `PAGE_UP`   | Go to the same day in the previous year  |
| `PAGE_DOWN`         | Go to the same day in the next month     |
| `ALT` + `PAGE_DOWN` | Go to the same day in the next year      |
| `ENTER`             | Select current date                      |

In year view:

| Shortcut            | Action                                    |
| ------------------- | ----------------------------------------- |
| `LEFT_ARROW`        | Go to previous month                      |
| `RIGHT_ARROW`       | Go to next month                          |
| `UP_ARROW`          | Go up a row (back 4 months)               |
| `DOWN_ARROW`        | Go down a row (forward 4 months)          |
| `HOME`              | Go to the first month of the year         |
| `END`               | Go to the last month of the year          |
| `PAGE_UP`           | Go to the same month in the previous year |
| `ALT` + `PAGE_UP`   | Go to the same month 10 years back        |
| `PAGE_DOWN`         | Go to the same month in the next year     |
| `ALT` + `PAGE_DOWN` | Go to the same month 10 years forward     |
| `ENTER`             | Select current month                      |

In multi-year view:

| Shortcut            | Action                                    |
| ------------------- | ----------------------------------------- |
| `LEFT_ARROW`        | Go to previous year                       |
| `RIGHT_ARROW`       | Go to next year                           |
| `UP_ARROW`          | Go up a row (back 4 years)                |
| `DOWN_ARROW`        | Go down a row (forward 4 years)           |
| `HOME`              | Go to the first year in the current range |
| `END`               | Go to the last year in the current range  |
| `PAGE_UP`           | Go back 24 years                          |
| `ALT` + `PAGE_UP`   | Go back 240 years                         |
| `PAGE_DOWN`         | Go forward 24 years                       |
| `ALT` + `PAGE_DOWN` | Go forward 240 years                      |
| `ENTER`             | Select current year                       |

### Troubleshooting

#### Error: OuiDatepicker: No provider found for DateAdapter/OUI_DATE_FORMATS

This error is thrown if you have not provided all of the injectables the datepicker needs to work.
The easiest way to resolve this is to import the `OuiNativeDateModule` or `MatMomentDateModule` in
your application's root module. See
[_Choosing a date implementation_](#choosing-a-date-implementation-and-date-foroui-settings)) for
more information.

#### Error: A OuiDatepicker can only be associated with a single input

This error is thrown if more than one `<input>` tries to claim ownership over the same
`<oui-datepicker>` (via the `ouiDatepicker` attribute on the input). A datepicker can only be
associated with a single input.

#### Error: Attempted to open an OuiDatepicker with no associated input.

This error occurs if your `<oui-datepicker>` is not associated with any `<input>`. To associate an
input with your datepicker, create a template reference for the datepicker and assign it to the
`ouiDatepicker` attribute on the input:

```html
<input [ouiDatepicker]="picker" /> <oui-datepicker #picker></oui-datepicker>
```
