import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiFormFieldModule,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';
import markdownText from '../../../projects/ui/src/lib/oui/input/README.md';
import { text, boolean } from '@storybook/addon-knobs';
storiesOf('Form Field/Textarea', module).add(
  'Regular',
  () => ({
    moduleMetadata: {
      imports: [OuiFormFieldModule, OuiInputModule],
      schemas: [],
      declarations: []
    },
    template: ` <oui-form-field [appearance]="appearance">
    <textarea [disabled]="disabled" (blur)="blured()" (focus)="focused()" oui-input [placeholder]="placeholder"></textarea>
  </oui-form-field>`,
    props: {
      disabled: boolean('disabled', false),
      placeholder: text('placeholder', 'Type Here'),
      focused: action('focus'),
      blured: action('blur')
    }
  }),
  { notes: { markdown: markdownText } }
);
