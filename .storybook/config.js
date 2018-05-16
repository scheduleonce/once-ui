/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure, addDecorator } from '@storybook/angular';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs/angular';
import { setOptions } from '@storybook/addon-options';
addDecorator(withKnobs);


// Option defaults:
// Option defaults:
setOptions({
  /**
   * name to display in the top left corner
   * @type {String}
   */
  name: 'Oncehub: UI components',
  /**
   * URL for name in top left corner to link to
   * @type {String}
   */
  url: '//github.com/ScheduleOnce/ui-components/',
  /**
   * show addon panel as a vertical panel on the right
   * @type {Boolean}
   */
  addonPanelInRight: true
});


function loadStories() {
  require('./index.stories');
}

configure(loadStories, module);