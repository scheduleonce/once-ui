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
import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';

/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
@Directive({
  selector: 'oui-table[recycleRows], table[oui-table][recycleRows]',
  providers: [
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _RecycleViewRepeaterStrategy,
    },
  ],
  standalone: false,
})
export class MatRecycleRows {}

/**
 * Wrapper for the CdkTable with Once-UI design styles.
 */
@Component({
  selector: 'oui-table, table[oui-table]',
  exportAs: 'ouiTable',
  // Inline the template as CDK_TABLE_TEMPLATE is removed. Use the base CdkTable template logic.
  template: `<ng-container cdkTable></ng-container>`,
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
