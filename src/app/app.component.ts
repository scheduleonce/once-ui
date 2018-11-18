import { Component, ViewChild } from '@angular/core';
import { OuiProgressButton } from './button/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('progressButton')
  progressButton: OuiProgressButton;
  @ViewChild('progressLinkButton')
  progressLinkButton: OuiProgressButton;
  @ViewChild('progressGhostButton')
  progressGhostButton: OuiProgressButton;
  title = 'ui-components';

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
