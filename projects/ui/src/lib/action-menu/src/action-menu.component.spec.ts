import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMenuComponent } from './action-menu.component';
import { DefaultPositionConfig } from './action-menu-config';

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionMenuComponent]
    }).compileComponents();
  }));

  describe('Horizontal 3 dots', ()=> {
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
      expect(component.defaultPosition).toBe(DefaultPositionConfig.right_bottom);
    });

    it('Clicking 3 dots should open action menu', ()=> {
      const dotsButton = <HTMLElement>(
        element.querySelector('.three-dot-menu')
      );
      if (dotsButton) {
        dotsButton.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();
        expect(component.dropdownVisible).toBeTruthy();
      }
    });
  });

  describe('Vertical 3 dots', ()=> {
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

  describe('Already open action menu', ()=> {
    beforeEach(() => {
      fixture = TestBed.createComponent(ActionMenuComponent);
      component = fixture.componentInstance;
      component.isVertical = false;
      component.dropdownVisible = true;
      component.items = [{
        label: 'Delete User',
        icon: '',
        click: () => {console.log('Delete user callback')},
        tooltip: 'Delete User'
      }];
      element = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('Clicking 3 dots should close action menu', ()=> {
      const dotsButton = <HTMLElement>(
        element.querySelector('.three-dot-menu')
      );
      if (dotsButton) {
        dotsButton.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();
        expect(component.dropdownVisible).toBeFalsy();
      }
    });

    it('Clicking action menu action should close action menu', ()=> {
      const menuItem = <HTMLElement>(
        element.querySelector('.action-menu-icon-links')
      );
      if (menuItem) {
        menuItem.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();
        expect(component.dropdownVisible).toBeFalsy();
      }
    });
  });
});
