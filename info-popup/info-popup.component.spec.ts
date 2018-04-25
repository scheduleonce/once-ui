import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPopupComponent } from './info-popup.component';

describe('InfoPopupComponent', () => {
  let component: InfoPopupComponent;
  let fixture: ComponentFixture<InfoPopupComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [InfoPopupComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
