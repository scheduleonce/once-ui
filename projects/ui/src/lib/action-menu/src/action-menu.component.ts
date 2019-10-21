import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ActionMenuConfig, DefaultPositionConfig } from './action-menu-config';
import { ActionMenuDropdownDirective } from './action-menu-dropdown.directive';

@Component({
  selector: 'once-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit, OnDestroy {
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
  @ViewChild(ActionMenuDropdownDirective, { static: true })
  onceActionMenuDropdown: ActionMenuDropdownDirective;

  constructor() {}

  ngOnInit() {
    this.defaultPosition = this.defaultPosition
      ? this.defaultPosition
      : this.isVertical
      ? DefaultPositionConfig.left_bottom
      : DefaultPositionConfig.right_bottom;
  }

  ngOnDestroy() {
    this.onceActionMenuDropdown.hideActionMenuDropDown();
  }
}
