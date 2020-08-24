import { action } from '@storybook/addon-actions';
import { OuiSlideToggle } from '../../components/slide-toggle/slide-toggle';
import markdownText from '../../components/slide-toggle/README.md';
import { select, boolean } from '@storybook/addon-knobs';
import { COLORS } from '../const';

export default {
  title: 'Slide Toggle',
};

export const Regular = () => ({
  component: OuiSlideToggle,
  props: {
    checked: boolean('checked', true),
    disabled: boolean('disabled', false),
    color: select('color', COLORS, COLORS[0]),
    change: action('state-change'),
  },
});

Regular.story = {
  parameters: { notes: { markdown: markdownText } },
};
