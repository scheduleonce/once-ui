import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * To modify the labels and text displayed, create a new instance of OuiPaginatorIntl and
 * include it in a custom provider
 */
@Injectable({ providedIn: 'root' })
export class OuiPaginatorIntl {
  /**
   * Stream to emit from when labels are changed. Use this to notify components when the labels have
   * changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** A label for the button that increments the current page. */
  nextPageLabel = 'Next page';

  /** A label for the button that decrements the current page. */
  previousPageLabel = 'Previous page';

  /** A label for the button that moves to the first page. */
  firstPageLabel = 'First page';

  /** A label for the button that moves to the last page. */
  lastPageLabel = 'Last page';
}

/** @docs-private */
export function OUI_PAGINATOR_INTL_PROVIDER_FACTORY(
  parentIntl: OuiPaginatorIntl
) {
  return parentIntl || new OuiPaginatorIntl();
}

/** @docs-private */
export const OUI_PAGINATOR_INTL_PROVIDER = {
  // If there is already an OuiPaginatorIntl available, use that. Otherwise, provide a new one.
  provide: OuiPaginatorIntl,
  deps: [[new Optional(), new SkipSelf(), OuiPaginatorIntl]],
  useFactory: OUI_PAGINATOR_INTL_PROVIDER_FACTORY,
};
