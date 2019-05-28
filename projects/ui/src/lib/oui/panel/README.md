## Overlay Panel

`oui-panel` is a floating panel which can contain other elements.
It also provide default information icon that can be used as component `oui-panel-icon`.

The `<oui-panel>` doesn't render anything by itself. The panel is attached to and opened via application of the `ouiPanelTriggerFor` directive.

```html
<oui-panel #mypanel>
  <h6>Lorem ipsum, dolor sit amet consectetur</h6>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate harum
    quod a incidunt? Obcaecati dolores omnis odio repudiandae quo quidem?
    <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
    dolorum! Reprehenderit reiciendis hic magnam esse odio asperiores qui
    tempora beatae.
    <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
  </p>
</oui-panel>

<oui-panel-icon [ouiPanelTriggerFor]="mypanel"> </oui-panel-icon>
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

## API OuiPanelIcon

| Input              | Type    | Default | Description                                                      |
| ------------------ | ------- | ------- | -----------------------------------------------------------------|
| ouiPanelTriggerFor | any     | empty   | It is used to attach the panel to a trigger element in the DOM   |


## API OuiPanel

| Input              | Type    | Default | Description                                                      |
| ------------------ | ------- | ------- | -----------------------------------------------------------------|
| ouiPanelTriggerFor | any     | empty   | It is used to attach the panel to a trigger element in the DOM   |
| xPosition          | string  | empty   | 'after','before'                                                 |
| yPosition          | string  | empty   | 'above' , 'below'                                                |
| width              | number  | empty   | Assigned custom width in pixels like [width]="300"               |


## Customizing Panel positions

By default, the Panel will display below (y-axis), after (x-axis). The position can be changed using the `xPosition (before | after)` and `yPosition (above | below)` attributes.

```html
<oui-panel #ouiPanel yPosition="above">
  <h6>Lorem ipsum, dolor sit amet consectetur</h6>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate harum
    quod a incidunt? Obcaecati dolores omnis odio repudiandae quo quidem?
    <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
    dolorum! Reprehenderit reiciendis hic magnam esse odio asperiores qui
    tempora beatae.
    <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
  </p>
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

## Using Image tag in panel

If any image tag is used inside the `oui-panel` then it will automatically provides larger width to the overlay panel.

```html
<oui-panel-icon [ouiPanelTriggerFor]="afterBelowImage"> </oui-panel-icon>
<oui-panel #afterBelowImage xPosition="after" yPosition="below">
  <h6>Lorem ipsum, dolor sit amet consectetur</h6>
  <img
    src="https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
  />
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate harum
    quod a incidunt? Obcaecati dolores omnis odio repudiandae quo quidem?
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
    dolorum! Reprehenderit reiciendis hic magnam esse odio asperiores qui
    tempora beatae.
  </p>
</oui-panel>
```

## Add custom width in panel

By default, the Panel width will be 270px. The width can be changed using the `width` attributes upto 512px. Width value should always be in pixels.

```html
<oui-panel-icon [ouiPanelTriggerFor]="afterBelowImage"> </oui-panel-icon>
<oui-panel #afterBelowImage [width]="280">
  <h6>Lorem ipsum, dolor sit amet consectetur</h6>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate harum
    quod a incidunt? Obcaecati dolores omnis odio repudiandae quo quidem?
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
    dolorum! Reprehenderit reiciendis hic magnam esse odio asperiores qui
    tempora beatae.
  </p>
</oui-panel>
```

## Stackblitz Link

[https://stackblitz.com/edit/angular-oui-panel-latest](https://stackblitz.com/edit/angular-oui-panel-latest)
