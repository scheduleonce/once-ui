# Library of UI components

Various UI components that we are (or were) using at Scheduleonce/Inviteonce.

### Features:
- No external dependencies (easy to use!),
- Minimal styling (easy to customize!),
- Great performance.

For demos, see the [project page](https://storybooks-coming-soon.com).

### Available components:

- [Content popup](content-popup/README.md)
- [Date picker](date-picker/README.md)
- [Dialog](dialog/README.md)
- [Dropdown](drop-down/README.md)
- [Info-popup](info-popup/README.md)
- [Tooltip](tooltip/README.md)

### Installation

```sh
$ npm i --save @once/ui
```
### How to use?
```sh
import { DropDownModule } from '@once/ui/drop-down';
import { DatepickerModule } from '@once/ui/datepicker';


@NgModule({
  imports: [
    DropDownModule,
    DatepickerModule
  ]
})

```
