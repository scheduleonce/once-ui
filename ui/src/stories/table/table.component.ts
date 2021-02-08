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
})
export class OuiTableStorybook implements OnInit, OnChanges {
  @ViewChild(OuiSort, { static: true }) sort: OuiSort;
  @ViewChild(OuiPaginator, { static: true }) paginator: OuiPaginator;
  displayedColumns: string[] = [];
  @Input() users: any[] = [];
  @Input() pageSize: any[] = [];
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
    inviteonce: this.sanitizer.bypassSecurityTrustHtml(STORY_ICONS.INVITEONCE),
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
