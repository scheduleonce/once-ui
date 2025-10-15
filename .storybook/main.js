module.exports = {
  stories: [
    '../ui/src/stories/**/*.mdx',
    '../ui/src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {},
};
