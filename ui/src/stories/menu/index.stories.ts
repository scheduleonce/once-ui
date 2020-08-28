import {
  OuiIconModule,
  OuiMenuModule,
  OuiButtonModule,
  OuiMenu,
} from '../../components';
import { select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { OverlayModule } from '@angular/cdk/overlay';
import { OuiMenuStorybook, OuiNestedMenuStorybook } from './menu.component';

export default {
  title: 'Menu',
  component: OuiMenu,
};

export const Regular = () => ({
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
    xPosition: select('xPosition', ['before', 'after'], 'before'),
    yPosition: select('yPosition', ['above', 'below'], 'above'),
    vertical: boolean('vertical', false),
    menuOpened: action('menuOpened'),
    hasBackdrop: boolean('hasBackdrop', true),
    menuClosed: action('menuClosed'),
  },
});

export const Nested = () => ({
  moduleMetadata: {
    imports: [OuiIconModule, OuiButtonModule, OuiMenuModule, OverlayModule],
    schemas: [],
    declarations: [OuiNestedMenuStorybook],
  },
  template: `<oui-nested-menu-storybook
  [xPosition]="xPosition"
  [yPosition]="yPosition"
  [hasBackdrop]="hasBackdrop"
  (_opened)="menuOpened($event)"
  (_closed)="menuClosed($event)"
  [vertical]="vertical">
            </oui-nested-menu-storybook>`,
  props: {
    xPosition: select('xPosition', ['before', 'after'], 'before'),
    yPosition: select('yPosition', ['above', 'below'], 'above'),
    vertical: boolean('vertical', false),
    hasBackdrop: boolean('hasBackdrop', true),
    menuOpened: action('menuOpened'),
    menuClosed: action('menuClosed'),
  },
});
