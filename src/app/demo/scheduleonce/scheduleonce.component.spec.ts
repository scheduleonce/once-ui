import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleonceComponent } from './scheduleonce.component';

describe('ScheduleonceComponent', () => {
  let component: ScheduleonceComponent;
  let fixture: ComponentFixture<ScheduleonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleonceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
