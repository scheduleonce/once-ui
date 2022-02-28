module.exports = {
  stories: [
    '../ui/src/stories/**/*.stories.mdx',
    '../ui/src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
};
