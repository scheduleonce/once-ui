import { OuiProgressSpinnerModule } from '../../components';
import { COLORS } from '../const';

export default {
  title: 'ProgressSpinner',
};

export const Determinate = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiProgressSpinnerModule],
      schemas: [],
      declarations: [],
    },
    template: `<oui-progress-spinner [color]=color [value]=value [strokeWidth]=strokeWidth [diameter]=diameter ></oui-progress-spinner>`,
    props,
  }),

  name: 'Determinate',

  parameters: {
    docs: {
      source: {
        code: `<oui-progress-spinner color="primary|accent|warn" value="1-100" strokeWidth='2' diameter='20' ></oui-progress-spinner>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    strokeWidth: 2,
    value: 60,
    diameter: 20,
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
      imports: [OuiProgressSpinnerModule],
      schemas: [],
      declarations: [],
    },
    template: `<oui-progress-spinner [color]=color [strokeWidth]=strokeWidth [diameter]=diameter></oui-progress-spinner>`,
    props,
  }),

  name: 'Indeterminate',

  parameters: {
    docs: {
      source: {
        code: `<oui-progress-spinner color="primary|accent|warn" strokeWidth='2' diameter='20' ></oui-progress-spinner>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    strokeWidth: 2,
    diameter: 20,
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
