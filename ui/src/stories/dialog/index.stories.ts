import { action } from '@storybook/addon-actions';
import { OuiButtonModule, OuiDialogModule, OuiDialog } from '../../components';
import { boolean } from '@storybook/addon-knobs';
import { OuiDialogStorybook } from './dialog.component';

export default {
  title: 'Dialog',
  component: OuiDialog,
};

export const Regular = () => ({
  moduleMetadata: {
    imports: [OuiButtonModule, OuiDialogModule],
    schemas: [],
    declarations: [OuiDialogStorybook],
  },
  template: `<oui-dialog-storybook [disabled]="disabled" (click)="click($event)" (close)="close($event)"></oui-dialog-storybook>`,
  props: {
    click: action('clicked'),
    close: action('closed'),
    disabled: boolean('disabled', false),
  },
});
