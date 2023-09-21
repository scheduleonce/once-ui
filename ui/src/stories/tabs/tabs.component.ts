import { Component } from '@angular/core';

@Component({
  selector: 'mat-tab-storybook',
  template: `
    <mat-tab-group>
      <mat-tab label="First1" text="<h2>AAAAAAAAAAAAAAAAAAAA</h2>"></mat-tab>
      <mat-tab label="Second" text="<h2>BBBBBBBBBBBBBBBBBBBB</h2>"></mat-tab>
      <mat-tab label="Third" text="<h2>CCCCCCCCCCCCCCCCCCCC</h2>"></mat-tab>
    </mat-tab-group>
  `,
})
export class MatTabStorybook {
  constructor() {}
}