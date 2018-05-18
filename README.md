# Library of UI components

Various UI components that we are using at Oncehub.

### Features:
- No external dependencies (easy to use!),
- Minimal styling (easy to customize!),
- Great performance.

For demos, see the [project page](https://once-ui.azurewebsites.net).

### Available components:

- [Content popup](lib/content-popup/README.md)
- [Datepicker](lib/datepicker/README.md)
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
