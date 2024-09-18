import { OuiTabsModule, OuiTab } from '../../components/tabs/module';
import { OuiTabStorybook } from './tabs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { THEME } from '../const';

export default {
  title: 'Tab',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiTabsModule, BrowserAnimationsModule],
      schemas: [],
      declarations: [OuiTabStorybook],
    },

    template: `<oui-tab-storybook ngClass="{{theme}}"></oui-tab-storybook>`,

    props: {
      ...props,
    },
  }),

  name: 'regular',

  parameters: {
    docs: {
      source: {
        code: `
            <oui-tab-group>
              <oui-tab label="First"> Content 1 </oui-tab>
              <oui-tab label="Second"> Content 2 </oui-tab>
              <oui-tab label="Third"> Content 3 </oui-tab>
            </oui-tab-group>`,
      },
    },
  },

  args: {
    theme: THEME[0],
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },
  },
};
