import { Input, Component } from '@angular/core';

@Component({
    selector: 'oui-scrollbar-text-storybook',
    template: `
    <div
      oui-scrollbar
      [oui-scrollbar-large]="large"
      [style.height.px]="height"
      class="content"
    >
      {{ text }}
    </div>
  `,
    standalone: false
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
      oui-scrollbar
      [oui-scrollbar-large]="large"
      [style.height.px]="height"
      class="content"
    >
      <ul class="scrollbar-list">
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
    </div>
  `,
    standalone: false
})
export class OuiScrollbarListStorybook {
  @Input() large = false;
  @Input() height = 200;
  @Input() items: string[] = [];
  contentHeight = 100;
  constructor() {}
}
