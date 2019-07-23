import { storiesOf } from '@storybook/angular';
import {
  OuiIconModule,
  OuiMenuModule,
  OuiIconRegistry,
  OuiButtonModule
} from '../../../projects/ui/src/lib/oui';
import { select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

// import '../../../node_modules/@angular/cdk/overlay-prebuilt.css';
import markdownText from '../../../projects/ui/src/lib/oui/menu/README.md';

@Component({
  selector: 'oui-menu-storybook',
  template: `
    <div style="display:inline-block">
      <oui-menu-icon
        [ouiMenuTriggerFor]="afterAboveMenu"
        (menuOpened)="opened()"
        (menuClosed)="closed($event)"
        [vertical]="vertical"
      >
      </oui-menu-icon>
    </div>
    <oui-menu
      #afterAboveMenu
      [hasBackdrop]="hasBackdrop"
      [xPosition]="xPosition"
      (closed)="closed($event)"
      [yPosition]="yPosition"
    >
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
  @Input() vertical: boolean = false;
  @Input() hasBackdrop: boolean = true;

  @Output()
  readonly _closed: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _opened: EventEmitter<void> = new EventEmitter<void>();
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
  opened() {
    this._opened.emit();
  }
  closed(e) {
    this._closed.emit(e);
  }
}

@Component({
  selector: 'oui-nested-menu-storybook',
  template: `
    <div style="display:inline-block">
      <oui-menu-icon
        [ouiMenuTriggerFor]="rootMenu"
        (click)="triggerClick()"
        (menuOpened)="opened()"
        (menuClosed)="closed()"
        [vertical]="vertical"
      >
      </oui-menu-icon>
    </div>
    <oui-menu
      [xPosition]="xPosition"
      [hasBackdrop]="hasBackdrop"
      [yPosition]="yPosition"
      (closed)="closed($event)"
      #rootMenu="ouiMenu"
    >
      <button oui-menu-item [ouiMenuTriggerFor]="subMenu">Power</button>
      <button oui-menu-item [ouiMenuTriggerFor]="subMenu">
        System settings
      </button>
    </oui-menu>

    <oui-menu (closed)="closed($event)" #subMenu="ouiMenu">
      <button oui-menu-item>Shut down</button>
      <button oui-menu-item>Restart</button>
      <button oui-menu-item>Hibernate</button>
    </oui-menu>
  `
})
export class OuiNestedMenuStorybook {
  @Input() xPosition: string = 'before';
  @Input() yPosition: string = 'above';
  @Input() vertical: boolean = false;
  @Input() hasBackdrop: boolean = true;
  @Output()
  readonly _closed: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly _opened: EventEmitter<void> = new EventEmitter<void>();
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
  opened() {
    this._opened.emit();
  }
  closed(e) {
    this._closed.emit(e);
  }
}

storiesOf('Menu', module)
  .add(
    'Regular',
    () => ({
      moduleMetadata: {
        imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
        schemas: [],
        declarations: [OuiMenuStorybook]
      },
      template: `<oui-menu-storybook
          [xPosition]="xPosition"
          [yPosition]="yPosition"
          [vertical]="vertical"
          [hasBackdrop]="hasBackdrop"
          (_opened)="menuOpened($event)"
          (_closed)="menuClosed($event)"
          >
          </oui-menu-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosition', ['above', 'below'], 'above'),
        vertical: boolean('vertical', false),
        menuOpened: action('menuOpened'),
        hasBackdrop: boolean('hasBackdrop', true),
        menuClosed: action('menuClosed')
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Nested menu',
    () => ({
      moduleMetadata: {
        imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
        schemas: [],
        declarations: [OuiNestedMenuStorybook]
      },
      template: `<oui-nested-menu-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition"
  [hasBackdrop]="hasBackdrop"
  (_opened)="menuOpened($event)"
  (_closed)="menuClosed($event)"
  [vertical]="vertical">
            </oui-nested-menu-storybook>`,
      props: {
        xPosition: select('xPosition', ['before', 'after'], 'before'),
        yPosition: select('yPosition', ['above', 'below'], 'above'),
        vertical: boolean('vertical', false),
        hasBackdrop: boolean('hasBackdrop', true),
        menuOpened: action('menuOpened'),
        menuClosed: action('menuClosed')
      }
    }),
    { notes: { markdown: markdownText } }
  );
