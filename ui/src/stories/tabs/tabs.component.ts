import { Component } from '@angular/core';

@Component({
  selector: 'oui-tab-storybook',
  template: `
    <oui-tab-group oui-stretch-tabs="true">
      <oui-tab label="First1"><h2>Content in tab 1</h2></oui-tab>
      <oui-tab label="Second"><h2>Content in tab 2</h2></oui-tab>
      <oui-tab label="Third"><h2>Content in tab 3</h2></oui-tab>
    </oui-tab-group>
  `,
})
export class OuiTabStorybook {
  constructor() {}
}
