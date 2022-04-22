import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OuiSlideToggle } from './slide-toggle';

describe('OuiSlideToggle', () => {
  let component: OuiSlideToggle;
  let fixture: ComponentFixture<OuiSlideToggle>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OuiSlideToggle],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuiSlideToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger toggle function event mouse click', () => {
    spyOn(component, 'toggle');
    fixture.nativeElement.children[0].children[0].dispatchEvent(
      new Event('click')
    );
    fixture.detectChanges();
    expect(component.toggle).toHaveBeenCalled();
  });

  it('should update checked on mouse click', () => {
    component.checked = true;
    fixture.nativeElement.children[0].children[0].dispatchEvent(
      new Event('click')
    );
    fixture.detectChanges();
    expect(component.checked).toBeFalsy();
  });

  it('should not change on click when disabled', () => {
    component.checked = false;
    component.disabled = true;
    fixture.nativeElement.children[0].children[0].dispatchEvent(
      new Event('click')
    );
    fixture.detectChanges();
    expect(component.checked).toBeFalsy();
  });

  it('should not emit change event on click when disabled', () => {
    fixture.nativeElement.children[0].children[0].dispatchEvent(
      new Event('click')
    );
    fixture.detectChanges();
    component.change.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should use user defined id when provided', () => {
    component.id = 'test';
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children[0]).toBeDefined();
  });
  describe('OuiSlideToggle', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(OuiSlideToggle);
      component = fixture.componentInstance;
      component.id = 'test';
      fixture.detectChanges();
    });

    it('should use user defined id when provided', () => {
      component.id = 'test';
      fixture.detectChanges();
      expect(fixture.nativeElement.children[0].children[0].id).toBe('test');
    });
  });
});
