`<oui-progress-spinner>` is a circular indicators of progress and activity.

## Usage

```js
import { OuiProgressSpinnerModule } from '@once/ui';

@NgModule({
  imports: [
    OuiProgressSpinnerModule
  ]
})
```

## Usage Example

```html
<!-- regular progress spinner with determinate mode -->
<oui-progress-spinner mode="determinate"></oui-progress-spinner>

<!-- regular progress spinner with indeterminate mode -->
<oui-progress-spinner mode="indeterminate"></oui-progress-spinner>
```

## API ProgressSpinner

| Input       | Type   | Description                                                          |
| ----------- | ------ | -------------------------------------------------------------------- |
| mode        | string | determinate or indeterminate                                         |
| color       | string | Theme color palette for the component                                |
| size        | number | diameter of the progress spinner (will set width and height of svg). |
| strokeWidth | number | Stroke width of the progress spinner.                                |
| percentage  | number | Value of the progress circle only works with determinate mode.       |

The default mode is "determinate". In this mode, the progress is set via the `percentage` property,
which can be a whole number between 0 and 100 and the default value is 50.

In "indeterminate" mode, the `percentage` property is ignored.

## Stackblitz demo link

[https://stackblitz.com/edit/oncehub-progress-spinner](https://stackblitz.com/edit/oncehub-progress-spinner)

You can click here and can change code to try and test different scenarios.

### Theming

The color of a progress-spinner can be changed by using the `color` property. By default,
progress-spinners use the theme's primary color. This can be changed to `'accent'` or `'warn'`.

### Accessibility

Each progress spinner should be given a meaningful label via `aria-label` or `aria-labelledby`.
