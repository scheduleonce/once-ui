import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteonceComponent } from './inviteonce.component';

describe('InviteonceComponent', () => {
  let component: InviteonceComponent;
  let fixture: ComponentFixture<InviteonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteonceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
