import { OuiTooltipModule, OuiIconModule } from '../../components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from 'storybook/actions';
import { TOOLTIPPOSITION, THEME } from '../const';
import { OuiTooltipStorybook } from './tooltip.component';

export default {
  title: 'Tooltip',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiTooltipModule, OuiIconModule, BrowserAnimationsModule],
      schemas: [],
      declarations: [OuiTooltipStorybook],
    },

    template: `<oui-tooltip-storybook [disabled]="disabled" ngClass={{theme}}
    [_ouiTooltip]="ouiTooltip"
    [_ouiTooltipPosition]="ouiTooltipPosition"></oui-tooltip-storybook>`,

    props: {
      ...props,
      changed: action('change'),
    },
  }),

  name: 'Regular',

  parameters: {
    docs: {
      source: {
        code: `<oui-icon svgIcon="help-library" ouiTooltip="This is a tooltip" color="primary"></oui-icon>`,
      },
    },
  },

  args: {
    theme: THEME[0],
    disabled: false,
    ouiTooltip: 'This is a tooltip',
    ouiTooltipPosition: TOOLTIPPOSITION[0],
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    ouiTooltipPosition: {
      options: TOOLTIPPOSITION,

      control: {
        type: 'select',
      },
    },
  },
};
