import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OncehubComponent } from './oncehub.component';

describe('OncehubComponent', () => {
  let component: OncehubComponent;
  let fixture: ComponentFixture<OncehubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OncehubComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OncehubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
