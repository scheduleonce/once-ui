import { Component } from '@angular/core';

@Component({
  selector: 'oui-tab-storybook',
  template: `
    <oui-tab-group>
      <oui-tab label="First1" text="<h2>AAAAA123</h2>"></oui-tab>
      <oui-tab label="Second" text="<h2>BBBBB123</h2>"></oui-tab>
      <oui-tab label="Third" text="<h2>CCCCCC123</h2>"></oui-tab>
      <oui-tab label="Fourth" text="<h2>ddddddddddd123</h2>"></oui-tab>
      <oui-tab label="Fifth" text="<h2>eeeeeeee123</h2>"></oui-tab>
    </oui-tab-group>
  `,
})
export class MatTabStorybook {
  constructor() {}
}