import { Component, OnInit, Input } from '@angular/core';
import { ActionMenuConfig, DefaultPositionConfig } from './action-menu-config';

@Component({
  selector: 'once-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {
  @Input()
  items: ActionMenuConfig[];
  @Input()
  dotsMenuTooltip: string;
  @Input()
  actionItem: any;
  @Input()
  isVertical = false;
  @Input()
  defaultPosition: string;

  constructor() {}

  ngOnInit() {
    this.defaultPosition = this.defaultPosition
      ? this.defaultPosition
      : this.isVertical
        ? DefaultPositionConfig.left_bottom
        : DefaultPositionConfig.right_bottom;
  }
}
