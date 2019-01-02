import { Component, ViewChild } from '@angular/core';
import { OuiDialog } from 'projects/ui/src/lib/oui';
import { OuiIconRegistry } from 'projects/ui/src/lib/oui';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options: string[] = ['One', 'Two', 'Three'];

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
