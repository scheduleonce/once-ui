/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure, addDecorator } from '@storybook/angular';

import { boolean, number, text, withKnobs } from '@storybook/addon-knobs/angular';


addDecorator(withKnobs);

function loadStories() {
  require('./index.stories');
}

configure(loadStories, module);
