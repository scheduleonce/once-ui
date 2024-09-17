import { OuiFormFieldModule, FormFieldModule } from '../../components';
import { OuiInputModule, OuiFormField } from '../../components';
import { action } from '@storybook/addon-actions';
import { APPEARANCE, THEME } from '../const';

export default {
  title: 'FORM FIELD/Input',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiFormFieldModule, OuiInputModule],
      schemas: [],
      declarations: [],
    },

    template: `<oui-form-field [appearance]="appearance" ngClass={{theme}}> 
                <input 
                [disabled]="disabled" 
                (blur)="blured()" 
                (focus)="focused()" 
                [value]="type" 
                oui-input 
                [placeholder]="placeholder" /> 
                </oui-form-field>`,

    props: {
      ...props,
      focused: action('focus'),
      blured: action('blur'),
    },
  }),

  name: 'Regular',

  parameters: {
    docs: {
      source: {
        code: `<oui-form-field>
                <input oui-input type="text" placeholder="Type here" >
                </oui-form-field>`,
      },
    },
  },

  args: {
    type: 'text',
    theme: THEME[0],
    disabled: false,
    placeholder: 'Type here',
    appearance: APPEARANCE[0],
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    appearance: {
      options: APPEARANCE,

      control: {
        type: 'select',
      },
    },
  },
};
