import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { OuiSlideToggle } from '../../components/slide-toggle/slide-toggle';
import markdownText from '../../components/slide-toggle/README.md';
import { select, boolean } from '@storybook/addon-knobs';
import { COLORS } from '../const';

storiesOf('Slide Toggle', module).add(
  'Regular',
  () => ({
    component: OuiSlideToggle,
    props: {
      checked: boolean('checked', true),
      disabled: boolean('disabled', false),
      color: select('color', COLORS, COLORS[0]),
      change: action('state-change'),
    },
  }),
  { notes: { markdown: markdownText } }
);
