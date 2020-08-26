import { select, number } from '@storybook/addon-knobs';
import { OuiProgressSpinner } from '../../components/progress-spinner/progress-spinner';
import { COLORS } from '../const';

const diameterOptions = {
  range: true,
  min: 15,
  max: 200,
  step: 1
};
const strokeWidthOptions = {
  range: true,
  min: 1,
  max: 20,
  step: 1
};
const valueOptions = {
  range: true,
  min: 1,
  max: 100,
  step: 1
};

export default {
  title: 'Progress Spinner',
  component: OuiProgressSpinner
};

export const Determinate = () => ({
  component: OuiProgressSpinner,
  props: {
    color: select('color', COLORS, COLORS[0]),
    diameter: number('diameter', 15, diameterOptions),
    strokeWidth: number('strokeWidth', 2, strokeWidthOptions),
    value: number('value', 60, valueOptions)
  }
});

export const Indeterminate = () => ({
  component: OuiProgressSpinner,
  props: {
    color: select('color', COLORS, COLORS[0]),
    diameter: number('diameter', 15, diameterOptions),
    strokeWidth: number('strokeWidth', 2, strokeWidthOptions)
  }
});
