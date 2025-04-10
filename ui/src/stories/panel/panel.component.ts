import { Component, Input } from '@angular/core';

@Component({
  selector: 'oui-panel-storybook',
  template: `
    <oui-panel-icon style="" [ouiPanelTriggerFor]="afterAboveMenu">
    </oui-panel-icon>
    <oui-panel
      #afterAboveMenu
      [width]="width"
      [xPosition]="xPosition"
      [yPosition]="yPosition"
    >
      <h6>Lorem ipsum, dolor sit amet consectetur</h6>
      <p>
        Loremipsumdolorsit,ametconsecteturadipisicingelit. Cupiditate harum quod
        a incidunt? Obcaecati dolores omnis odio repudiandae quo quidem?
        <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
        dolorum! Reprehenderit reiciendis hic magnam esse odio asperiores qui
        tempora beatae.
        <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
      </p>
    </oui-panel>
  `,
  standalone: false,
})
export class OuiPanelStorybook {
  @Input() xPosition = 'before';
  @Input() yPosition = 'above';
  @Input() width = 270;
  constructor() {}
}
@Component({
  selector: 'oui-panel-with-image-storybook',
  template: `
    <oui-panel-icon style="" [ouiPanelTriggerFor]="afterAboveMenu">
    </oui-panel-icon>
    <oui-panel #afterAboveMenu [xPosition]="xPosition" [yPosition]="yPosition">
      <h6>Lorem ipsum, dolor sit amet consectetur</h6>
      <img
        src="https://images.pexels.com/photos/1856488/pexels-photo-1856488.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
      />
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate
        harum quod a incidunt? Obcaecati dolores omnis odio repudiandae quo
        quidem?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
        dolorum! Reprehenderit reiciendis hic magnam esse odio asperiores qui
        tempora beatae.
      </p>
    </oui-panel>
  `,
  standalone: false,
})
export class OuiPanelWithImageStorybook {
  @Input() xPosition = 'before';
  @Input() yPosition = 'above';
  constructor() {}
}
