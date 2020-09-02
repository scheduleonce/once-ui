import { action } from '@storybook/addon-actions';
import {
  OuiFormFieldModule,
  OuiInputModule,
  OuiFormField,
} from '../../components';
import { text, boolean, number } from '@storybook/addon-knobs';

const rowsOptions = {
  range: true,
  min: 2,
  max: 50,
  step: 1,
};

export default {
  title: 'Form Field/Textarea',
  component: OuiFormField,
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiFormFieldModule, OuiInputModule],
    schemas: [],
    declarations: [],
  },
  template: `<oui-form-field> <textarea [disabled]="disabled" [rows]="rows" (blur)="blured()" (focus)="focused()" oui-input [placeholder]="placeholder"></textarea> </oui-form-field>`,
  props: {
    disabled: boolean('disabled', false),
    placeholder: text('placeholder', 'Type Here'),
    rows: number('rows', 2, rowsOptions),
    focused: action('focus'),
    blured: action('blur'),
  },
});
