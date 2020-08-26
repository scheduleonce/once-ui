import { storiesOf } from '@storybook/angular';
import { OuiIconModule, OuiIconRegistry } from '../../components';
import { select, text, number } from '@storybook/addon-knobs';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import markdownText from '../../components/icon/README.md';
import { COLORS } from '../const';

@Component({
  selector: 'oui-icon-storybook',
  template: `
    <oui-icon [svgIcon]="icon" [size]="size" [color]="color"></oui-icon>
  `,
})
export class OuiiconStorybook {
  @Input() icon = 'notification-editor';
  @Input() color = 'primary';
  @Input() size = 20;
  constructor(
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.ouiIconRegistry.addSvgIcon(
      `local`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/v-green.svg`
      )
    );

    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://s3.amazonaws.com/icomoon.io/135790/oncehub-20/symbol-defs.svg?nhbz3f'
      )
    );
  }
}
const sizeOptions = {
  range: true,
  min: 15,
  max: 200,
  step: 1,
};
storiesOf('Icon', module).add(
  'Regular',
  () => ({
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
  }),
  { notes: { markdown: markdownText } }
);
