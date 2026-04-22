import { STORY_ICONS, USERINFOCOLUMNS } from './const';
import {
  Component,
  OnInit,
  ViewChild,
  inject,
  input,
  effect,
} from '@angular/core';
import {
  OuiTableDataSource,
  OuiSort,
  OuiPaginator,
  ColumnMenuAction,
  ColumnOrderChangedEvent,
} from '../../components';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { OuiIconRegistry } from '../../components';

@Component({
  selector: 'oui-table-storybook',
  template: `
    <oui-form-field>
      <input
        (keyup)="applyFilter($event.target.value)"
        oui-input
        class="input-filter"
        placeholder="Filter"
      />
    </oui-form-field>
    <div class="table-container">
      <table oui-table #table [dataSource]="dataSource" ouiSort>
        @for (column of displayedColumns; track column) {
        <ng-container ouiColumnDef="{{ column }}">
          <th oui-header-cell *ouiHeaderCellDef oui-sort-header>
            {{ column }}
          </th>
          <td oui-cell *ouiCellDef="let element">{{ element[column] }}</td>
        </ng-container>
        }
        <tr oui-header-row *ouiHeaderRowDef="displayedColumns"></tr>
        <tr oui-row *ouiRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <oui-paginator pageSize="{{ pageSize() }}"></oui-paginator>
    </div>
  `,
  standalone: false,
})
export class OuiTableStorybook implements OnInit {
  @ViewChild(OuiSort, { static: true }) sort: OuiSort;
  @ViewChild(OuiPaginator, { static: true }) paginator: OuiPaginator;
  // displayedColumns: string[] = [];
  readonly users = input<any[]>([
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ]);
  readonly pageSize = input<any[]>([]);
  displayedColumns: string[] = [];
  dataSource = new OuiTableDataSource<any>([]);
  private readonly ouiIconRegistry = inject(OuiIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);
  constructor() {
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?v7tuaj'
      )
    );
    effect(() => {
      this.dataSource = new OuiTableDataSource(this.users());
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {
    // eslint-disable-next-line guard-for-in
    for (const key in this.users()[0]) {
      this.displayedColumns.push(key);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: 'oui-table-custom-storybook',
  template: `
    <div class="table-container">
      <table oui-table [dataSource]="userInfoDataSource">
        <ng-container ouiColumnDef="Users">
          <th oui-header-cell *ouiHeaderCellDef class="col-one-width">Users</th>
          <td oui-cell *ouiCellDef="let user">
            <div class="ul-name clearfloat">
              <div class="u-img"><img [src]="user.image" /></div>
              <div class="usersName">
                <div class="username-text">
                  <span>{{ user.name }}</span>
                </div>
                <div class="useremail-text">
                  <span [title]="user.email">{{ user.email }}</span>
                </div>
              </div>
            </div>
          </td>
        </ng-container>
        <ng-container ouiColumnDef="Role">
          <th oui-header-cell *ouiHeaderCellDef class="col-two-width">Role</th>
          <td oui-cell *ouiCellDef="let element">{{ element.role }}</td>
        </ng-container>
        <ng-container ouiColumnDef="Integrations">
          <th oui-header-cell *ouiHeaderCellDef class="col-three-width">
            Integrations
          </th>
          <td oui-cell *ouiCellDef="let user">
            <div class="integrationsContainer">
              <ul>
                @for (integration of user.integration; track integration) {
                <li>
                  <span
                    [ouiTooltip]="integration"
                    ouiTooltipPosition="above"
                    [innerHTML]="INTEGRATIONS[integration]"
                  ></span>
                </li>
                }
              </ul>
            </div>
          </td>
        </ng-container>
        <ng-container ouiColumnDef="Licenses">
          <th oui-header-cell *ouiHeaderCellDef class="col-four-width">
            Licenses
          </th>
          <td oui-cell *ouiCellDef="let user">
            <div class="licensesContainer">
              <ul>
                @for (license of user.licence; track license) {
                <li>
                  <span
                    [ouiTooltip]="license"
                    ouiTooltipPosition="above"
                    [innerHTML]="LICENCES[license]"
                  ></span>
                </li>
                }
              </ul>
            </div>
          </td>
        </ng-container>
        <ng-container ouiColumnDef="Status">
          <th oui-header-cell *ouiHeaderCellDef class="col-five-width">
            Status
          </th>
          <td oui-cell *ouiCellDef="let element">{{ element.status }}</td>
        </ng-container>
        <tr oui-header-row *ouiHeaderRowDef="userInfoColumns"></tr>
        <tr oui-row *ouiRowDef="let row; columns: userInfoColumns"></tr>
      </table>
    </div>
  `,
  standalone: false,
})
export class OuiTableCustomStorybook {
  private sanitizer = inject(DomSanitizer);

  INTEGRATIONS = {
    paypal: this.sanitizer.bypassSecurityTrustHtml(STORY_ICONS.PAYPAL),
    zapier: this.sanitizer.bypassSecurityTrustHtml(STORY_ICONS.ZAPIER),
    'google-calender': this.sanitizer.bypassSecurityTrustHtml(
      STORY_ICONS.GOOGLE_CALENDAR
    ),
    salesforce: this.sanitizer.bypassSecurityTrustHtml(STORY_ICONS.SALESFORCE),
  };
  LICENCES = {
    scheduleonce: this.sanitizer.bypassSecurityTrustHtml(
      STORY_ICONS.SCHEDULEONCE
    ),
    chatonce: this.sanitizer.bypassSecurityTrustHtml(STORY_ICONS.CHATONCE),
  };
  @ViewChild(OuiSort, { static: true }) sort: OuiSort;
  userInfoColumns = USERINFOCOLUMNS;
  readonly users = input<any[]>([]);
  readonly pageSize = input<any[]>([]);
  userInfoDataSource = new OuiTableDataSource<any>([]);

  constructor() {
    effect(() => {
      this.userInfoDataSource = new OuiTableDataSource(this.users());
      this.userInfoDataSource.sort = this.sort;
    });
  }
}

// ─── Enhanced table story (sort + resize + reorder + column menu) ──────────────

const ENHANCED_DATA = [
  { name: 'Hydrogen', position: 1, weight: 1.0079, symbol: 'H' },
  { name: 'Helium', position: 2, weight: 4.0026, symbol: 'He' },
  { name: 'Lithium', position: 3, weight: 6.941, symbol: 'Li' },
  { name: 'Beryllium', position: 4, weight: 9.0122, symbol: 'Be' },
  { name: 'Boron', position: 5, weight: 10.811, symbol: 'B' },
  { name: 'Carbon', position: 6, weight: 12.0107, symbol: 'C' },
  { name: 'Nitrogen', position: 7, weight: 14.0067, symbol: 'N' },
  { name: 'Oxygen', position: 8, weight: 15.9994, symbol: 'O' },
];

@Component({
  selector: 'oui-table-enhanced-storybook',
  template: `
    <div class="table-container">
      <table
        oui-table
        [dataSource]="dataSource"
        ouiSort
        ouiResizableColumns
        ouiReorderableColumns
        (ouiSortChange)="onSort($event)"
        (columnResized)="onColumnResized($event)"
        (columnOrderChanged)="onColumnOrderChanged($event)"
      >
        @for (column of displayedColumns; track column) {
        <ng-container [ouiColumnDef]="column">
          <th
            oui-header-cell
            *ouiHeaderCellDef
            [ouiColumnMenu]="displayedColumns"
            [ouiColumnMenuHasSort]="true"
            (columnMenuAction)="onColumnMenuAction($event)"
          >
            {{ column | titlecase }}
          </th>
          <td oui-cell *ouiCellDef="let row">{{ row[column] }}</td>
        </ng-container>
        }
        <tr oui-header-row *ouiHeaderRowDef="displayedColumns"></tr>
        <tr oui-row *ouiRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  standalone: false,
})
export class OuiTableEnhancedStorybook implements OnInit {
  @ViewChild(OuiSort, { static: true }) sort: OuiSort;

  displayedColumns: string[] = [];
  dataSource = new OuiTableDataSource<typeof ENHANCED_DATA[number]>(
    ENHANCED_DATA
  );
  lastEvent = '';
  private readonly ouiIconRegistry = inject(OuiIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?v7tuaj'
      )
    );
  }

  ngOnInit(): void {
    this.displayedColumns = Object.keys(ENHANCED_DATA[0]);
    this.dataSource.sort = this.sort;
  }

  onColumnOrderChanged(event: ColumnOrderChangedEvent): void {
    this.displayedColumns = event.columnIds;
  }

  onColumnMenuAction(action: ColumnMenuAction): void {
    switch (action.action) {
      case 'moveLeft': {
        const idx = this.displayedColumns.indexOf(action.columnId);
        // Never move a column into the first (frozen) position.
        if (idx > 1) {
          moveItemInArray(this.displayedColumns, idx, idx - 1);
          this.displayedColumns = [...this.displayedColumns];
        }
        break;
      }
      case 'moveRight': {
        const idx = this.displayedColumns.indexOf(action.columnId);
        // Never move the first (frozen) column.
        if (idx > 0 && idx < this.displayedColumns.length - 1) {
          moveItemInArray(this.displayedColumns, idx, idx + 1);
          this.displayedColumns = [...this.displayedColumns];
        }
        break;
      }

      case 'hide': {
        // Never hide the first (frozen) column.
        if (this.displayedColumns.indexOf(action.columnId) > 0) {
          this.displayedColumns = this.displayedColumns.filter(
            (c) => c !== action.columnId
          );
        }
        break;
      }
    }
  }
}
