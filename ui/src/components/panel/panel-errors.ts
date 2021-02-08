/**
 * Throws an exception for the case when panel's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 *
 * @docs-private
 */
export function throwOuiPanelInvalidPositionX() {
  throw Error(`xPosition value must be either 'before' or after'.
          Example: <oui-panel xPosition="before" #panel="ouiPanel"></oui-panel>`);
}

/**
 * Throws an exception for the case when panel's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 *
 * @docs-private
 */
export function throwOuiPanelInvalidPositionY() {
  throw Error(`yPosition value must be either 'above' or below'.
          Example: <oui-panel yPosition="above" #panel="ouiPanel"></oui-panel>`);
}
