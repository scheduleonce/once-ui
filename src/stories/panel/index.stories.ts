import { storiesOf } from '@storybook/angular';
import {
  OuiIconModule,
  OuiPanelModule,
  OuiIconRegistry,
  OuiButtonModule
} from '../../../projects/ui/src/lib/oui';
import { select } from '@storybook/addon-knobs';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

// import '../../../node_modules/@angular/cdk/overlay-prebuilt.css';
import markdownText from '../../../projects/ui/src/lib/oui/panel/README.md';

@Component({
  selector: 'oui-panel-storybook',
  template: `
    <div style="margin-left: 350px; margin-top:400px;">
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
  constructor(
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.ouiIconRegistry.addSvgIcon(
      `local`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/v-green.svg`
      )
    );

    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://s3.amazonaws.com/icomoon.io/135790/oncehub-20/symbol-defs.svg?nhbz3f'
      )
    );
  }
}

storiesOf('Panel', module).add(
  'default',
  () => ({
    moduleMetadata: {
      imports: [OuiIconModule, OuiButtonModule, OuiPanelModule, OverlayModule],
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
);
