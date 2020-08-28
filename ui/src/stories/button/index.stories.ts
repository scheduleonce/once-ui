import { action } from '@storybook/addon-actions';
import { OuiButtonModule, OuiIconModule } from '../../components';
import { text, select, boolean } from '@storybook/addon-knobs';
import { COLORS } from '../const';
import { OuiIconButtonStorybook } from './button.component';

export default {
  title: 'Button',
  component: OuiIconButtonStorybook,
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiButtonModule],
    schemas: [],
    declarations: [],
  },
  template: `<button oui-button [disabled]="disabled" (click)="clicked()" [color]="color">{{text}}</button>`,
  props: {
    color: select('color', COLORS, COLORS[0]),
    disabled: boolean('disabled', false),
    text: text('text', 'This is a button'),
    clicked: action('click'),
  },
});

export const Link = () => ({
  moduleMetadata: {
    imports: [OuiButtonModule],
    schemas: [],
    declarations: [],
  },
  template: `<button oui-link-button [disabled]="disabled" (click)="clicked()">{{text}}</button>`,
  props: {
    disabled: boolean('disabled', false),
    text: text('text', 'This is a button'),
    clicked: action('click'),
  },
});

export const Ghost = () => ({
  moduleMetadata: {
    imports: [OuiButtonModule],
    schemas: [],
    declarations: [],
  },
  template: `<button oui-ghost-button [disabled]="disabled" (click)="clicked()" [color]="color">{{text}}</button>`,
  props: {
    color: select('color', COLORS, COLORS[0]),
    disabled: boolean('disabled', false),
    text: text('text', 'This is a button'),
    clicked: action('click'),
  },
});

export const Progress = () => ({
  moduleMetadata: {
    imports: [OuiButtonModule],
    schemas: [],
    declarations: [],
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
    progressButtonClick: function (progressButton) {
      progressButton.setToProgress();
      action('set to progress', progressButton);
      setTimeout(() => {
        this.isDisable = false;
        progressButton.setToDone();
      }, 1000);
    },
  },
});

export const Icon = () => ({
  moduleMetadata: {
    imports: [OuiButtonModule, OuiIconModule],
    schemas: [],
    declarations: [OuiIconButtonStorybook],
  },
  component: OuiIconButtonStorybook,
  props: {
    color: select('color', COLORS, COLORS[0]),
    clicked: action('click'),
    icon: text('icon', 'notification-editor'),
  },
});
