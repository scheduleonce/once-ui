import { Component, ViewChild } from '@angular/core';
import { OuiDialog } from './dialog/dialog';
import { OuiIconRegistry } from './icon/icon-registery';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('dialogTemplate')
  dialogTemplate;
  @ViewChild('progressButton')
  progressButton: any;
  @ViewChild('progressLinkButton')
  progressLinkButton: any;
  @ViewChild('progressGhostButton')
  progressGhostButton: any;
  constructor(
    private dialog: OuiDialog,
    private matIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      `local`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/v-green.svg`
      )
    );

    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://i.icomoon.io/public/temp/7cccb86d6d/UntitledProject/symbol-defs.svg'
      )
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(() => {});
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

  progressButtonGhostClick() {
    this.progressGhostButton.setToProgress();
    setTimeout(() => {
      this.progressGhostButton.setToDone();
    }, 1000);
  }
}
