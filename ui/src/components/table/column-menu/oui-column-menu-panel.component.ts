import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { OuiIconRegistry } from '../../icon/icon-registery';
import { DomSanitizer } from '@angular/platform-browser';

export type ColumnMenuActionType =
  | 'sortAsc'
  | 'sortDesc'
  | 'moveFirst'
  | 'moveLeft'
  | 'moveRight'
  | 'moveLast'
  | 'hide';

export interface ColumnMenuAction {
  columnId: string;
  action: ColumnMenuActionType;
}

/**
 * Self-contained column menu component.
 *
 * Renders the ⋮ trigger button and an `<oui-menu>` with all column actions.
 * The directive inserts this component into each header cell — no custom
 * CDK Overlay code needed because `ouiMenuTriggerFor` handles everything.
 */
@Component({
  selector: 'oui-column-menu-panel',
  templateUrl: './oui-column-menu-panel.component.html',
  styleUrls: ['./oui-column-menu-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class OuiColumnMenuPanelComponent {
  private readonly _iconRegistry = inject(OuiIconRegistry);
  private readonly _domSanitizer = inject(DomSanitizer);

  @Input() columnId = '';
  @Input() displayedColumns: string[] = [];
  @Input() hasSort = false;

  /** Current sort direction for this column — set by the directive. */
  @Input() sortDirection: '' | 'asc' | 'desc' = '';

  @Output() actionSelected = new EventEmitter<ColumnMenuActionType>();

  /** Emitted when the sort indicator icon is clicked. */
  @Output() sortClicked = new EventEmitter<void>();

  constructor() {
    this._iconRegistry.addSvgIconSet(
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?v7tuaj'
      )
    );
  }

  get isFirst(): boolean {
    const idx = this.displayedColumns.indexOf(this.columnId);
    return idx === 0;
  }

  get isLast(): boolean {
    const idx = this.displayedColumns.indexOf(this.columnId);
    return idx === this.displayedColumns.length - 1;
  }

  /** True when this column is in the second position (index 1). */
  get isSecond(): boolean {
    return this.displayedColumns.indexOf(this.columnId) === 1;
  }

  select(action: ColumnMenuActionType): void {
    this.actionSelected.emit(action);
  }

  /** Handle sort indicator click — delegates to directive via sortClicked output. */
  onSortClick(event: MouseEvent): void {
    event.stopPropagation();
    this.sortClicked.emit();
  }
}
