import {
  CdkTable,
  CDK_TABLE,
  STICKY_POSITIONING_LISTENER,
} from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

/**
 * NOTE: This directive was previously used to enable a recycle view repeater strategy
 * (reducing rendering latency). With Angular CDK 21 the repeater strategy provider/token
 * is no longer provided here, so this directive is currently a no-op and does not
 * change rendering behavior.
 *
 * Keep the directive in place for compatibility, but do not rely on it for performance
 * improvements. If you need a recycle strategy with CDK 21, provide the appropriate
 * strategy implementation via the CDK token in your application.
 *
 * @deprecated no-op as of CDK 21
 */
@Directive({
  selector: 'oui-table[recycleRows], table[oui-table][recycleRows]',
  standalone: false,
})
export class MatRecycleRows {}

/**
 * Wrapper for the CdkTable with Once-UI design styles.
 */
@Component({
  selector: 'oui-table, table[oui-table]',
  exportAs: 'ouiTable',
  template: `
    <ng-content select="caption"></ng-content>
    <ng-content select="colgroup, col"></ng-content>
    <ng-container headerRowOutlet></ng-container>
    <ng-container rowOutlet></ng-container>
    <ng-container noDataRowOutlet></ng-container>
    <ng-container footerRowOutlet></ng-container>
  `,
  styleUrls: ['table.scss'],
  host: {
    class: 'oui-table',
    '[class.oui-table-fixed-layout]': 'fixedLayout',
  },
  providers: [
    { provide: CdkTable, useExisting: OuiTable },
    { provide: CDK_TABLE, useExisting: OuiTable },
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
})
export class OuiTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected override stickyCssClass = 'oui-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement = false;
}
