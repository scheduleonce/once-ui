`<oui-slide-toggle>` is an on/off control that can be toggled via clicking.

The slide-toggle behaves similarly to a checkbox.

A `<oui-slide-toggle>` element should be used whenever some toggle action is performed.

## Usage Example

```html
<!-- regular slide toggle with primary color -->
<oui-slide-toggle color="primary"></oui-slide-toggle>

<!-- slide toggle with warn color -->
<oui-slide-toggle color="warn" ></oui-slide-toggle>
```

## API SlideToggleComponent

| Input           | Type    | Default | Description                                                                            |
| --------------- | ------- | ------- | -------------------------------------------------------------------------------------- |
| checked         | boolean | false   | Whether the slide-toggle element is checked or not                                     |
| color           | string  | primary | Theme color palette for the component                                                  |
| disabled        | boolean | false   | Whether the component is disabled                                                      |
| aria-label      | string  | null    | Used to set the aria-label attribute on the underlying input element.                  |
| aria-labelledby | string  | null    | Used to set the aria-labelledby attribute on the underlying input element.             |
| id              | string  | random  | A unique id for the slide-toggle input. If none is supplied, it will be auto-generated |

| Output | Type          | Description                                                              |
| ------ | ------------- | ------------------------------------------------------------------------ |
| change | Event Emitter | An event will be dispatched each time the slide-toggle changes its value |

| Method | Description                       |
| ------ | --------------------------------- |
| toggle | Toggles the state of slide-toggle |
| focus  | Focus the component               |

## Theming

Slide toggles can be colored in terms of the current theme using the color property to set the background color to `primary`, `accent`, or `warn`.

## Accessibility

The `<oui-slide-toggle>` uses an internal `<input type="checkbox">` to provide an accessible experience.

Slide toggles should be given a meaningful label via `aria-label` or `aria-labelledby`.
