import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { OuiSlideToggle } from '../../../projects/ui/src/lib/oui/slide-toggle/slide-toggle';
import markdownText from '../../../projects/ui/src/lib/oui/slide-toggle/README.md';
import { select, boolean } from '@storybook/addon-knobs';
import { COLORS } from '../const';

storiesOf('Slide Toggle', module).add(
  'default',
  () => ({
    component: OuiSlideToggle,
    props: {
      checked: boolean('checked', true),
      disabled: boolean('disabled', false),
      color: select('color', COLORS, COLORS[0]),
      change: action('change')
    }
  }),
  { notes: { markdown: markdownText } }
);
