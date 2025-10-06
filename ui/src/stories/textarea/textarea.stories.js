import {
  OuiFormFieldModule,
  OuiInputModule,
  OuiFormField,
} from '../../components';
import { action } from 'storybook/actions';
import { THEME } from '../const';

export default {
  title: 'FORM FIELD/Textarea',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiFormFieldModule, OuiInputModule],
      schemas: [],
      declarations: [],
    },

    template: `<oui-form-field ngClass="{{theme}}"> <textarea [disabled]="disabled" [rows]="rows" (blur)="blured()" (focus)="focused()" oui-input [placeholder]="placeholder"></textarea> </oui-form-field>`,

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
    rows: 2,
    theme: THEME[0],
    disabled: false,
    placeholder: 'Type here',
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },
  },
};
