import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OuiIconRegistry } from '../../components';

@Component({
  selector: 'oui-tab-storybook',
  template: `
    <nav oui-tab-nav-bar oui-align-tabs="start">
      <a
        oui-tab-link
        (click)="onTabChange('first')"
        (keyup.enter)="onTabChange('first')"
        (keyup.space)="onTabChange('first')"
        class="hover:tw-no-underline focus:tw-no-underline !tw-pt-[14px]"
        [ngClass]="{
          active: selectedTab === 'first'
        }"
      >
        Tab 1
      </a>
      <a
        oui-tab-link
        (click)="onTabChange('second')"
        (keyup.enter)="onTabChange('second')"
        (keyup.space)="onTabChange('second')"
        class="hover:tw-no-underline focus:tw-no-underline !tw-pt-[14px]"
        [ngClass]="{
          active: selectedTab === 'second'
        }"
      >
        Tab 2
      </a>
    </nav>

    <ng-container [ngSwitch]="selectedTab">
      <ng-container *ngSwitchCase="'first'">
        <oui-icon svgIcon="preview"></oui-icon>
        First tab selected
      </ng-container>
      <ng-container *ngSwitchCase="'second'">
        Second tab selected
      </ng-container>
    </ng-container>
  `,
  standalone: false,
})
export class OuiTabStorybook {
  private ouiIconRegistry = inject(OuiIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  selectedTab = 'first';

  constructor() {
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?81ot1f'
      )
    );
  }

  onTabChange(id: string) {
    this.selectedTab = id;
  }
}
