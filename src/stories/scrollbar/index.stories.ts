import { storiesOf } from '@storybook/angular';
import { OuiScrollbarModule } from '../../../projects/ui/src/lib/oui';
import { text, boolean, number, array } from '@storybook/addon-knobs';
import { Input, Component } from '@angular/core';
import markdownText from '../../../projects/ui/src/lib/oui/scrollbar/README.md';
import { DUMMY_TEXT, COUNTRY_LIST } from '../const';
const valueOptions = {
  range: true,
  min: 100,
  max: 500,
  step: 1
};

@Component({
  selector: 'oui-scrollbar-text-storybook',
  template: `
    <div
      oui-scrollbar
      [oui-scrollbar-large]="large"
      [style.height.px]="height"
      class="content"
    >
      {{ text }}
    </div>
  `
})
export class OuiScrollbarTextStorybook {
  @Input() large: boolean = false;
  @Input() height: number = 200;
  @Input() text: string = 'This is a tooltip';
  contentHeight = 100;
  constructor() {}
}

@Component({
  selector: 'oui-scrollbar-list-storybook',
  template: `
    <div
      oui-scrollbar
      [oui-scrollbar-large]="large"
      [style.height.px]="height"
      class="content"
    >
      <ul class="scrollbar-list">
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
    </div>
  `
})
export class OuiScrollbarListStorybook {
  @Input() large: boolean = false;
  @Input() height: number = 200;
  @Input() items: string[] = [];
  contentHeight = 100;
  constructor() {}
}

storiesOf('Scrollbar', module)
  .add(
    'Text',
    () => ({
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
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'List',
    () => ({
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
    }),
    { notes: { markdown: markdownText } }
  );
