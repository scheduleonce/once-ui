import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionMenuComponent } from './action-menu.component';
import { DefaultPositionConfig } from './action-menu-config';
import { ActionMenuDropdownDirective } from './action-menu-dropdown.directive';

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionMenuComponent, ActionMenuDropdownDirective]
    }).compileComponents();
  }));

  describe('Horizontal 3 dots', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ActionMenuComponent);
      component = fixture.componentInstance;
      component.isVertical = false;
      element = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('Default value of isVertical should be false', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.isVertical).toBeFalsy();
    });

    it('Default value of defaultPosition to be right-bottom for horizontal 3 dots', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.defaultPosition).toBe(
        DefaultPositionConfig.right_bottom
      );
    });
  });

  describe('Vertical 3 dots', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ActionMenuComponent);
      component = fixture.componentInstance;
      component.isVertical = true;
      fixture.detectChanges();
    });

    it('isVertical should be true', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.isVertical).toBeTruthy();
    });

    it('Default value of defaultPosition to be left-bottom for vertical 3 dots', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.defaultPosition).toBe(DefaultPositionConfig.left_bottom);
    });
  });
});
