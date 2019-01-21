import { storiesOf } from '@storybook/angular';
import {
  OuiIconModule,
  OuiIconRegistry
} from '../../../projects/ui/src/lib/oui';
import { select, text } from '@storybook/addon-knobs';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import markdownText from '../../../projects/ui/src/lib/oui/icon/README.md';

@Component({
  selector: 'oui-icon-storybook',
  template: `
    <oui-icon [svgIcon]="icon" [color]="color"></oui-icon>
  `
})
export class OuiiconStorybook {
  @Input() icon: string = 'notification-editor';
  @Input() color: string = 'primary';
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
storiesOf('Icon', module).add(
  'default',
  () => ({
    moduleMetadata: {
      imports: [OuiIconModule],
      schemas: [],
      declarations: [OuiiconStorybook]
    },
    template: `<oui-icon-storybook [color]="color" [icon]="icon"></oui-icon-storybook>`,
    props: {
      color: select('color', ['primary', 'accent', 'warn'], 'primary'),
      icon: text('icon', 'notification-editor')
    }
  }),
  { notes: { markdown: markdownText } }
);
