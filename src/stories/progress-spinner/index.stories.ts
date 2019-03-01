import { storiesOf } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import { select, number } from '@storybook/addon-knobs';
import { OuiProgressSpinner } from '../../../projects/ui/src/lib/oui/progress-spinner/progress-spinner';
import markdownText from '../../../projects/ui/src/lib/oui/progress-spinner/README.md';
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
storiesOf('Progress Spinner', module)
  .add(
    'Determinate',
    () => ({
      setOptions: setOptions({ downPanelInRight: true }),
      component: OuiProgressSpinner,
      props: {
        color: select('color', COLORS, COLORS[0]),
        diameter: number('diameter', 15, diameterOptions),
        strokeWidth: number('strokeWidth', 2, strokeWidthOptions),
        value: number('value', 60, valueOptions)
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Indeterminate',
    () => ({
      setOptions: setOptions({ downPanelInRight: true }),
      component: OuiProgressSpinner,
      props: {
        color: select('color', COLORS, COLORS[0]),
        diameter: number('diameter', 15, diameterOptions),
        strokeWidth: number('strokeWidth', 2, strokeWidthOptions)
      }
    }),
    { notes: { markdown: markdownText } }
  );
