import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiTooltipModule,
  OuiIconRegistry,
  OuiIconModule
} from '../../../projects/ui/src/lib/oui';
import { text, select, boolean } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Input, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import markdownText from '../../../projects/ui/src/lib/oui/tooltip/README.md';

@Component({
  selector: 'oui-tooltip-storybook',
  template: `
    <oui-icon
      [svgIcon]="icon"
      [ouiTooltip]="_ouiTooltip"
      [ouiTooltipPosition]="_ouiTooltipPosition"
      [color]="color"
      [ouiTooltipDisabled]="disabled"
      style="margin-top:250px;margin-left:200px;"
    ></oui-icon>
  `
})
export class OuiTooltipStorybook {
  private icon: string = 'help-library';
  private color: string = 'primary';
  @Input() disabled: boolean = false;
  @Input() _ouiTooltip: string = 'This is a tooltip';
  @Input() _ouiTooltipPosition: string = 'above';
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

storiesOf('Tooltip', module).add(
  'default',
  () => ({
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
        ['above', 'below', 'left', 'right'],
        'above'
      )
    }
  }),
  { notes: { markdown: markdownText } }
);
