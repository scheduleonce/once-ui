import { CDK_TABLE_TEMPLATE, CdkTable } from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core';

/**
 * Wrapper for the CdkTable with Once-UI design styles.
 */
@Component({
  selector: 'oui-table, table[oui-table]',
  exportAs: 'ouiTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.scss'],
  host: {
    class: 'oui-table'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OuiTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected stickyCssClass = 'oui-table-sticky';
}
