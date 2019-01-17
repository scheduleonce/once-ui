import { storiesOf } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  select,
  boolean,
  number
} from '@storybook/addon-knobs';
import { OuiProgressBar } from '../../../projects/ui/src/lib/oui/progress-bar/progress-bar';

const diameterOptions = {
  range: true,
  min: 100,
  max: 200,
  step: 1,
};
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
storiesOf('Progress Bar', module).add('determinate', () => ({
  setOptions: setOptions({ downPanelInRight: true }),
  component: OuiProgressBar,
  props: {
    color: select('color', ['primary', 'accent', 'warn'], 'primary'),
    diameter:number('diameter', 100, diameterOptions),
    strokeWidth:number('strokeWidth', 5, strokeWidthOptions),
    value:number('value', 60, valueOptions)
  }
}))
.add('indeterminate', () => ({
  setOptions: setOptions({ downPanelInRight: true }),
  component: OuiProgressBar,
  props: {
    color: select('color', ['primary', 'accent', 'warn'], 'primary'),
    diameter:number('diameter', 100, diameterOptions),
    strokeWidth:number('strokeWidth', 5, strokeWidthOptions)
  }
}));
