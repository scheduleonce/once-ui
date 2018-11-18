import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@once/ui';

@Component({
  selector: 'app-scheduleonce',
  templateUrl: './scheduleonce.component.html',
  styleUrls: ['./scheduleonce.component.scss']
})
export class ScheduleonceComponent {

  @ViewChild('progressButton') progressButton: OuiProgressButton;
  @ViewChild('progressLinkButton') progressLinkButton: OuiProgressButton;
  @ViewChild('progressGhostButton') progressGhostButton: OuiProgressButton;


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
