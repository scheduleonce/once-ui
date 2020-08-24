import { action } from '@storybook/addon-actions';
import { OuiCheckboxModule } from '../../components';
import { select, boolean } from '@storybook/addon-knobs';
import markdownText from '../../components/checkbox/README.md';
import { LABELPOSITION, COLORS } from '../const';

export default {
  title: 'Checkbox',
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiCheckboxModule],
    schemas: [],
    declarations: [],
  },
  template: `<oui-checkbox
              class="example-margin"
              [(ngModel)]="checked"
              [labelPosition]="position"
              (change)="changed($event)"
              [disabled]="disabled"
              [color]="color">
              I'm a checkbox
            </oui-checkbox>`,
  props: {
    color: select('color', COLORS, COLORS[0]),
    changed: action('change'),
    position: select('labelPosition', LABELPOSITION, LABELPOSITION[1]),
    disabled: boolean('disabled', false),
    checked: boolean('checked', false),
  },
});

Regular.story = {
  parameters: { notes: { markdown: markdownText } },
};
