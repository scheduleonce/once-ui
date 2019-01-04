/**
 * Throws an exception for the case when menu trigger doesn't have a valid oui-menu instance
 * @docs-private
 */
export function throwOuiMenuMissingError() {
  throw Error(`ouiMenuTriggerFor: must pass in an oui-menu instance.
  
      Example:
        <oui-menu #menu="ouiMenu"></oui-menu>
        <button [ouiMenuTriggerFor]="menu"></button>`);
}

/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * @docs-private
 */
export function throwOuiMenuInvalidPositionX() {
  throw Error(`xPosition value must be either 'before' or after'.
        Example: <oui-menu xPosition="before" #menu="ouiMenu"></oui-menu>`);
}

/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * @docs-private
 */
export function throwOuiMenuInvalidPositionY() {
  throw Error(`yPosition value must be either 'above' or below'.
        Example: <oui-menu yPosition="above" #menu="ouiMenu"></oui-menu>`);
}
