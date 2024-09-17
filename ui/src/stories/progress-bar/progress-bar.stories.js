import { OuiProgressBar, OuiProgressBarModule } from '../../components';
import { COLORS } from '../const';

export default {
  title: 'ProgressBar',
};

export const Determinate = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiProgressBarModule],
      schemas: [],
      declarations: [],
    },
    template: `<oui-progress-bar [color]=color [strokeWidth]=strokeWidth [value]=value></oui-progress-bar>`,
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
    moduleMetadata: {
      imports: [OuiProgressBarModule],
      schemas: [],
      declarations: [],
    },
    template: `<oui-progress-bar [color]=color [strokeWidth]=strokeWidth></oui-progress-bar>`,
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
