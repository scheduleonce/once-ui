The `oui-scrollbar` provides a custom scrollbar to the inner content of element it has been applied on.

### Usage

```js
import { OuiScrollbarModule } from '@once/ui';

@NgModule({
  imports: [
    OuiScrollbarModule
  ]
})
```

## Usage Example

```html
<div oui-scrollbar oui-scrollbar-large [style.height.px]="200">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
  when an unknown printer took a galley of type and scrambled it to make a type
  specimen book. It has survived not only five centuries, but also the leap into
  electronic typesetting, remaining essentially unchanged. It was popularised in
  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
  and more recently with desktop publishing software like Aldus PageMaker
  including versions of Lorem Ipsum.
</div>
```

## API OuiScrollbar

| Input               | Type    | Default | Description                                                                                                                            |
| ------------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| oui-scrollbar-large | boolean | false   | Whether oui-scrollbar is used in large content for showing large scrollbar. Default width of scrollbar is 6px and for large it is 8px. |

## Stackblitz demo link

[https://stackblitz.com/edit/oui-scrollbar](https://stackblitz.com/edit/oui-scrollbar)

You can click here and can change code to try and test different scenarios.

### Accessibility

`ouiScrollbar` works same as native scrollbar thus support all the accessiblity features of browser like UP and DOWN arrow keys.

### Browser support

| Browser           | Support   |
| ----------------- | --------- |
| `Chrome`          | Yes       |
| `Edge`            | Yes       |
| `Mozilla Firefox` | Partially |
| `Safari`          | Yes       |
