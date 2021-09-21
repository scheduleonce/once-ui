module.exports = {
  "stories": [
    "../ui/src/stories/**/*.stories.mdx",
    "../ui/src/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-knobs"
  ],
  "core": {
    "builder": "webpack5"
  }
}