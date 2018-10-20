import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'once-progress-button',
  templateUrl: './progress-button.component.html',
  styleUrls: ['./progress-button.component.scss']
})
export class ProgressButtonComponent implements OnInit {
  type = 'primary';

  label: string;
  isInProgress = false;
  isDone = false;
  className = '';

  @Input()
  disabled: boolean;
  @Input()
  labels: { default: string; progress: string; done: string } = {
    default: 'Save',
    progress: 'Saving...',
    done: 'Saved'
  };
  @Output()
  buttonClick = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.label = this.labels.default;
  }

  setToProgress() {
    this.className = 'savingBtn';
    this.isInProgress = true;
    this.isDone = false;
    this.label = this.labels.progress;
  }

  setToDone() {
    this.className = 'savedBtn';
    this.isInProgress = false;
    this.isDone = true;
    this.label = this.labels.done;
    this.setToIdleTimeout();
  }

  reset() {
    this.className = '';
    this.isInProgress = false;
    this.isDone = false;
    this.label = this.labels.default;
  }

  setToIdleTimeout() {
    setTimeout(() => {
      this.className = '';
      this.isDone = false;
      this.label = this.labels.default;
    }, 3000);
  }
}
