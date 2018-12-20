`<oui-slide-toggle>` is an on/off control that can be toggled via clicking.

The slide-toggle behaves similarly to a checkbox.


A `<oui-slide-toggle>` element should be used whenever some toggle action is performed.


## Theming

Buttons can be colored in terms of the current theme using the color property to set the background color to primary, accent, or warn.

## Usage Example

```html
    <!-- regular slide toggle with primary color -->
    <oui-slide-toggle color="primary"></oui-slide-toggle>

    <!-- slide toggle with warn color -->
    <oui-slide-toggle color="warn" ></oui-slide-toggle>
```

## API SlideToggleComponent

| Input         | Type          | Default       | Description   |
| ------------- | ------------- | ------------- | ------------- |
| checked       | boolean       | false         | Whether the slide-toggle element is checked or not. |
| color         | string        | null          | Theme color palette for the component|
| disabled      | boolean       | false         | Whether the component is disabled.|
| id            | string        | random        | A unique id for the slide-toggle input. If none is supplied, it will be auto-generated.|


| Output         | Type          | Description   |
| -------------- | ------------- |  ------------- |
| change         | Event Emitter | An event will be dispatched each time the slide-toggle changes its value. |


