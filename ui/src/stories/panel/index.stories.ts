import { storiesOf } from '@storybook/angular';
import {
  OuiIconModule,
  OuiPanelModule,
  OuiButtonModule,
} from '../../components';
import { select, number } from '@storybook/addon-knobs';
import { Component, Input } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import markdownText from '../../components/panel/README.md';

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
})
export class OuiPanelStorybook {
  @Input() xPosition = 'before';
  @Input() yPosition = 'above';
  @Input() width = 270;
  constructor() {}
}
const widthOptions = {
  range: true,
  min: 270,
  max: 512,
  step: 1,
};
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
  `,
})
export class OuiPanelWithImageStorybook {
  @Input() xPosition = 'before';
  @Input() yPosition = 'above';
  constructor() {}
}

storiesOf('Panel', module)
  .add(
    'Regular',
    () => ({
      moduleMetadata: {
        imports: [
          OuiIconModule,
          OuiButtonModule,
          OuiPanelModule,
          OverlayModule,
        ],
        schemas: [],
        declarations: [OuiPanelStorybook],
      },
      template: `<oui-panel-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition"
  [width]="width">
            </oui-panel-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosotion', ['above', 'below'], 'above'),
        width: number('width', 270, widthOptions),
      },
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'With image',
    () => ({
      moduleMetadata: {
        imports: [
          OuiIconModule,
          OuiButtonModule,
          OuiPanelModule,
          OverlayModule,
        ],
        schemas: [],
        declarations: [OuiPanelWithImageStorybook],
      },
      template: `<oui-panel-with-image-storybook
    [xPosition]="xPosition"
    [yPosition]="yPosition">
              </oui-panel-with-image-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosotion', ['above', 'below'], 'above'),
      },
    }),
    { notes: { markdown: markdownText } }
  );
