import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiTooltipModule,
  OuiIconRegistry,
  OuiIconModule
} from '../../components';
import { text, select, boolean } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Input, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import markdownText from '../../components/tooltip/README.md';
import { TOOLTIPPOSITION } from '../const';

@Component({
  selector: 'oui-tooltip-storybook',
  template: `
    <oui-icon
      [svgIcon]="'help-library'"
      [ouiTooltip]="_ouiTooltip"
      [ouiTooltipPosition]="_ouiTooltipPosition"
      [color]="'primary'"
      [ouiTooltipDisabled]="disabled"
    ></oui-icon>
  `
})
export class OuiTooltipStorybook {
  @Input() disabled = false;
  @Input() _ouiTooltip = 'This is a tooltip';
  @Input() _ouiTooltipPosition = 'above';
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
  'Regular',
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
        TOOLTIPPOSITION,
        TOOLTIPPOSITION[0]
      )
    }
  }),
  { notes: { markdown: markdownText } }
);
