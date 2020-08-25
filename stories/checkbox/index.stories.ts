import { action } from '@storybook/addon-actions';
import { Checkbox } from '../../ui/src/components/checkbox/checkbox';
import { select, boolean } from '@storybook/addon-knobs';
import { LABELPOSITION, COLORS } from '../const';

export default {
  title: 'Checkbox',
  component: Checkbox
};

export const Regular = () => ({
  component: Checkbox,
  props: {
    color: select('color', COLORS, COLORS[0]),
    changed: action('change'),
    position: select('labelPosition', LABELPOSITION, LABELPOSITION[1]),
    disabled: boolean('disabled', false),
    checked: boolean('checked', false)
  }
});
