import { EventEmitter, TemplateRef, InjectionToken } from '@angular/core';
import { PanelPositionX, PanelPositionY } from './panel-positions';
import { OuiPanelContent } from './panel-content';
import { Observable, Subject } from 'rxjs';

/**
 * Injection token used to provide the parent menu to menu-specific components.
 * @docs-private
 */
export const OUI_PANEL_OVERLAY = new InjectionToken<OuiPanelOverlay>(
  'OUI_PANEL_OVERLAY'
);

/**
 * Interface for a custom menu panel that can be used with `ouiMenuTriggerFor`.
 * @docs-private
 */
export interface OuiPanelOverlay {
  xPosition: PanelPositionX;
  yPosition: PanelPositionY;
  templateRef: TemplateRef<any>;
  closed: EventEmitter<void>;
  setPositionClasses?: (x: PanelPositionX, y: PanelPositionY) => void;
  lazyContent?: OuiPanelContent;
  mouseLeave: Observable<MouseEvent>;
  mouseEnter: Observable<MouseEvent>;
  escapeEvent: Subject<void>;
}
