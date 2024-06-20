module.exports = {
  stories: [
    '../ui/src/stories/**/*.mdx',
    '../ui/src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-mdx-gfm'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {},
};
