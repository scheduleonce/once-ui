import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { OuiFormFieldModule,OuiInputModule } from '../../../projects/ui/src/lib/oui';
import {
  withKnobs,
  text,
  select,
  boolean,
  number
} from '@storybook/addon-knobs';
storiesOf('Form Field', module)
.add('input', () => ({
  moduleMetadata: {
    imports: [OuiFormFieldModule,OuiInputModule],
    schemas: [],
    declarations: []
  },
  template: `<oui-form-field> <input [disabled]="disabled" [type]="type" oui-input [placeholder]="placeholder" /> </oui-form-field>`,
  props: {
    changed: action('change'),
    type: select('type', ['text', 'number','color','email','password'], 'text'),
    disabled: boolean('disabled', false),
    placeholder:text("placeholder","Type Here")
  },
}));
