import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OuiIconRegistry } from '../../components';
@Component({
  selector: 'oui-tab-storybook',
  template: `<oui-tab-group>
  <oui-tab label="First"> Content 1 </oui-tab>
  <oui-tab label="Second"> Content 2 </oui-tab>
  <oui-tab label="Third"> Content 3 </oui-tab>
</oui-tab-group>`,
})
export class TabStorybook {
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
        'https://d1azc1qln24ryf.cloudfront.net/135790/oncehub-20/symbol-defs.svg?10k0w6'
      )
    );
  }
}
