import { Component, OnInit, ViewChild } from '@angular/core';
import { OuiDialog, OuiProgressButton } from '@once/ui';

@Component({
  selector: 'app-chatonce',
  templateUrl: './chatonce.component.html',
  styleUrls: ['./chatonce.component.scss']
})
export class ChatonceComponent {
  @ViewChild('dialogTemplate')
  dialogTemplate;
  @ViewChild('progressButton')
  progressButton: OuiProgressButton;
  @ViewChild('progressLinkButton')
  progressLinkButton: OuiProgressButton;
  @ViewChild('progressGhostButton')
  progressGhostButton: OuiProgressButton;
  constructor(private dialog: OuiDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(() => {});
  }

  progressButtonClick() {
    this.progressButton.setToProgress();
    setTimeout(() => {
      this.progressButton.setToDone();
    }, 500);
  }

  progressButtonLinkClick() {
    this.progressLinkButton.setToProgress();
    setTimeout(() => {
      this.progressLinkButton.setToDone();
    }, 500);
  }

  progressButtonGhostClick() {
    this.progressGhostButton.setToProgress();
    setTimeout(() => {
      this.progressGhostButton.setToDone();
    }, 500);
  }
}
