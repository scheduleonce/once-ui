import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiButtonModule,
  OuiIconModule,
  OuiIconRegistry
} from '../../../projects/ui/src/lib/oui';
import { text, select, boolean } from '@storybook/addon-knobs';
import markdownText from '../../../projects/ui/src/lib/oui/button/README.md';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { COLORS } from '../const';

@Component({
  selector: 'oui-icon-button-storybook',
  template: `
    <button
      oui-icon-button
      [disabled]="disabled"
      (click)="clicked()"
      [color]="color"
    >
      <oui-icon [svgIcon]="icon" [color]="color"></oui-icon>{{ text }}
    </button>
  `
})
export class OuiIconButtonStorybook {
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
        'https://s3.amazonaws.com/icomoon.io/135790/oncehub-20/symbol-defs.svg?nhbz3f'
      )
    );
  }
}

storiesOf('Button', module)
  .add(
    'Default',
    () => ({
      moduleMetadata: {
        imports: [OuiButtonModule],
        schemas: [],
        declarations: []
      },
      template: `<button oui-button [disabled]="disabled" (click)="clicked()" [color]="color">{{text}}</button>`,
      props: {
        color: select('color', COLORS, COLORS[0]),
        disabled: boolean('disabled', false),
        text: text('text', 'This is a button'),
        clicked: action('click')
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Link',
    () => ({
      moduleMetadata: {
        imports: [OuiButtonModule],
        schemas: [],
        declarations: []
      },
      template: `<button oui-link-button [disabled]="disabled" (click)="clicked()">{{text}}</button>`,
      props: {
        disabled: boolean('disabled', false),
        text: text('text', 'This is a button'),
        clicked: action('click')
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'ghost-button',
    () => ({
      moduleMetadata: {
        imports: [OuiButtonModule],
        schemas: [],
        declarations: []
      },
      template: `<button oui-ghost-button [disabled]="disabled" (click)="clicked()" [color]="color">{{text}}</button>`,
      props: {
        color: select('color', COLORS, COLORS[0]),
        disabled: boolean('disabled', false),
        text: text('text', 'This is a button'),
        clicked: action('click')
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'Progress',
    () => ({
      moduleMetadata: {
        imports: [OuiButtonModule],
        schemas: [],
        declarations: []
      },
      template: `<button
                  #progressButton
                  oui-button
                  progress
                  [color]="color"
                  [disabled]="isDisable"
                  (click)="clicked();progressButtonClick(progressButton)">
                  button
                </button>`,
      props: {
        color: select('color', COLORS, COLORS[0]),
        isDisable: boolean('disabled', false),
        text: text('text', 'This is a button'),
        clicked: action('click'),
        progressButtonClick: function(progressButton) {
          progressButton.setToProgress();
          action('set to progress', progressButton);
          setTimeout(() => {
            this.isDisable = false;
            progressButton.setToDone();
          }, 1000);
        }
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'icon-button',
    () => ({
      moduleMetadata: {
        imports: [OuiButtonModule, OuiIconModule],
        schemas: [],
        declarations: [OuiIconButtonStorybook]
      },
      component: OuiIconButtonStorybook,
      props: {
        color: select('color', COLORS, COLORS[0]),
        clicked: action('click'),
        icon: text('icon', 'notification-editor')
      }
    }),
    { notes: { markdown: markdownText } }
  );
