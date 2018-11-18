import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatonceComponent } from './chatonce.component';

describe('ChatonceComponent', () => {
  let component: ChatonceComponent;
  let fixture: ComponentFixture<ChatonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatonceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
