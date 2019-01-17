import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiButtonModule,
  OuiIconModule
} from '../../../projects/ui/src/lib/oui';
import { OuiIconRegistry } from '../../../projects/ui/src/lib/oui';
import {
  withKnobs,
  text,
  select,
  boolean,
  number
} from '@storybook/addon-knobs';

storiesOf('Button', module)
  .add('Default', () => ({
    moduleMetadata: {
      imports: [OuiButtonModule, OuiIconModule],
      schemas: [],
      declarations: []
    },
    template: `<button oui-button [color]="color">{{text}}</button>`,
    props: {
      changed: action('change'),
      color: select('color', ['primary', 'accent', 'warn'], 'primary'),
      disabled: boolean('disabled', false),
      text: text('text', 'This is a button')
    }
  }))
  .add('Link', () => ({
    moduleMetadata: {
      imports: [OuiButtonModule],
      schemas: [],
      declarations: []
    },
    template: `<button oui-link-button [color]="color">{{text}}</button>`,
    props: {
      changed: action('change'),
      color: select('color', ['primary', 'accent', 'warn'], 'primary'),
      disabled: boolean('disabled', false),
      text: text('text', 'This is a button')
    }
  }))
  .add('Progress', () => ({
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
                  (click)="progressButtonClick(progressButton)">
                  button
                </button>`,
    props: {
      color: select('color', ['primary', 'accent', 'warn'], 'primary'),
      isDisable: boolean('disabled', false),
      text: text('text', 'This is a button'),
      progressButtonClick:function(progressButton) {
        progressButton.setToProgress();
        action("set to progress",progressButton);
        setTimeout(() => {
          progressButton.setToDone();
          action("set to done",progressButton);
          this.isDisable = true;
          action("set to disabled",progressButton);
        }, 1000);
      }
    }
  }));
