## Overlay Panel

`oui-panel` is a floating panel which can contains other elements.

The `<oui-panel>` doesn't render anything by itself. The panel is attached to and opened via application of the `ouiPanelTriggerFor` directive.

```html
<oui-panel #appPanel="mypanel">
  <div class="some-class">
    <p>some random text to show some information</p>
    <p>some random text to show some information</p>
    <p>some random text to show some information</p>
    <p>some random text to show some information</p>
    <p>some random text to show some information</p>
  </div>
</oui-panel>

<button oui-icon-button [ouiPanelTriggerFor]="mypanel">
  <!-- specify any icon -->
  <oui-icon svgIcon="home"></oui-icon>
</button>
```

## Toggling the panel programmatically

The panel exposes an API to open/close programmatically. Please note that in this case, an ouiPanelTriggerFor directive is still necessary to attach the panel to a trigger element in the DOM.

```typescript
class MyComponent {
  @ViewChild(OuiPanelTrigger)
  trigger: OuiPanelTrigger;

  someMethod() {
    this.trigger.openPanel();
  }
}
```

## Customizing Panel positions

By default, the Panel will display below (y-axis), after (x-axis). The position can be changed using the `xPosition (before | after)` and `yPosition (above | below)` attributes.

```html
<oui-panel #appPanel="ouiPanel" yPosition="above">
  <div>some content here</div>
  <div>some content here</div>
  <div>some content here</div>
  <div>some content here</div>
</oui-panel>

<button oui-icon-button [ouiPanelTriggerFor]="ouiPanel">
  <oui-icon svgIcon="more-vert"></oui-icon>
</button>
```

## Lazy rendering

By default, the panel content will be initialized even when the panel is closed. To defer initialization until the panel is open, the content can be provided as an ng-template with the ouiPanelContent attribute:

```html
<oui-panel #appPanel="ouiPanel">
  <ng-template ouiPanelContent>
    <div>some content here</div>
    <div>some content here</div>
  </ng-template>
</oui-panel>

<button oui-icon-button [ouiPanelTriggerFor]="ouiPanel">
  <oui-icon svgIcon="more-vert"></oui-icon>
</button>
```
