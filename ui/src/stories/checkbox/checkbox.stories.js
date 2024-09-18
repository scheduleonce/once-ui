import { OuiCheckboxModule } from '../../components';
import { action } from '@storybook/addon-actions';
import { LABELPOSITION, COLORS } from '../const';

export default {
  title: 'Checkbox',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiCheckboxModule],
      schemas: [],
      declarations: [],
    },

    template: `<oui-checkbox
                [checked]="checked"
                [labelPosition]=labelPosition
                (click)="changed($event)"
                [disabled]="disabled"
                [color]="color">
                I'm a checkbox
              </oui-checkbox>`,

    props: {
      ...props,
      changed: action('click'),
    },
  }),

  name: 'regular',

  parameters: {
    docs: {
      source: {
        code: `<oui-checkbox class="example-margin" labelPosition="after">I'm a checkbox</oui-checkbox>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    labelPosition: LABELPOSITION[1],
    disabled: false,
    checked: false,
  },

  argTypes: {
    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },

    labelPosition: {
      options: LABELPOSITION,

      control: {
        type: 'select',
      },
    },
  },
};
