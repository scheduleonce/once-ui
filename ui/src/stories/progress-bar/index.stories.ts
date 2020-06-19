import { storiesOf, addDecorator } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import { select, number } from '@storybook/addon-knobs';
import { OuiProgressBar } from '../../components/progress-bar/progress-bar';
import markdownText from '../../components/progress-bar/README.md';
import { withNotes } from '@storybook/addon-notes';
import { COLORS } from '../const';

addDecorator(withNotes);

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
storiesOf('Progress Bar', module)
  .add(
    'Determinate',
    () => ({
      component: OuiProgressBar,
      props: {
        color: select('color', COLORS, COLORS[0]),
        strokeWidth: number('strokeWidth', 5, strokeWidthOptions),
        value: number('value', 60, valueOptions)
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Indeterminate',
    () => ({
      setOptions: setOptions({ downPanelInRight: true }),
      component: OuiProgressBar,
      props: {
        color: select('color', COLORS, COLORS[0]),
        strokeWidth: number('strokeWidth', 5, strokeWidthOptions)
      }
    }),
    { notes: { markdown: markdownText } }
  );
