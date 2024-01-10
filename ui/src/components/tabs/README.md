The `oui-tab` efficiently arrange content into distinct views, allowing visibility for only one view at a time.
The tab header displays each tab's label, with the active tab highlighted by an animated ink bar.

### Usage

```js
import { OuiTabsModule } from '@oncehub/ui';

@NgModule({
  imports: [
    OuiTabsModule
  ]
})
```

## Usage Example

```html
<oui-tab-group (selectedTabChange)="onTabChanged($event);">
  <oui-tab label="First1" text="<h2>Content in tab 1</h2>"></oui-tab>
  <oui-tab label="Second" text="<h2>Content in tab 2</h2>"></oui-tab>
  <oui-tab label="Third" text="<h2>Content in tab 3</h2>"></oui-tab>
</oui-tab-group>
```

## API OuiTab

| Input | Type   | Default | Description                                                 |
| ----- | ------ | ------- | ----------------------------------------------------------- |
| label | string | empty   | Label Text                                                  |
| text  | string | empty   | The text/HTML that we want to display in the respective tab |

| Method            | Description                                    |
| ----------------- | ---------------------------------------------- |
| selectedTabChange | The selectedTabChange, emits the change event. |

## Stackblitz demo link

[https://stackblitz.com/edit/oui-tab](https://stackblitz.com/edit/oui-tab)

You can click here and can change code to try and test different scenarios.

### Accessibility

Elements with the `ouiTab` will add an `aria-describedby` label that provides a reference
to a visually hidden element containing the title. This provides screenreaders the
information needed to read out the contents when the end-user focuses on the element
triggering the tab.
