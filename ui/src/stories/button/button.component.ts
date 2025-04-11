import { Component, Input } from '@angular/core';
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
      <oui-icon svgIcon="configuration" [color]="color"></oui-icon>{{ text }}
    </button>
  `,
  standalone: false,
})
export class OuiIconButtonStorybook {
  @Input() color: string;
  @Input() disabled: boolean;
  constructor(
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?81ot1f'
      )
    );
  }
}
