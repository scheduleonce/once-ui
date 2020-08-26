import { action } from '@storybook/addon-actions';
import {
  OuiFormFieldModule,
  OuiInputModule,
  OuiFormField
} from '../../components';
import { text, select, boolean } from '@storybook/addon-knobs';
import { APPEARANCE } from '../const';

export default {
  title: 'Form Field/Input',
  component: OuiFormField
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiFormFieldModule, OuiInputModule],
    schemas: [],
    declarations: []
  },
  template: `<oui-form-field [appearance]="appearance"> <input [disabled]="disabled" (blur)="blured()" (focus)="focused()" [type]="type" oui-input [placeholder]="placeholder" /> </oui-form-field>`,
  props: {
    type: select('type', ['text', 'number', 'email', 'password'], 'text'),
    appearance: select('appearance', APPEARANCE, APPEARANCE[0]),
    disabled: boolean('disabled', false),
    placeholder: text('placeholder', 'Type Here'),
    focused: action('focus'),
    blured: action('blur')
  }
});
