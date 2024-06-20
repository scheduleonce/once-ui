import {
  OuiIconModule,
  OuiButtonModule,
  OuiMenuModule,
  OuiMenu,
} from '../../components';
import { OverlayModule } from '@angular/cdk/overlay';
import { action } from '@storybook/addon-actions';
import { LABELPOSITION, COLORS, ICON_COLORS } from '../const';
import { OuiMenuStorybook, OuiNestedMenuStorybook } from './menu.component';

export default {
  title: 'Menu',
};

export const Default = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
      schemas: [],
      declarations: [OuiMenuStorybook],
    },

    template: `<oui-menu-storybook
          [xPosition]="xPosition"
          [yPosition]="yPosition"
          [vertical]="vertical"
          [hasBackdrop]="hasBackdrop"
          (_opened)="menuOpened($event)"
          (_closed)="menuClosed($event)"
          >
          </oui-menu-storybook>`,

    props: {
      ...props,
      menuOpened: action('menuOpened'),
      menuClosed: action('menuClosed'),
    },
  }),

  name: 'Default',
  height: '200px',

  parameters: {
    docs: {
      source: {
        code: `<button oui-icon-button [ouiMenuTriggerFor]="afterAboveMenu">
    <oui-icon svgIcon="dots-horizontal"></oui-icon>
</button>
<oui-menu #afterAboveMenu xPosition="after" yPosition="above">
    <button oui-menu-item>
        <oui-icon svgIcon="edit"></oui-icon>
        <span>Edit</span>
    </button>
    <button oui-menu-item>
        <oui-icon svgIcon="calendar"></oui-icon>
        <span>Schedule</span>
    </button>
    <button oui-menu-item>
        <oui-icon svgIcon="configuration"></oui-icon>
        <span>Configuration</span>
    </button>
</oui-menu>`,
      },
    },
  },

  args: {
    xPosition: 'before',
    yPosition: 'above',
    vertical: false,
    hasBackdrop: true,
  },

  argTypes: {
    xPosition: {
      options: ['before', 'after'],

      control: {
        type: 'select',
      },
    },

    yPosition: {
      options: ['above', 'below'],

      control: {
        type: 'select',
      },
    },
  },
};

export const NestedMenu = {
  render: (props) => ({
    moduleMetadata: {
      imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
      schemas: [],
      declarations: [OuiNestedMenuStorybook],
    },

    template: `<oui-nested-menu-storybook
          [xPosition]="xPosition"
          [yPosition]="yPosition"
          [vertical]="vertical"
          [hasBackdrop]="hasBackdrop"
          (_opened)="menuOpened($event)"
          (_closed)="menuClosed($event)"
          >
          </oui-nested-menu-storybook>`,

    props: {
      ...props,
      menuOpened: action('menuOpened'),
      menuClosed: action('menuClosed'),
    },
  }),

  name: 'Nested Menu',
  height: '200px',

  parameters: {
    docs: {
      source: {
        code: `<button oui-icon-button [ouiMenuTriggerFor]="rootMenu">
    <oui-icon svgIcon="dots-horizontal"></oui-icon>
</button>
<oui-menu #rootMenu="ouiMenu">
    <button oui-menu-item [ouiMenuTriggerFor]="subMenu">Power</button>
    <button oui-menu-item [ouiMenuTriggerFor]="subMenu">
      System settings
    </button>
</oui-menu>
<oui-menu #subMenu="ouiMenu">
    <button oui-menu-item>Shut down</button>
    <button oui-menu-item>Restart</button>
    <button oui-menu-item>Hibernate</button>
</oui-menu>`,
      },
    },
  },

  args: {
    xPosition: 'before',
    yPosition: 'above',
    vertical: false,
    hasBackdrop: true,
  },

  argTypes: {
    xPosition: {
      options: ['before', 'after'],

      control: {
        type: 'select',
      },
    },

    yPosition: {
      options: ['above', 'below'],

      control: {
        type: 'select',
      },
    },
  },
};
