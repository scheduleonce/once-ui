import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  OnDestroy,
  ElementRef,
  NgZone,
  IterableDiffers,
  inject,
} from '@angular/core';
import {
  CDK_ROW_TEMPLATE,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';

/**
 * Header row definition for the oui-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[ouiHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: OuiHeaderRowDef }],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns: ouiHeaderRowDef'],
  standalone: false,
})
export class OuiHeaderRowDef extends CdkHeaderRowDef {}

/**
 * Footer row definition for the oui-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[ouiFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: OuiFooterRowDef }],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns: ouiFooterRowDef'],
  standalone: false,
})
export class OuiFooterRowDef extends CdkFooterRowDef {}

/**
 * Data row definition for the oui-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[ouiRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: OuiRowDef }],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns: ouiRowDefColumns', 'when: ouiRowDefWhen'],
  standalone: false,
})
export class OuiRowDef<T> extends CdkRowDef<T> {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'oui-header-row, tr[oui-header-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'oui-header-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: OuiHeaderRow }],
  standalone: false,
})
export class OuiHeaderRow extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'oui-footer-row, tr[oui-footer-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'oui-footer-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiFooterRow',
  providers: [{ provide: CdkFooterRow, useExisting: OuiFooterRow }],
  standalone: false,
})
export class OuiFooterRow extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'oui-row, tr[oui-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'oui-row',
    role: 'row',
    tabindex: '0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ouiRow',
  providers: [{ provide: CdkRow, useExisting: OuiRow }],
  standalone: false,
})
export class OuiRow extends CdkRow implements OnDestroy {
  protected elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _differs = inject(IterableDiffers);
  private _focusMonitor = inject(FocusMonitor);
  private _ngZone = inject(NgZone);

  private _monitorSubscription: Subscription = Subscription.EMPTY;

  constructor() {
    super();
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));
  }
  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this.elementRef);
    this._monitorSubscription.unsubscribe();
  }
}
