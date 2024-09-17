import { OuiIconModule } from '../../components';
import { COLORS, ICON_COLORS } from '../const';
import { OuiiconStorybook } from './icon.component';

export default {
  title: 'Icon',
};

export const DefaultColor = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiIconModule],
      schemas: [],
      declarations: [OuiiconStorybook],
    },

    template: `<oui-icon-storybook 
                [icon]="icon" >
                </oui-icon-storybook>`,

    props,
  }),

  name: 'Default color',

  parameters: {
    docs: {
      source: {
        code: `<oui-icon svgIcon="calendar" color="primary"></oui-icon>`,
      },
    },
  },

  args: {
    icon: 'calendar',
  },

  argTypes: {},
};

export const CustomIcon = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiIconModule],
      schemas: [],
      declarations: [OuiiconStorybook],
    },

    template: `<oui-icon-storybook 
                [color]=color 
                [icon]="icon" 
                [size]="size">
                </oui-icon-storybook>`,

    props,
  }),

  name: 'Custom icon',

  parameters: {
    docs: {
      source: {
        code: `<oui-icon svgIcon="configuration" class="maroon"></oui-icon>`,
      },
    },
  },

  args: {
    size: 20,
    color: COLORS[0],
    icon: 'configuration',
  },

  argTypes: {
    color: {
      options: ICON_COLORS,

      control: {
        type: 'select',
      },
    },

    size: {
      control: {
        type: 'number',
      },
    },
  },
};
