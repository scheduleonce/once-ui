import { OuiIconModule, OuiIconBase } from '../../components';
import { select, text, number } from '@storybook/addon-knobs';
import { COLORS } from '../const';
import { OuiiconStorybook } from './icon.component';

const sizeOptions = {
  range: true,
  min: 15,
  max: 200,
  step: 1,
};

export default {
  title: 'Icon',
  component: OuiIconBase,
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiIconModule],
    schemas: [],
    declarations: [OuiiconStorybook],
  },
  template: `<oui-icon-storybook [color]="color" [icon]="icon" [size]="size"></oui-icon-storybook>`,
  props: {
    color: select('color', COLORS, COLORS[0]),
    icon: text('icon', 'notification-editor'),
    size: number('size', 20, sizeOptions),
  },
});
