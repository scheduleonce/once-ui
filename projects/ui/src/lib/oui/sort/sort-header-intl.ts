import { Injectable, SkipSelf, Optional } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * To modify the labels and text displayed, create a new instance of OuiSortHeaderIntl and
 * include it in a custom provider.
 */
@Injectable({ providedIn: 'root' })
export class OuiSortHeaderIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** ARIA label for the sorting button. */
  sortButtonLabel = (id: string) => {
    return `Change sorting for ${id}`;
  };
}
/** @docs-private */
export function OUI_SORT_HEADER_INTL_PROVIDER_FACTORY(
  parentIntl: OuiSortHeaderIntl
) {
  return parentIntl || new OuiSortHeaderIntl();
}

/** @docs-private */
export const OUI_SORT_HEADER_INTL_PROVIDER = {
  // If there is already an OuiSortHeaderIntl available, use that. Otherwise, provide a new one.
  provide: OuiSortHeaderIntl,
  deps: [[new Optional(), new SkipSelf(), OuiSortHeaderIntl]],
  useFactory: OUI_SORT_HEADER_INTL_PROVIDER_FACTORY
};
