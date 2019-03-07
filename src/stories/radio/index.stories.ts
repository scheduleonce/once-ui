import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { OuiRadioModule } from '../../../projects/ui/src/lib/oui';
import markdownText from '../../../projects/ui/src/lib/oui/radio/README.md';

import { select, boolean } from '@storybook/addon-knobs';
import { LABELPOSITION } from '../const';
storiesOf('Radio Button', module).add(
  'Regular',
  () => ({
    moduleMetadata: {
      imports: [OuiRadioModule],
      schemas: [],
      declarations: []
    },
    template: `<oui-radio-group (change)="changed($event)" [disabled]="disabled" [labelPosition]="position">
    <oui-radio-button checked value="Winter"> Winter </oui-radio-button>
    <oui-radio-button value="Summer"> Summer </oui-radio-button>
  </oui-radio-group>`,
    props: {
      changed: action('change'),
      position: select('labelPosition', LABELPOSITION, LABELPOSITION[1]),
      disabled: boolean('disabled', false)
    }
  }),
  { notes: { markdown: markdownText } }
);
