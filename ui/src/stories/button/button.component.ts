import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OuiIconRegistry } from '../../components';
@Component({
  selector: 'oui-icon-button-storybook',
  template: `
    <button
      oui-icon-button
      [disabled]="disabled"
      (click)="clicked()"
      [color]="color"
    >
      <oui-icon [svgIcon]="icon" [color]="color"></oui-icon>{{ text }}
    </button>
  `,
})
export class OuiIconButtonStorybook {
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
