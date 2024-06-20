import { OuiProgressBar } from '../../components/progress-bar/progress-bar';
import { COLORS } from '../const';

export default {
  title: 'ProgressBar',
};

export const Determinate = {
  render: (props) => ({
    component: OuiProgressBar,
    props,
  }),

  name: 'Determinate',

  parameters: {
    docs: {
      source: {
        code: `<oui-progress-bar color="primary" value="60"></oui-progress-bar>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    strokeWidth: 5,
    value: 60,
  },

  argTypes: {
    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },
  },
};

export const Indeterminate = {
  render: (props) => ({
    component: OuiProgressBar,
    props,
  }),

  name: 'Indeterminate',

  parameters: {
    docs: {
      source: {
        code: `<oui-progress-bar color="primary"></oui-progress-bar>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    strokeWidth: 5,
  },

  argTypes: {
    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },
  },
};
