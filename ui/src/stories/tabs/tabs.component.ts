import { Input, Component } from '@angular/core';

@Component({
  selector: 'oui-tabs-storybook',
  template: `
    <div
      oui-scrollbar
      [style.height.px]="height"
      class="content"
    >
      {{ text }}
    </div>
  `,
})
export class OuiScrollbarTextStorybook {
  @Input() large = false;
  @Input() height = 200;
  @Input() text = 'This is a tooltip';
  contentHeight = 100;
  constructor() {}
}

@Component({
  selector: 'oui-scrollbar-list-storybook',
  template: `
    <div
      oui-tab
      class="content"
    >
      <ul class="scrollbar-list">
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
    </div>
  `,
})
export class OuiScrollbarListStorybook {
  @Input() large = false;
  @Input() height = 200;
  @Input() items: string[] = [];
  contentHeight = 100;
  constructor() {}
}
