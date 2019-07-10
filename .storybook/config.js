import { configure, addDecorator, addParameters } from '@storybook/angular';
import theme from './theme';
import {
  boolean,
  number,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { withNotes } from '@storybook/addon-notes';
import { withOptions } from '@storybook/addon-options';
import '../src/stories/styles/style.css';

addDecorator(withKnobs);
addDecorator(withNotes);
withOptions({
  /**
   * name to display in the top left corner
   * @type {String}
   */
  name: 'Oncehub: UI components',
  /**
   * URL for name in top left corner to link to
   * @type {String}
   */
  url: '//github.com/ScheduleOnce/once-ui/'
});
const req = require.context('../src/stories', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addParameters({
  options: {
    theme: theme,
    addonPanelInRight: true
  }
});

configure(loadStories, module);
