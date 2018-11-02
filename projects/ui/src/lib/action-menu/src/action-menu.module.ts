import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent } from './action-menu.component';
import { ActionMenuDropdownComponent } from './action-menu-dropdown/action-menu-dropdown.component';
import { ActionMenuDropdownDirective } from './action-menu-dropdown.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ActionMenuComponent,
    ActionMenuDropdownComponent,
    ActionMenuDropdownDirective
  ],
  entryComponents: [ActionMenuDropdownComponent],
  exports: [ActionMenuComponent]
})
export class ActionMenuModule {}
