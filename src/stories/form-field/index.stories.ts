import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiFormFieldModule,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';
import markdownText from '../../../projects/ui/src/lib/oui/form-field/README.md';
import { text, select, boolean } from '@storybook/addon-knobs';
storiesOf('Form Field', module).add(
  'input',
  () => ({
    moduleMetadata: {
      imports: [OuiFormFieldModule, OuiInputModule],
      schemas: [],
      declarations: []
    },
    template: `<oui-form-field> <input [disabled]="disabled" (blur)="blured()" (focus)="focused()" [type]="type" oui-input [placeholder]="placeholder" /> </oui-form-field>`,
    props: {
      type: select(
        'type',
        ['text', 'number', 'color', 'email', 'password'],
        'text'
      ),
      disabled: boolean('disabled', false),
      placeholder: text('placeholder', 'Type Here'),
      focused: action('focus'),
      blured: action('blur')
    }
  }),
  { notes: { markdown: markdownText } }
);
