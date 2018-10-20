import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'once-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input()
  label: string;
  @Input()
  type: 'primary' | 'secondary' | 'link' = 'primary';
  @Input()
  disabled: boolean;
  @Input()
  className: string;
  @Output()
  buttonClick = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onClick() {
    this.buttonClick.emit(null);
  }
}
