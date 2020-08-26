import { action } from '@storybook/addon-actions';
import {
  OuiTooltipModule,
  OuiIconModule,
  OuiFormField
} from '../../components';
import { text, select, boolean } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TOOLTIPPOSITION } from '../const';
import { OuiTooltipStorybook } from './tooltip.component';

export default {
  title: 'Tooltip',
  component: OuiFormField
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiTooltipModule, OuiIconModule, BrowserAnimationsModule],
    schemas: [],
    declarations: [OuiTooltipStorybook]
  },
  template: `<oui-tooltip-storybook [disabled]="disabled"
    [_ouiTooltip]="ouiTooltip"
    [_ouiTooltipPosition]="ouiTooltipPosition"></oui-tooltip-storybook>`,
  props: {
    changed: action('change'),
    disabled: boolean('ouiTooltipDisabled', false),
    ouiTooltip: text('ouiTooltip', 'This is a tooltip'),
    ouiTooltipPosition: select(
      'ouiTooltipPosition',
      TOOLTIPPOSITION,
      TOOLTIPPOSITION[0]
    )
  }
});
