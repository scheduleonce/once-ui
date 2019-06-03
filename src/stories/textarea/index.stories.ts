import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiFormFieldModule,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';
import markdownText from '../../../projects/ui/src/lib/oui/input/README.md';
import { text, boolean, number } from '@storybook/addon-knobs';

const rowsOptions = {
  range: true,
  min: 2,
  max: 50,
  step: 1
};

storiesOf('Form Field/Textarea', module).add(
  'Regular',
  () => ({
    moduleMetadata: {
      imports: [OuiFormFieldModule, OuiInputModule],
      schemas: [],
      declarations: []
    },
    template: `<oui-form-field> <textarea [disabled]="disabled" [rows]="rows" (blur)="blured()" (focus)="focused()" oui-input [placeholder]="placeholder"></textarea> </oui-form-field>`,
    props: {
      disabled: boolean('disabled', false),
      placeholder: text('placeholder', 'Type Here'),
      rows: number('rows', 2, rowsOptions),
      focused: action('focus'),
      blured: action('blur')
    }
  }),
  { notes: { markdown: markdownText } }
);
