import { Component, ViewChild, OnInit } from '@angular/core';
import { OuiDialog, OuiSort } from 'projects/ui/src/lib/oui';
import {
  OuiIconRegistry,
  OuiTableDataSource,
  OuiPaginator
} from 'projects/ui/src/lib/oui';
import { DomSanitizer } from '@angular/platform-browser';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(OuiSort) sort: OuiSort;
  @ViewChild(OuiPaginator) paginator: OuiPaginator;
  options: string[] = ['One', 'Two', 'Three'];
  isDisable = false;
  stateGroups = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
    },
    {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut']
    },
    {
      letter: 'D',
      names: ['Delaware']
    },
    {
      letter: 'F',
      names: ['Florida']
    }
  ];
  checked;
  labelPosition;
  disabled;
  @ViewChild('dialogTemplate')
  dialogTemplate;
  @ViewChild('progressButton')
  progressButton: any;
  @ViewChild('progressLinkButton')
  progressLinkButton: any;
  @ViewChild('progressGhostButton')
  progressGhostButton: any;
  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: OuiTableDataSource<UserData>;
  constructor(
    private dialog: OuiDialog,
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.ouiIconRegistry.addSvgIcon(
      `horizontal`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/3-dots-horizontal-20x8.svg`
      )
    );
    this.ouiIconRegistry.addSvgIcon(
      `vertical`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/3-dots-vertical-20x8.svg`
      )
    );
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://s3.amazonaws.com/icomoon.io/135790/oncehub-20/symbol-defs.svg?nhbz3f'
      )
    );

    this.checked = false;
    this.labelPosition = 'after';
    this.disabled = false;
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) =>
      this.createNewUser(k + 1)
    );
    console.log(users[0]);
    this.dataSource = new OuiTableDataSource(users);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(() => {});
  }

  createNewUser(id: number): UserData {
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

  progressButtonClick() {
    this.progressButton.setToProgress();
    setTimeout(() => {
      this.progressButton.setToDone();
    }, 1000);
  }

  progressButtonLinkClick() {
    this.progressLinkButton.setToProgress();
    setTimeout(() => {
      this.progressLinkButton.setToDone();
    }, 1000);
  }

  func($event) {
    console.log($event);
  }

  progressButtonGhostClick() {
    this.progressGhostButton.setToProgress();
    setTimeout(() => {
      this.progressGhostButton.setToDone();
    }, 1000);
  }
}
