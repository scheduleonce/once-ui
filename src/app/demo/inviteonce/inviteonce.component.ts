import { Component, OnInit, ViewChild } from '@angular/core';
import { OuiDialog, OuiProgressButton } from '@once/ui';

@Component({
  selector: 'app-inviteonce',
  templateUrl: './inviteonce.component.html',
  styleUrls: ['./inviteonce.component.scss']
})
export class InviteonceComponent {
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
