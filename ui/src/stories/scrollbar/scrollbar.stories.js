import {
  OuiScrollbarModule,
  Scrollbar,
} from '../../components/scrollbar/scrollbar-module';
import { DUMMY_TEXT, COUNTRY_LIST } from '../const';
import { OuiScrollbarTextStorybook } from './scrollbar.component';
import { OuiScrollbarListStorybook } from './scrollbar.component';

export default {
  title: 'Scrollbar',
  component: Scrollbar,
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiScrollbarModule],
      schemas: [],
      declarations: [OuiScrollbarTextStorybook],
    },

    template: `<oui-scrollbar-text-storybook
        [large]="large"
        [height]="height"
        [text]="text"></oui-scrollbar-text-storybook>`,

    props,
  }),

  name: 'regular',
  height: '420px',

  parameters: {
    docs: {
      source: {
        code: `
            <div oui-scrollbar [style.height.px]="200">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</div>
          `,
      },
    },
  },

  args: {
    height: 350,
    large: false,
    text: DUMMY_TEXT,
  },
};

export const List = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiScrollbarModule],
      schemas: [],
      declarations: [OuiScrollbarListStorybook],
    },

    template: `<oui-scrollbar-list-storybook
  [large]="large"
  [height]="height"
  [items]="items"></oui-scrollbar-list-storybook>`,

    props,
  }),

  name: 'list',
  height: '420px',

  parameters: {
    docs: {
      source: {
        code: `
            <div oui-scrollbar [style.height.px]="200">
  <ul>
    <li>Aruba</li>
    <li>Benin</li>
    <li>Chad</li>
    <li>Chile</li>
    <li>China</li>
    <li>Congo</li>
    <li>Cuba</li>
    <li>Egypt</li>
    <li>Fiji</li>
    <li>Gabon</li>
    <li>Ghana</li>
    <li>Guam</li>
    <li>Haiti</li>
    <li>India</li>
    <li>Iraq</li>
    <li>Italy</li>
    <li>Japan</li>
  </ul>
</div>
          `,
      },
    },
  },

  args: {
    height: 350,
    large: false,
    items: COUNTRY_LIST,
  },
};
