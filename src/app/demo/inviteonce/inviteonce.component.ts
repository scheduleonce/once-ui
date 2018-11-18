import { Component, OnInit, ViewChild } from '@angular/core';
import { OuiProgressButton } from 'src/app/button/button';

@Component({
  selector: 'app-inviteonce',
  templateUrl: './inviteonce.component.html',
  styleUrls: ['./inviteonce.component.scss']
})
export class InviteonceComponent {

  @ViewChild('progressButton') progressButton: OuiProgressButton;
  @ViewChild('progressLinkButton') progressLinkButton: OuiProgressButton;
  @ViewChild('progressGhostButton') progressGhostButton: OuiProgressButton;
  title = 'ui-components';


  progressButtonClick(){
    this.progressButton.setToProgress();
    setTimeout(()=>{
      this.progressButton.setToDone();
    },500);
  }

  progressButtonLinkClick(){
    this.progressLinkButton.setToProgress();
    setTimeout(()=>{
      this.progressLinkButton.setToDone();
    },500);
  }

  progressButtonGhostClick(){
    this.progressGhostButton.setToProgress();
    setTimeout(()=>{
      this.progressGhostButton.setToDone();
    },500);
  }

}
