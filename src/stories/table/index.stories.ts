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
const valueOptions = {
  range: true,
  min: 5,
  max: 50,
  step: 5
};
storiesOf('Table', module).add(
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
);
