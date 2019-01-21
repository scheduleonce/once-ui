import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiButtonModule,
  OuiIconModule
} from '../../../projects/ui/src/lib/oui';
import { text, select, boolean } from '@storybook/addon-knobs';
import markdownText from '../../../projects/ui/src/lib/oui/button/README.md';

storiesOf('Button', module)
  .add(
    'Default',
    () => ({
      moduleMetadata: {
        imports: [OuiButtonModule, OuiIconModule],
        schemas: [],
        declarations: []
      },
      template: `<button oui-button [disabled]="disabled" (click)="clicked()" [color]="color">{{text}}</button>`,
      props: {
        changed: action('change'),
        color: select('color', ['primary', 'accent', 'warn'], 'primary'),
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
        changed: action('change'),
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
                  [disabled]="isDisable"
                  (click)="clicked();progressButtonClick(progressButton)">
                  button
                </button>`,
      props: {
        color: select('color', ['primary', 'accent', 'warn'], 'primary'),
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
  );
