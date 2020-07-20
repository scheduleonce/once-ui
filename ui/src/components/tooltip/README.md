The `oui-tooltip` provides a text label that is displayed when the user hovers
over an element.

### Usage

```js
import { OuiTooltipModule } from '@oncehub/ui';

@NgModule({
  imports: [
    OuiTooltipModule
  ]
})
```

## Usage Example

```html
<!-- default tooltip -->
<button ouiTooltip="Button Tooltip" oui-button color="primary"></button>

<!-- tooltip with above position -->
<button
  ouiTooltip="Button Tooltip"
  ouiTooltipPosition="above"
  oui-button
  color="primary"
></button>
```

## API OuiTooltip

| Input              | Type    | Default | Description                              |
| ------------------ | ------- | ------- | ---------------------------------------- |
| ouiTooltip         | string  | empty   | Tooltip Text                             |
| ouiTooltipPosition | string  | below   | 'left','right' , 'above' , 'below'       |
| ouiTooltipDisabled | boolean | false   | Whether the tooltip is disabled          |
| ouiTooltipClass    | string  | null    | Used to set class on underlying element. |

| Method | Description      |
| ------ | ---------------- |
| show   | Show the tooltip |
| hide   | Hide the tooltip |

### Positioning

The tooltip will be displayed below the element but this can be configured using the
`ouiTooltipPosition` input.
The tooltip can be displayed above, below, left, or right of the element. By default the position
will be below.

| Position | Description                                |
| -------- | ------------------------------------------ |
| `above`  | Always display above the element           |
| `below`  | Always display beneath the element         |
| `left`   | Always display to the left of the element  |
| `right`  | Always display to the right of the element |

### Showing and hiding

By default, the tooltip will be immediately shown when the user's mouse hovers over the tooltip's
trigger element and immediately hides when the user's mouse leaves.

#### Manually calling show() and hide()

To manually cause the tooltip to show or hide, you can call the `show` and `hide` directive methods.

#### Disabling the tooltip from showing

To completely disable a tooltip, set `ouiTooltipDisabled`. While disabled, a tooltip will never be
shown.

## Stackblitz demo link

[https://stackblitz.com/edit/oui-tooltip](https://stackblitz.com/edit/oui-tooltip)

You can click here and can change code to try and test different scenarios.

### Accessibility

Elements with the `ouiTooltip` will add an `aria-describedby` label that provides a reference
to a visually hidden element containing the tooltip's message. This provides screenreaders the
information needed to read out the tooltip's contents when the end-user focuses on the element
triggering the tooltip. The element referenced via `aria-describedby` is not the tooltip itself,
but instead an invisible copy of the tooltip content that is always present in the DOM.
