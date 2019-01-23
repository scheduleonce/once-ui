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
  constructor(
    private dialog: OuiDialog,
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `https://i.icomoon.io/public/temp/649229bb86/Oncehub/symbol-defs.svg`
      )
    );
    this.ouiIconRegistry.addSvgIcon(
      `three-dot`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/three-dot.svg`
      )
    );
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://soqacdnstorage.blob.core.windows.net/cdnapp2/fonts/symbol-defs.svg'
      )
    );

    this.checked = false;
    this.labelPosition = 'after';
    this.disabled = false;
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
