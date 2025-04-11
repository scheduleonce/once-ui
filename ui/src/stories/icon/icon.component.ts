import { OuiIconRegistry } from '../../components';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'oui-icon-storybook',
  template: `
    <oui-icon
      [svgIcon]="icon"
      [size]="size"
      [color]="color"
      [style.width.px]="size"
      [style.height.px]="size"
    ></oui-icon>
  `,
  standalone: false,
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
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?5df5gz'
      )
    );
  }
}
