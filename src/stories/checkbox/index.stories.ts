import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { OuiCheckboxModule } from '../../../projects/ui/src/lib/oui';
import {
  withKnobs,
  text,
  select,
  boolean,
  number
} from '@storybook/addon-knobs';
storiesOf('Checkbox', module)
.add('default', () => ({
  moduleMetadata: {
    imports: [OuiCheckboxModule],
    schemas: [],
    declarations: []
  },
  template: `<oui-checkbox
                class="example-margin"
                [(ngModel)]="checked"
                [labelPosition]="position"
                (change)="changed($event)"
                [disabled]="disabled">
                I'm a checkbox
              </oui-checkbox>`,
  props: {
    changed: action('change'),
    position: select('labelPosition', ['before', 'after'], 'after'),
    disabled: boolean('disabled', false),
    checked: boolean('checked', false)
  },
}));
