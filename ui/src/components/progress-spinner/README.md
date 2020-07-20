`<oui-progress-spinner>` is a circular indicators of progress and activity.

## Usage

```js
import { OuiProgressSpinnerModule } from '@oncehub/ui';

@NgModule({
  imports: [
    OuiProgressSpinnerModule
  ]
})
```

## Usage Example

```html
<!-- regular progress spinner with indeterminate mode -->
<oui-progress-spinner></oui-progress-spinner>

<!-- regular progress spinner with determinate mode -->
<oui-progress-spinner [value]="50"></oui-progress-spinner>
```

## API ProgressSpinner

| Input       | Type   | Description                                                          |
| ----------- | ------ | -------------------------------------------------------------------- |
| color       | string | Theme color palette for the component                                |
| diameter    | number | diameter of the progress spinner (will set width and height of svg). |
| strokeWidth | number | Stroke width of the progress spinner.                                |
| value       | number | Value of the progress circle only works with determinate mode.       |

The default mode is `indeterminate`. If value is passed mode will automatically switch to `determinate` mode. The progress is set via the `value` property, which can be a whole number between 0 and 100.

Default value for "diameter" is 100 and for "StrokeWidth" is 10. You can simply override and give its own values.

## Stackblitz demo link

[https://stackblitz.com/edit/oui-progress-spinner](https://stackblitz.com/edit/oui-progress-spinner)

You can click here and can change code to try and test different scenarios.

### Theming

The color of a progress-spinner can be changed by using the `color` property. By default,
progress-spinners use the theme's `'primary'` color. This can be changed to `'accent'` or `'warn'`.

### Accessibility

Each progress spinner should be given a meaningful label via `aria-label` or `aria-labelledby`.
