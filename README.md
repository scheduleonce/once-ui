# Library of UI components

Various UI components that we are (or were) using at Scheduleonce/Inviteonce.

### Features:
- No external dependencies (easy to use!),
- Minimal styling (easy to customize!),
- Great performance.

For demos, see the [project page](https://storybooks-coming-soon.com).

### Available components:

- [Content popup](lib/content-popup/README.md)
- [Date picker](lib/date-picker/README.md)
- [Dialog](lib/dialog/README.md)
- [Dropdown](lib/drop-down/README.md)
- [Info-popup](lib/info-popup/README.md)
- [Tooltip](lib/tooltip/README.md)

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
