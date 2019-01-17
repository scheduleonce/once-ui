import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiIconModule,
  OuiMenuModule,
  OuiIconRegistry,
  OuiButtonModule
} from '../../../projects/ui/src/lib/oui';
import {
  withKnobs,
  text,
  select,
  boolean,
  number
} from '@storybook/addon-knobs';
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

import '../../../node_modules/@angular/cdk/overlay-prebuilt.css';

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
      [svgIcon]="icon"
      [ouiMenuTriggerFor]="afterAboveMenu"
      [color]="color"
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
  @Input() icon: string = 'notification-editor';
  @Input() color: string = 'primary';
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
      [svgIcon]="icon"
      [ouiMenuTriggerFor]="rootMenu"
      [color]="color"
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
  @Input() icon: string = 'notification-editor';
  @Input() color: string = 'primary';
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
  .add('default', () => ({
    moduleMetadata: {
      imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
      schemas: [],
      declarations: [OuiMenuStorybook]
    },
    template: `<oui-menu-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition"
              [color]="color"
              [icon]="icon">
            </oui-menu-storybook>`,
    props: {
      color: select('color', ['primary', 'accent', 'warn'], 'primary'),
      xPosition: select('xPosition', ['before', 'after'], 'before'),
      yPosition: select('yPosotion', ['above', 'below'], 'above'),
      icon: select('icon', icons, 'notification-editor')
    }
  }))
  .add('nested Menu', () => ({
    moduleMetadata: {
      imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
      schemas: [],
      declarations: [OuiNestedMenuStorybook]
    },
    template: `<oui-nested-menu-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition"
              [color]="color"
              [icon]="icon">
            </oui-nested-menu-storybook>`,
    props: {
      color: select('color', ['primary', 'accent', 'warn'], 'primary'),
      xPosition: select('xPosition', ['before', 'after'], 'before'),
      yPosition: select('yPosotion', ['above', 'below'], 'above'),
      icon: select('icon', icons, 'notification-editor')
    }
  }));
