import { OuiIconRegistry } from '../../components';
import { Input, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
  `,
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
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?dfx71h'
      )
    );
  }
}
