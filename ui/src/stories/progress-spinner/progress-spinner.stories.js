import { OuiProgressSpinner } from '../../components/progress-spinner/progress-spinner';
import { COLORS } from '../const';

export default {
  title: 'ProgressSpinner',
};

export const Determinate = {
  render: (props) => ({
    component: OuiProgressSpinner,
    props,
  }),

  name: 'Determinate',

  parameters: {
    docs: {
      source: {
        code: `<oui-progress-spinner color="primary" value="60"></oui-progress-spinner>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    strokeWidth: 1,
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
    component: OuiProgressSpinner,
    props,
  }),

  name: 'Indeterminate',

  parameters: {
    docs: {
      source: {
        code: `<oui-progress-spinner color="primary"></oui-progress-spinner>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    strokeWidth: 1,
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
