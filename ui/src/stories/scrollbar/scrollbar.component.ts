import { Component, input } from '@angular/core';

@Component({
  selector: 'oui-scrollbar-text-storybook',
  template: `
    <div
      oui-scrollbar
      [oui-scrollbar-large]="large()"
      [style.height.px]="height()"
      class="content"
    >
      {{ text() }}
    </div>
  `,
  standalone: false,
})
export class OuiScrollbarTextStorybook {
  readonly large = input(false);
  readonly height = input(200);
  readonly text = input('This is a tooltip');
  contentHeight = 100;
  constructor() {}
}

@Component({
  selector: 'oui-scrollbar-list-storybook',
  template: `
    <div
      oui-scrollbar
      [oui-scrollbar-large]="large()"
      [style.height.px]="height()"
      class="content"
      >
      <ul class="scrollbar-list">
        @for (item of items(); track item) {
          <li>{{ item }}</li>
        }
      </ul>
    </div>
    `,
  standalone: false,
})
export class OuiScrollbarListStorybook {
  readonly large = input(false);
  readonly height = input(200);
  readonly items = input<string[]>([]);
  contentHeight = 100;
  constructor() {}
}
