import { Component } from '@angular/core';

@Component({
  selector: 'oui-tab-storybook',
  template: `
    <oui-tab-group>
      <oui-tab label="First1" text="<h2>Content in tab 1</h2>"></oui-tab>
      <oui-tab label="Second" text="<h2>Content in tab 2</h2>"></oui-tab>
      <oui-tab label="Third" text="<h2>Content in tab 3</h2>"></oui-tab>
    </oui-tab-group>
  `,
})
export class OuiTabStorybook {
  constructor() {}
}
