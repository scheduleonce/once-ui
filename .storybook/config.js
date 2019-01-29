import { configure, addDecorator } from '@storybook/angular';
import {
  boolean,
  number,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { withNotes } from '@storybook/addon-notes';
import { withOptions } from '@storybook/addon-options';
import '../src/stories/style.css';
import '../src/stories/readme.css';
import '../src/stories/themes/oncehub.css';

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

configure(loadStories, module);
