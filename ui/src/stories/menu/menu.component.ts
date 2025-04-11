import { OuiIconRegistry } from '../../components';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
  `,
  standalone: false,
})
export class OuiMenuStorybook {
  @Input() xPosition = 'before';
  @Input() yPosition = 'above';
  @Input() vertical = false;
  @Input() hasBackdrop = true;

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
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?81ot1f'
      )
    );
  }
  opened() {
    this._opened.emit();
  }
  closed(e: string) {
    this._closed.emit(e);
  }
}

@Component({
  selector: 'oui-nested-menu-storybook',
  template: `
    <div style="display:inline-block">
      <oui-menu-icon
        [ouiMenuTriggerFor]="rootMenu"
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
  `,
  standalone: false,
})
export class OuiNestedMenuStorybook {
  @Input() xPosition = 'before';
  @Input() yPosition = 'above';
  @Input() vertical = false;
  @Input() hasBackdrop = true;
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
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?81ot1f'
      )
    );
  }
  opened() {
    this._opened.emit();
  }
  closed(e: string) {
    this._closed.emit(e);
  }
}
