import { Component, ViewChild, OnInit } from '@angular/core';
import { OuiDialog, OuiSort } from 'projects/ui/src/lib/oui';
import {
  OuiIconRegistry,
  OuiTableDataSource,
  OuiPaginator
} from 'projects/ui/src/lib/oui';
import { DomSanitizer } from '@angular/platform-browser';

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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new OuiTableDataSource([
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' }
  ]);
  constructor(
    private dialog: OuiDialog,
    private matIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `https://i.icomoon.io/public/temp/649229bb86/Oncehub/symbol-defs.svg`
      )
    );
    this.matIconRegistry.addSvgIcon(
      `three-dot`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/three-dot.svg`
      )
    );
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://soqacdnstorage.blob.core.windows.net/cdnapp2/fonts/symbol-defs.svg'
      )
    );
    this.checked = false;
    this.labelPosition = 'after';
    this.disabled = false;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(() => {});
  }

  progressButtonClick() {
    this.progressButton.setToProgress();
    setTimeout(() => {
      this.progressButton.setToDone();
      console.log('disable true');
      this.isDisable = true;
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
