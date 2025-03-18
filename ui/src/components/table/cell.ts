import { Directive, ElementRef, Input } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';

/**
 * Cell definition for the oui-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[ouiCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: OuiCellDef }],
  standalone: false,
})
export class OuiCellDef extends CdkCellDef {}

/**
 * Header cell definition for the oui-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[ouiHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: OuiHeaderCellDef }],
  standalone: false,
})
export class OuiHeaderCellDef extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the oui-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[ouiFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: OuiFooterCellDef }],
  standalone: false,
})
export class OuiFooterCellDef extends CdkFooterCellDef {}

/**
 * Column definition for the oui-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[ouiColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: OuiColumnDef },
    { provide: 'OUI_SORT_HEADER_COLUMN_DEF', useExisting: OuiColumnDef },
  ],
  standalone: false,
})
export class OuiColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('ouiColumnDef')
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._setNameInput(name);
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'oui-header-cell, th[oui-header-cell]',
  host: {
    class: 'oui-header-cell',
    role: 'columnheader',
  },
  standalone: false,
})
export class OuiHeaderCell extends CdkHeaderCell {
  constructor(columnDef: CdkColumnDef, elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(
      `oui-column-${columnDef.cssClassFriendlyName}`
    );
  }
}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'oui-footer-cell, td[oui-footer-cell]',
  host: {
    class: 'oui-footer-cell',
    role: 'gridcell',
  },
  standalone: false,
})
export class OuiFooterCell extends CdkFooterCell {
  constructor(columnDef: CdkColumnDef, elementRef: ElementRef) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(
      `oui-column-${columnDef.cssClassFriendlyName}`
    );
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'oui-cell, td[oui-cell]',
  host: {
    class: 'oui-cell',
    role: 'gridcell',
  },
  standalone: false,
})
export class OuiCell extends CdkCell {
  constructor(columnDef: CdkColumnDef, elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(
      `oui-column-${columnDef.cssClassFriendlyName}`
    );
  }
}
