import { ConnectedPosition } from '@angular/cdk/overlay';

export type PanelPositionX = 'before' | 'after';

export type PanelPositionY = 'above' | 'below';

const PANEL_OFFSET_X = 28;
const PANEL_OFFSET_Y = 34;

export class PanelFlexiblePosition {
  private _afterAbove: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    }
  ];
  private _afterBelow: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    }
  ];
  private _beforeAbove: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    }
  ];
  private _beforeBelow: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: -PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: -PANEL_OFFSET_X
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: PANEL_OFFSET_Y,
      offsetX: PANEL_OFFSET_X
    }
  ];
  private _xPosition: PanelPositionX;
  private _yPosition: PanelPositionY;

  constructor(xPosition: PanelPositionX, yPosition: PanelPositionY) {
    this._xPosition = xPosition;
    this._yPosition = yPosition;
  }

  getPosition(): ConnectedPosition[] {
    if (this._xPosition === 'after' && this._yPosition === 'above') {
      return this._afterAbove;
    }
    if (this._xPosition === 'after' && this._yPosition === 'below') {
      return this._afterBelow;
    }
    if (this._xPosition === 'before' && this._yPosition === 'above') {
      return this._beforeAbove;
    }
    if (this._xPosition === 'before' && this._yPosition === 'below') {
      return this._beforeBelow;
    }
  }
}
