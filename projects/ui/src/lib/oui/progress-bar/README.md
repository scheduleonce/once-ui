`<oui-progress-bar>` is a horizontal progress-bar for indicating progress and activity.

## Usage

```js
import { OuiProgressBarModule } from '@oncehub/ui';

@NgModule({
  imports: [
    OuiProgressBarModule
  ]
})
```

## Usage Example

```html
<!-- progress bar with indeterminate mode -->
<oui-progress-bar></oui-progress-bar>

<!-- progress bar with determinate mode -->
<oui-progress-bar [value]="50"></oui-progress-bar>
```

## API ProgressSpinner

| Input       | Type   | Description                                                                                              |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------- |
| color       | string | Theme color palette for the component.                                                                   |
| strokeWidth | number | Stroke width of the progress bar.                                                                        |
| value       | number | Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow only works with determinate mode. |

The default mode is `indeterminate`. If value is passed mode will automatically switch to `determinate` mode. The progress is set via the `value` property, which can be a whole number between 0 and 100.

Default value for "strokeWidth" is 4. You can simply override and give your own value.

## Stackblitz demo link

[https://stackblitz.com/edit/oncehub-progress-bar-1](https://stackblitz.com/edit/oncehub-progress-bar-1)

You can click here and can change code to try and test different scenarios.

### Theming

The color of a progress bar can be changed by using the `color` property. By default,
progress-bar use the theme's `'primary'` color. This can be changed to `'accent'` or `'warn'`.

### Accessibility

Each progress bar should be given a meaningful label via `aria-label` or `aria-labelledby`.
