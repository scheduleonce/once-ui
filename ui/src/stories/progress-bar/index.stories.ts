import { select, number } from '@storybook/addon-knobs';
import { OuiProgressBar } from '../../components/progress-bar/progress-bar';
import { COLORS } from '../const';

const strokeWidthOptions = {
  range: true,
  min: 1,
  max: 20,
  step: 1,
};
const valueOptions = {
  range: true,
  min: 1,
  max: 100,
  step: 1,
};

export default {
  title: 'Progress Bar',
  component: OuiProgressBar,
};

export const Determinate = () => ({
  component: OuiProgressBar,
  props: {
    color: select('color', COLORS, COLORS[0]),
    strokeWidth: number('strokeWidth', 5, strokeWidthOptions),
    value: number('value', 60, valueOptions),
  },
});

export const Indeterminate = () => ({
  component: OuiProgressBar,
  props: {
    color: select('color', COLORS, COLORS[0]),
    strokeWidth: number('strokeWidth', 5, strokeWidthOptions),
  },
});
