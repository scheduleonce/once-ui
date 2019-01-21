import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { setOptions } from '@storybook/addon-options';
import { OuiSlideToggle } from '../../../projects/ui/src/lib/oui/slide-toggle/slide-toggle';
import markdownText from '../../../projects/ui/src/lib/oui/slide-toggle/README.md';
import { select, boolean } from '@storybook/addon-knobs';

storiesOf('Slide Toggle', module).add(
  'default',
  () => ({
    setOptions: setOptions({ showAddonPanel: true }),
    component: OuiSlideToggle,
    props: {
      checked: boolean('checked', true),
      disabled: boolean('disabled', false),
      color: select('color', ['primary', 'accent', 'warn'], 'primary'),
      change: action('change')
    }
  }),
  { notes: { markdown: markdownText } }
);
