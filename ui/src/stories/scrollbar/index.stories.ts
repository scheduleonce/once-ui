import { OuiScrollbarModule } from '../../components/scrollbar/scrollbar-module';
import { text, boolean, number, array } from '@storybook/addon-knobs';
import { DUMMY_TEXT, COUNTRY_LIST } from '../const';
import { OuiScrollbar } from '../../components/scrollbar/scrollbar';
import {
  OuiScrollbarTextStorybook,
  OuiScrollbarListStorybook
} from './scrollbar.component';

const valueOptions = {
  range: true,
  min: 100,
  max: 500,
  step: 1
};

export default {
  title: 'Scrollbar',
  component: OuiScrollbar
};

export const Text = () => ({
  moduleMetadata: {
    imports: [OuiScrollbarModule],
    schemas: [],
    declarations: [OuiScrollbarTextStorybook]
  },
  template: `<oui-scrollbar-text-storybook
  [large]="large"
  [height]="height"
  [text]="text"></oui-scrollbar-text-storybook>`,
  props: {
    large: boolean('large', false),
    height: number('height', 350, valueOptions),
    text: text('text', DUMMY_TEXT)
  }
});

export const List = () => ({
  moduleMetadata: {
    imports: [OuiScrollbarModule],
    schemas: [],
    declarations: [OuiScrollbarListStorybook]
  },
  template: `<oui-scrollbar-list-storybook
  [large]="large"
  [height]="height"
  [items]="items"></oui-scrollbar-list-storybook>`,
  props: {
    large: boolean('large', false),
    height: number('height', 350, valueOptions),
    items: array('items', COUNTRY_LIST)
  }
});
