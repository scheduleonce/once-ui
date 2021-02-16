module.exports = {
  stories: [
    '../ui/src/stories/**/*.stories.mdx',
    '../ui/src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-knobs',
    '@storybook/addon-controls',
  ],
};
