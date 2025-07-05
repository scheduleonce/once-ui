import { OuiButtonModule, OuiDialog, OuiDialogModule } from '../../components';
import { action } from 'storybook/actions';
import { THEME } from '../const';
import { OuiDialogStorybook } from './dialog.component';

export default {
  title: 'Dialog',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiButtonModule, OuiDialogModule],
      schemas: [],
      declarations: [OuiDialogStorybook],
    },

    template: `<oui-dialog-storybook [disabled]="disabled" ngClass="{{theme}}" (click)="click($event)" (close)="close($event)"></oui-dialog-storybook>`,

    props: {
      ...props,
      close: action('closed'),
      click: action('clicked'),
    },
  }),

  name: 'regular',
  height: '300px',

  parameters: {
    docs: {
      source: {
        code: `<button oui-button (click)="openDialog()">Open</button>`,
      },
    },
  },

  args: {
    theme: THEME[0],
    disabled: false,
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },
  },
};
