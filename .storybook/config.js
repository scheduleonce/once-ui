import { configure, addDecorator } from '@storybook/angular';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs/angular';
import { withOptions } from '@storybook/addon-options';
import "../src/stories/style.css";
import "../projects/ui/prebuilt-themes/oncehub.css";

addDecorator(withKnobs);
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
  url: '//github.com/ScheduleOnce/once-ui/',
  /**
   * show addon panel as a vertical panel on the right
   * @type {Boolean}
   */
  addonPanelInRight: true
});
const req = require.context('../src/stories', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
