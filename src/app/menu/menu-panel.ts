
import {EventEmitter, TemplateRef, InjectionToken} from '@angular/core';
import {MenuPositionX, MenuPositionY} from './menu-positions';
import {Direction} from '@angular/cdk/bidi';
import {FocusOrigin} from '@angular/cdk/a11y';
import {OuiMenuContent} from './menu-content';

/**
 * Injection token used to provide the parent menu to menu-specific components.
 * @docs-private
 */
export const OUI_MENU_PANEL = new InjectionToken<OuiMenuPanel>('OUI_MENU_PANEL');

/**
 * Interface for a custom menu panel that can be used with `ouiMenuTriggerFor`.
 * @docs-private
 */
export interface OuiMenuPanel<T = any> {
  xPosition: MenuPositionX;
  yPosition: MenuPositionY;
  overlapTrigger: boolean;
  templateRef: TemplateRef<any>;
  close: EventEmitter<void | 'click' | 'keydown' | 'tab'>;
  parentMenu?: OuiMenuPanel | undefined;
  direction?: Direction;
  focusFirstItem: (origin?: FocusOrigin) => void;
  resetActiveItem: () => void;
  setPositionClasses?: (x: MenuPositionX, y: MenuPositionY) => void;
  setElevation?(depth: number): void;
  lazyContent?: OuiMenuContent;
  backdropClass?: string;
  hasBackdrop?: boolean;
  addItem?: (item: T) => void;
  removeItem?: (item: T) => void;
}
