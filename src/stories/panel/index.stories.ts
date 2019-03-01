import { storiesOf } from '@storybook/angular';
import {
  OuiIconModule,
  OuiPanelModule,
  OuiButtonModule
} from '../../../projects/ui/src/lib/oui';
import { select } from '@storybook/addon-knobs';
import { Component, Input } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

// import '../../../node_modules/@angular/cdk/overlay-prebuilt.css';
import markdownText from '../../../projects/ui/src/lib/oui/panel/README.md';

@Component({
  selector: 'oui-panel-storybook',
  template: `
    <div style="margin-left: 350px; margin-top:300px;">
      <oui-panel-icon style="" [ouiPanelTriggerFor]="afterAboveMenu">
      </oui-panel-icon>
    </div>
    <oui-panel #afterAboveMenu [xPosition]="xPosition" [yPosition]="yPosition">
      <h6>Lorem ipsum, dolor sit amet consectetur</h6>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate
        harum quod a incidunt? Obcaecati dolores omnis odio repudiandae quo
        quidem?
        <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
        dolorum! Reprehenderit reiciendis hic magnam esse odio asperiores qui
        tempora beatae.
        <a href="https://www.scheduleonce.com/" target="blank">Learn more</a>
      </p>
    </oui-panel>
  `
})
export class OuiPanelStorybook {
  @Input() xPosition: string = 'before';
  @Input() yPosition: string = 'above';
  constructor() {}
}

@Component({
  selector: 'oui-panel-with-image-storybook',
  template: `
    <div style="margin-left: 10px; margin-top:30px;">
      <oui-panel-icon style="" [ouiPanelTriggerFor]="afterAboveMenu">
      </oui-panel-icon>
    </div>
    <oui-panel #afterAboveMenu [xPosition]="xPosition" [yPosition]="yPosition">
      <h6>Lorem ipsum, dolor sit amet consectetur</h6>
      <img
        src="https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
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
  `
})
export class OuiPanelWithImageStorybook {
  @Input() xPosition: string = 'before';
  @Input() yPosition: string = 'above';
  constructor() {}
}

storiesOf('Panel', module)
  .add(
    'regular',
    () => ({
      moduleMetadata: {
        imports: [
          OuiIconModule,
          OuiButtonModule,
          OuiPanelModule,
          OverlayModule
        ],
        schemas: [],
        declarations: [OuiPanelStorybook]
      },
      template: `<oui-panel-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition">
            </oui-panel-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosotion', ['above', 'below'], 'above')
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'with image',
    () => ({
      moduleMetadata: {
        imports: [
          OuiIconModule,
          OuiButtonModule,
          OuiPanelModule,
          OverlayModule
        ],
        schemas: [],
        declarations: [OuiPanelWithImageStorybook]
      },
      template: `<oui-panel-with-image-storybook
    [xPosition]="xPosition"
    [yPosition]="yPosition">
              </oui-panel-with-image-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosotion', ['above', 'below'], 'above')
      }
    }),
    { notes: { markdown: markdownText } }
  );
