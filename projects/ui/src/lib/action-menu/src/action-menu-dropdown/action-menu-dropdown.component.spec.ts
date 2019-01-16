import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMenuDropdownComponent } from './action-menu-dropdown.component';

describe('ActionMenuDropdownComponent', () => {
  let fixture: ComponentFixture<ActionMenuDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionMenuDropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMenuDropdownComponent);
    fixture.detectChanges();
  });
});
