import {
  OuiIconModule,
  OuiPanelModule,
  OuiButtonModule,
  OuiPanel,
} from '../../components';
import { select, number } from '@storybook/addon-knobs';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  OuiPanelStorybook,
  OuiPanelWithImageStorybook,
} from './panel.component';

const widthOptions = {
  range: true,
  min: 270,
  max: 512,
  step: 1,
};

export default {
  title: 'Panel',
  component: OuiPanel,
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiIconModule, OuiButtonModule, OuiPanelModule, OverlayModule],
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
});

export const Panel = () => ({
  moduleMetadata: {
    imports: [OuiIconModule, OuiButtonModule, OuiPanelModule, OverlayModule],
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
});
