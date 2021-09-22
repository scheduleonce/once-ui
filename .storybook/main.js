module.exports = {
  stories: [
    '../ui/src/stories/**/*.stories.mdx',
    '../ui/src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-essentials',
  ],
  core: {
    builder: 'webpack5',
  },
};
