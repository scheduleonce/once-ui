import { storiesOf } from '@storybook/angular';
import {
  OuiIconModule,
  OuiMenuModule,
  OuiIconRegistry,
  OuiButtonModule
} from '../../../projects/ui/src/lib/oui';
import { select } from '@storybook/addon-knobs';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

import '../../../node_modules/@angular/cdk/overlay-prebuilt.css';
import markdownText from '../../../projects/ui/src/lib/oui/menu/README.md';

const icons = [
  'local',
  'notification-editor',
  'resourcepool',
  'calendar',
  'help-library',
  'configuration',
  'edit',
  'duplicate',
  'trash',
  'search'
];

@Component({
  selector: 'oui-menu-storybook',
  template: `
    <oui-icon
      [svgIcon]="'dots-vertical'"
      [ouiMenuTriggerFor]="afterAboveMenu"
      [color]="'primary'"
      style="margin-top:250px;margin-left:200px;"
    ></oui-icon>
    <oui-menu #afterAboveMenu [xPosition]="xPosition" [yPosition]="yPosition">
      <button oui-menu-item>
        <oui-icon svgIcon="edit"></oui-icon>
        <span>Edit</span>
      </button>
      <button oui-menu-item>
        <oui-icon svgIcon="calendar"></oui-icon>
        <span>Schedule</span>
      </button>
      <button oui-menu-item>
        <oui-icon svgIcon="configuration"></oui-icon>
        <span>Configuration</span>
      </button>
    </oui-menu>
  `
})
export class OuiMenuStorybook {
  @Input() xPosition: string = 'before';
  @Input() yPosition: string = 'above';
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

@Component({
  selector: 'oui-nested-menu-storybook',
  template: `
    <oui-icon
      [svgIcon]="'dots-vertical'"
      [ouiMenuTriggerFor]="rootMenu"
      [color]="'primary'"
      style="margin-top:250px;margin-left:200px;"
    ></oui-icon>
    <oui-menu
      [xPosition]="xPosition"
      [yPosition]="yPosition"
      #rootMenu="ouiMenu"
    >
      <button oui-menu-item [ouiMenuTriggerFor]="subMenu">Power</button>
      <button oui-menu-item [ouiMenuTriggerFor]="subMenu">
        System settings
      </button>
    </oui-menu>

    <oui-menu #subMenu="ouiMenu">
      <button oui-menu-item>Shut down</button>
      <button oui-menu-item>Restart</button>
      <button oui-menu-item>Hibernate</button>
    </oui-menu>
  `
})
export class OuiNestedMenuStorybook {
  @Input() xPosition: string = 'before';
  @Input() yPosition: string = 'above';
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

storiesOf('Menu', module)
  .add(
    'default',
    () => ({
      moduleMetadata: {
        imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
        schemas: [],
        declarations: [OuiMenuStorybook]
      },
      template: `<oui-menu-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition">
            </oui-menu-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosotion', ['above', 'below'], 'above')
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'nested Menu',
    () => ({
      moduleMetadata: {
        imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
        schemas: [],
        declarations: [OuiNestedMenuStorybook]
      },
      template: `<oui-nested-menu-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition">
            </oui-nested-menu-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosotion', ['above', 'below'], 'above')
      }
    }),
    { notes: { markdown: markdownText } }
  );
