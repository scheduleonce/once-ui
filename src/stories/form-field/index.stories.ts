import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiFormFieldModule,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';
import markdownText from '../../../projects/ui/src/lib/oui/input/README.md';
import { text, select, boolean } from '@storybook/addon-knobs';
import { APPEARANCE } from '../const';
storiesOf('Form Field/Input', module).add(
  'Regular',
  () => ({
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
  }),
  { notes: { markdown: markdownText } }
);
