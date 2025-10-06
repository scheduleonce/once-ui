import { OuiRadioModule, OuiRadioButton } from '../../components';
import { action } from 'storybook/actions';
import { LABELPOSITION, COLORS } from '../const';

export default {
  title: 'Radio',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiRadioModule],
      schemas: [],
      declarations: [],
    },

    template: `<oui-radio-group 
                (click)="changed($event)" 
                [disabled]="disabled" 
                [labelPosition]="position">
                <oui-radio-button 
                    checked 
                    value="Winter" 
                    [color]="color"> 
                    Winter 
                </oui-radio-button>
                <oui-radio-button 
                    value="Summer" 
                    [color]="color"> 
                    Summer 
                </oui-radio-button>
            </oui-radio-group>`,

    props: {
      ...props,
      changed: action('click'),
    },
  }),

  name: 'Regular',

  parameters: {
    docs: {
      source: {
        code: `
        <oui-radio-group name="enabled1" value="Winter">
          <oui-radio-button value="Winter"> 
            Winter 
          </oui-radio-button>
          <oui-radio-button value="Summer"> 
            Summer 
          </oui-radio-button>
        </oui-radio-group>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    position: LABELPOSITION[1],
    disabled: false,
  },

  argTypes: {
    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },

    position: {
      options: LABELPOSITION,

      control: {
        type: 'select',
      },
    },
  },
};
