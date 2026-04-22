import { OuiIconRegistry } from '../../components';
import { Component, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'oui-tooltip-storybook',
  template: `
    <oui-icon
      [svgIcon]="'help-library'"
      [ouiTooltip]="_ouiTooltip()"
      [ouiTooltipPosition]="_ouiTooltipPosition()"
      [color]="'primary'"
      [ouiTooltipDisabled]="disabled()"
    ></oui-icon>
  `,
  standalone: false,
})
export class OuiTooltipStorybook {
  private ouiIconRegistry = inject(OuiIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  readonly disabled = input(false);
  readonly _ouiTooltip = input('This is a tooltip');
  readonly _ouiTooltipPosition = input('above');

  constructor() {
    this.ouiIconRegistry.addSvgIcon(
      `local`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/v-green.svg`
      )
    );

    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?v7tuaj'
      )
    );
  }
}
