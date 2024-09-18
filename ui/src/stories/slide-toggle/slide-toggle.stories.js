import { action } from '@storybook/addon-actions';
import { COLORS } from '../const';
import { OuiSlideToggleModule } from '../../components';

export default {
  title: 'SlideToggle',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiSlideToggleModule],
      schemas: [],
      declarations: [],
    },

    template: `<oui-slide-toggle [checked]="checked" [color]="color" [disabled]="disabled" (click)="change($event)"></oui-slide-toggle>`,

    props: {
      ...props,
      change: action('click'),
    },
  }),

  name: 'regular',

  parameters: {
    docs: {
      source: {
        code: `<oui-slide-toggle color="primary"></oui-slide-toggle>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    disabled: false,
    checked: true,
  },

  argTypes: {
    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },
  },
};
