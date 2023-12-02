import { Component } from '@angular/core';

@Component({
  selector: 'mat-tab-storybook',
  template: `
    <mat-tab-group>
      <mat-tab label="First1" text="<h2>AAAAA123</h2>"></mat-tab>
      <mat-tab label="Second" text="<h2>BBBBB123</h2>"></mat-tab>
      <mat-tab label="Third" text="<h2>CCCCCC123</h2>"></mat-tab>
      <mat-tab label="Fourth" text="<h2>ddddddddddd123</h2>"></mat-tab>
      <mat-tab label="Fifth" text="<h2>eeeeeeee123</h2>"></mat-tab>
    </mat-tab-group>
  `,
})
export class MatTabStorybook {
  constructor() {}
}