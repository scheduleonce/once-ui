import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMenuDropdownComponent } from './action-menu-dropdown.component';

describe('ActionMenuDropdownComponent', () => {
  let component: ActionMenuDropdownComponent;
  let fixture: ComponentFixture<ActionMenuDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionMenuDropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMenuDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
