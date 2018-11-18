import { Component, OnInit, ViewChild } from '@angular/core';
import { OuiProgressButton } from 'src/app/button/button';

@Component({
  selector: 'app-chatonce',
  templateUrl: './chatonce.component.html',
  styleUrls: ['./chatonce.component.scss']
})
export class ChatonceComponent{

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
