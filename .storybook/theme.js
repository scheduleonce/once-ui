import { create } from '@storybook/theming';

export default create({
  // Is this a 'light' or 'dark' theme?
  base: 'light',

  // Color palette
  colorPrimary: 'red', // primary color
  colorSecondary: 'rgb(30, 167, 253)', // secondary color

  // UI
  appBg: 'rgb(246, 249, 252)',
  appContentBg: 'white',
  appBorderColor: 'rgba(0, 0, 0, 0.3)',
  appBorderRadius: 6,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Fonts
  fontBase: '"Inter", sans-serif',
  fontCode: 'Monaco, monospace',

  // Text colors
  textColor: 'rgb(51, 51, 51)',
  textInverseColor: '#333333',

  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: 'rgb(30, 167, 253)',
  barBg: 'white',

  // Form colors
  inputBg: 'white',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: '#333333',
  inputBorderRadius: 4,
  brandUrl: 'https://github.com/scheduleonce/once-ui',
  brandImage:
    'https://cdn.oncehub.com/images/newsiteImages/oncehub-logo-main-menu.svg'
});
