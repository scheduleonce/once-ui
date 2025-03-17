import { STORY_ICONS, USERINFOCOLUMNS } from './const';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { OuiTableDataSource, OuiSort, OuiPaginator } from '../../components';
import { DomSanitizer } from '@angular/platform-browser';
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
        <ng-container
          *ngFor="let column of displayedColumns"
          ouiColumnDef="{{ column }}"
        >
          <th oui-header-cell *ouiHeaderCellDef oui-sort-header>
            {{ column }}
          </th>
          <td oui-cell *ouiCellDef="let element">{{ element[column] }}</td>
        </ng-container>
        <tr oui-header-row *ouiHeaderRowDef="displayedColumns"></tr>
        <tr oui-row *ouiRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <oui-paginator pageSize="{{ pageSize }}"></oui-paginator>
    </div>
  `,
  standalone: false,
})
export class OuiTableStorybook implements OnInit, OnChanges {
  @ViewChild(OuiSort, { static: true }) sort: OuiSort;
  @ViewChild(OuiPaginator, { static: true }) paginator: OuiPaginator;
  // displayedColumns: string[] = [];
  @Input() users: any[] = [
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
  ];
  @Input() pageSize: any[] = [];
  displayedColumns: string[] = [];
  dataSource = new OuiTableDataSource(this.users);
  constructor() {}

  ngOnInit() {
    // eslint-disable-next-line guard-for-in
    for (const key in this.users[0]) {
      this.displayedColumns.push(key);
    }
  }

  ngOnChanges() {
    this.dataSource = new OuiTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
                <li *ngFor="let integration of user.integration">
                  <span
                    [ouiTooltip]="integration"
                    ouiTooltipPosition="above"
                    [innerHTML]="INTEGRATIONS[integration]"
                  ></span>
                </li>
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
                <li *ngFor="let license of user.licence">
                  <span
                    [ouiTooltip]="license"
                    ouiTooltipPosition="above"
                    [innerHTML]="LICENCES[license]"
                  ></span>
                </li>
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
export class OuiTableCustomStorybook implements OnChanges {
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
  @Input() users: any[] = [];
  @Input() pageSize: any[] = [];
  userInfoDataSource = new OuiTableDataSource(this.users);
  constructor(private sanitizer: DomSanitizer) {}
  ngOnChanges() {
    this.userInfoDataSource = new OuiTableDataSource(this.users);
    this.userInfoDataSource.sort = this.sort;
  }
}
