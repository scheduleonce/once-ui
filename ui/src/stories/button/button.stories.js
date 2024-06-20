import { OuiButtonModule, OuiIconModule } from '../../components';
import { action } from '@storybook/addon-actions';
import { COLORS, THEME } from '../const';
import { OuiIconButtonStorybook } from './button.component';

export default {
  title: 'Button',
};

export const Regular = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiButtonModule],
      schemas: [],
      declarations: [],
    },

    template: `<button oui-button [disabled]="disabled" (click)="clicked()" [color]="color" ngClass="{{theme}}">{{text}}</button>`,

    props: {
      ...props,
      clicked: action('click'),
    },
  }),

  name: 'Regular',

  parameters: {
    docs: {
      source: {
        code: `<button oui-button color="primary">Primary</button>`,
      },
    },
  },

  args: {
    theme: THEME[0],
    color: COLORS[0],
    disabled: false,
    text: 'This is a button',
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },
  },
};

export const Link = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiButtonModule],
      schemas: [],
      declarations: [],
    },

    template: `<button oui-link-button [disabled]="disabled" (click)="clicked()">{{text}}</button>`,
    props,
  }),

  name: 'Link',

  parameters: {
    docs: {
      source: {
        code: `<button oui-link-button color="primary">Primary</button>`,
      },
    },
  },

  args: {
    disabled: false,
    text: 'This is a button',
  },
};

export const Ghost = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiButtonModule],
      schemas: [],
      declarations: [],
    },

    template: `<button oui-ghost-button [disabled]="disabled" ngClass="{{theme}}" (click)="clicked()" [color]="color">{{text}}</button>`,

    props: {
      ...props,
      clicked: action('click'),
    },
  }),

  name: 'Ghost',

  parameters: {
    docs: {
      source: {
        code: `<button oui-ghost-button color="primary">Primary</button>`,
      },
    },
  },

  args: {
    theme: THEME[0],
    color: COLORS[0],
    disabled: false,
    text: 'This is a button',
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },
  },
};

export const Progress = {
  render: (props) => ({
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
                  [disabled]="disabled"
                  ngClass="{{theme}}"
                  (click)="clicked();progressButtonClick(progressButton)">
                  button
                </button>`,

    props: {
      ...props,
      clicked: action('click'),

      progressButtonClick: function (progressButton) {
        progressButton.setToProgress();
        action('set to progress', progressButton);

        setTimeout(() => {
          this.disabled = false;
          progressButton.setToDone();
        }, 1000);
      },
    },
  }),

  name: 'Progress',

  parameters: {
    docs: {
      source: {
        code: `<button #progressButton oui-button [progress]="['Discard','Discarding...','Discarded']"></button>`,
      },
    },
  },

  args: {
    theme: THEME[0],
    color: COLORS[0],
    disabled: false,
    text: 'This is a button',
  },

  argTypes: {
    theme: {
      options: THEME,

      control: {
        type: 'select',
      },
    },

    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },
  },
};

export const Icon = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiButtonModule, OuiIconModule],
      schemas: [],
      declarations: [OuiIconButtonStorybook],
    },

    template: `<oui-icon-button-storybook></oui-icon-button-storybook>`,

    props: {
      ...props,
      clicked: action('click'),
    },
  }),

  name: 'Icon',

  parameters: {
    docs: {
      source: {
        code: `<button oui-icon-button><oui-icon svgIcon="configuration"></oui-icon></button>`,
      },
    },
  },

  args: {
    color: COLORS[0],
    icon: 'configuration',
  },

  argTypes: {
    color: {
      options: COLORS,

      control: {
        type: 'select',
      },
    },
  },
};
