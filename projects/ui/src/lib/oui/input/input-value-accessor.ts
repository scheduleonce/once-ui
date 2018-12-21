import { InjectionToken } from '@angular/core';

/**
 * This token is used to inject the object whose value should be set into `OuiInput`. If none is
 * provided, the native `HTMLInputElement` is used.
 */
export const OUI_INPUT_VALUE_ACCESSOR = new InjectionToken<{ value: any }>(
  'OUI_INPUT_VALUE_ACCESSOR'
);
