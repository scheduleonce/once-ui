import {
  OuiIconModule,
  OuiPanelModule,
  OuiButtonModule,
  OuiPanel,
} from '../../components';
import { OverlayModule } from '@angular/cdk/overlay';
import { OuiPanelStorybook } from './panel.component';
import { OuiPanelWithImageStorybook } from './panel.component';

export default {
  title: 'Panel',
};

export const Regular = {
  render: (props) => ({
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

    props,
  }),

  name: 'Regular',
  height: '300px',

  parameters: {
    docs: {
      source: {
        code: `
            <oui-panel-icon [ouiPanelTriggerFor]="beforeAboveMenu">
</oui-panel-icon>
<oui-panel #beforeAboveMenu xPosition="before" yPosition="above">
    <h6>Lorem ipsum, dolor sit amet consectetur</h6>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate harum quod a incidunt?
        Obcaecati dolores omnis odio repudiandae quo quidem? <a href="https://www.scheduleonce.com/"
            target="blank">Learn more</a>
    </p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, dolorum! Reprehenderit
        reiciendis hic magnam esse odio asperiores qui tempora beatae. <a
            href="https://www.scheduleonce.com/" target="blank">Learn more</a>
    </p>
</oui-panel>
          `,
      },
    },
  },

  args: {
    xPosition: 'before',
    yPosition: 'above',
    width: 300,
  },

  argTypes: {
    xPosition: {
      options: ['before', 'after'],

      control: {
        type: 'select',
      },
    },

    yPosition: {
      options: ['above', 'below'],

      control: {
        type: 'select',
      },
    },
  },
};

export const WithImage = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiIconModule, OuiButtonModule, OuiPanelModule, OverlayModule],
      schemas: [],
      declarations: [OuiPanelWithImageStorybook],
    },

    template: `<oui-panel-with-image-storybook
    [xPosition]="xPosition"
    [yPosition]="yPosition">
              </oui-panel-with-image-storybook>`,

    props,
  }),

  name: 'With image',
  height: '500px',

  parameters: {
    docs: {
      source: {
        code: `
            <oui-panel-icon [ouiPanelTriggerFor]="afterBelowImage">
</oui-panel-icon>
<oui-panel #afterBelowImage xPosition="after" yPosition="below">
    <h6>Lorem ipsum, dolor sit amet consectetur</h6>
    <img src="https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"/>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate harum quod a incidunt?
        Obcaecati dolores
        omnis odio repudiandae quo quidem?
    </p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, dolorum! Reprehenderit
        reiciendis hic
        magnam esse odio asperiores qui tempora beatae.
    </p>
</oui-panel>
          `,
      },
    },
  },

  args: {
    xPosition: 'before',
    yPosition: 'above',
  },

  argTypes: {
    xPosition: {
      options: ['before', 'after'],

      control: {
        type: 'select',
      },
    },

    yPosition: {
      options: ['above', 'below'],

      control: {
        type: 'select',
      },
    },
  },
};
