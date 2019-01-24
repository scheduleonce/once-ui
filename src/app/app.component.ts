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
