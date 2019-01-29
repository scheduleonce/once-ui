import { storiesOf } from '@storybook/angular';
import {
  OuiIconModule,
  OuiTableModule,
  OuiPaginatorModule,
  OuiSortModule,
  OuiTableDataSource,
  OuiSort,
  OuiPaginator,
  OuiInputModule
} from '../../../projects/ui/src/lib/oui';
import { object, number } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import markdownText from '../../../projects/ui/src/lib/oui/table/README.md';

import paypal from '../../assets/images/paypal.svg';
import zapier from '../../assets/images/zapier.svg';
import google_calender from '../../assets/images/google-calender.svg';
import salesforce from '../../assets/images/salesforce.svg';
import scheduleonce from '../../assets/images/scheduleonce.svg';
import inviteonce from '../../assets/images/inviteonce.svg';
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth'
];
const COLORS: string[] = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'purple',
  'fuchsia',
  'lime',
  'teal',
  'aqua',
  'blue',
  'navy',
  'black',
  'gray'
];

function createNewUser(id: number) {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}

const TABLEDATASOURCE = Array.from({ length: 100 }, (_, k) =>
  createNewUser(k + 1)
);

@Component({
  selector: 'oui-table-storybook',
  template: `
    <input
      (keyup)="applyFilter($event.target.value)"
      oui-input
      placeholder="Filter"
    />
    <table oui-table #table [dataSource]="dataSource" ouiSort>
      <ng-container
        *ngFor="let column of displayedColumns"
        ouiColumnDef="{{ column }}"
      >
        <th oui-header-cell *ouiHeaderCellDef oui-sort-header>
          {{ column.toUpperCase() }}
        </th>
        <td oui-cell *ouiCellDef="let element">{{ element[column] }}</td>
      </ng-container>

      <tr oui-header-row *ouiHeaderRowDef="displayedColumns"></tr>
      <tr oui-row *ouiRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <oui-paginator pageSize="{{ pageSize }}"></oui-paginator>
  `
})
export class OuiTableStorybook implements OnInit {
  @ViewChild(OuiSort) sort: OuiSort;
  @ViewChild(OuiPaginator) paginator: OuiPaginator;
  displayedColumns: string[] = [];
  @Input() users: any[] = [];
  @Input() pageSize: any[] = [];
  dataSource = new OuiTableDataSource(this.users);
  constructor() {}
  ngOnInit() {
    for (let key in this.users[0]) this.displayedColumns.push(key);
    this.dataSource = new OuiTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

const USERINFODATASOURCE = [
  {
    name: 'anurag',
    email: 'anurag+122333223423523523.scheduleonce@gmail.com',
    role: 'member',
    image: '',
    integration: ['zapier', 'paypal', 'google-calender', 'salesforce'],
    licence: ['scheduleonce', 'inviteonce'],
    status: 'invited'
  },
  {
    name: 'anurag',
    email: 'anurag.scheduleonce@gmail.com',
    role: 'member',
    image: '',
    integration: ['zapier', 'paypal', 'google-calender', 'salesforce'],
    licence: ['scheduleonce', 'inviteonce'],
    status: 'invited'
  },
  {
    name: 'anurag',
    email: 'anurag.scheduleonce@gmail.com',
    role: 'member',
    image: '',
    integration: ['zapier', 'paypal', 'google-calender', 'salesforce'],
    licence: ['scheduleonce', 'inviteonce'],
    status: 'invited'
  },
  {
    name: 'anurag',
    email: 'anurag.scheduleonce@gmail.com',
    role: 'member',
    image: '',
    integration: ['zapier', 'paypal', 'google-calender', 'salesforce'],
    licence: ['scheduleonce', 'inviteonce'],
    status: 'invited'
  }
];

@Component({
  selector: 'oui-table-custom-storybook',
  template: `
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
                <img [src]="INTEGRATIONS[integration]" />
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
                <img [src]="LICENCES[license]" />
              </li>
            </ul>
          </div>
        </td>
      </ng-container>

      <ng-container ouiColumnDef="Status">
        <th oui-header-cell *ouiHeaderCellDef class="col-five-width">Status</th>
        <td oui-cell *ouiCellDef="let element">{{ element.status }}</td>
      </ng-container>

      <tr oui-header-row *ouiHeaderRowDef="userInfoColumns"></tr>
      <tr oui-row *ouiRowDef="let row; columns: userInfoColumns"></tr>
    </table>
  `
})
export class OuiTableCustomStorybook implements OnInit {
  INTEGRATIONS = {
    paypal: paypal,
    zapier: zapier,
    'google-calender': google_calender,
    salesforce: salesforce
  };
  LICENCES = {
    scheduleonce: scheduleonce,
    inviteonce: inviteonce
  };
  @ViewChild(OuiSort) sort: OuiSort;
  userInfoColumns: string[] = [
    'Users',
    'Role',
    'Integrations',
    'Licenses',
    'Status'
  ];
  @Input() users: any[] = [];
  @Input() pageSize: any[] = [];
  userInfoDataSource = new OuiTableDataSource(this.users);
  constructor() {}
  ngOnInit() {
    this.userInfoDataSource = new OuiTableDataSource(this.users);
    this.userInfoDataSource.sort = this.sort;
  }
}

const valueOptions = {
  range: true,
  min: 5,
  max: 50,
  step: 5
};
storiesOf('Table', module)
  .add(
    'default',
    () => ({
      moduleMetadata: {
        imports: [
          OuiTableModule,
          OuiSortModule,
          OuiPaginatorModule,
          OuiIconModule,
          OuiInputModule,
          BrowserAnimationsModule
        ],
        schemas: [],
        declarations: [OuiTableStorybook]
      },
      template: `<oui-table-storybook [pageSize]="pageSize" [users]="data"></oui-table-storybook>`,
      props: {
        pageSize: number('pageSize', 10, valueOptions),
        data: object('data', TABLEDATASOURCE)
      }
    }),
    { notes: { markdown: markdownText } }
  )
  .add(
    'custom',
    () => ({
      moduleMetadata: {
        imports: [
          OuiTableModule,
          OuiSortModule,
          OuiIconModule,
          OuiInputModule,
          BrowserAnimationsModule
        ],
        schemas: [],
        declarations: [OuiTableCustomStorybook]
      },
      template: `<oui-table-custom-storybook [users]="data"></oui-table-custom-storybook>`,
      props: {
        data: object('data', USERINFODATASOURCE)
      }
    }),
    { notes: { markdown: markdownText } }
  );
