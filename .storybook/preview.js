import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import 'zone.js'; // Ensure Zone.js is loaded before Angular

setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: { inlineStories: true },
};
// export const tags = ['autodocs'];
