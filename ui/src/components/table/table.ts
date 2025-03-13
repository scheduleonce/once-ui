import {
  CDK_TABLE_TEMPLATE,
  CdkTable,
  CDK_TABLE,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
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
    standalone: false
})
export class MatRecycleRows {}

/**
 * Wrapper for the CdkTable with Once-UI design styles.
 */
@Component({
    selector: 'oui-table, table[oui-table]',
    exportAs: 'ouiTable',
    template: CDK_TABLE_TEMPLATE,
    styleUrls: ['table.scss'],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'oui-table',
        '[class.oui-table-fixed-layout]': 'fixedLayout',
    },
    providers: [
        // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
        //  is only included in the build if used.
        {
            provide: _VIEW_REPEATER_STRATEGY,
            useClass: _DisposeViewRepeaterStrategy,
        },
        { provide: CdkTable, useExisting: OuiTable },
        { provide: CDK_TABLE, useExisting: OuiTable },
        { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
        // Prevent nested tables from seeing this table's StickyPositioningListener.
        { provide: STICKY_POSITIONING_LISTENER, useValue: null },
    ],
    encapsulation: ViewEncapsulation.None,
    // See note on CdkTable for explanation on why this uses the default change detection strategy.
    // eslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class OuiTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected override stickyCssClass = 'oui-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement = false;
}
