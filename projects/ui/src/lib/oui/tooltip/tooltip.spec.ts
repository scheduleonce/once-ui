import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OuiTooltipModule } from './tooltip-module';

@Component({
  template: `
    <button ouiTooltip="this is a tooltip">button</button>
  `
})
class TestTooltipComponent {}

describe('Directive: HoverFocus', () => {
  let fixture: ComponentFixture<TestTooltipComponent>;
  let button: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTooltipComponent],
      imports: [OuiTooltipModule]
    });
    fixture = TestBed.createComponent(TestTooltipComponent);
    button = fixture.debugElement.query(By.css('button'));
  });

  it('should display tooltip on element hover', () => {
    button.triggerEventHandler('mouseover', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).not.toBeNull();
    }, 500);

    button.triggerEventHandler('mouseout', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).toBeNull();
    }, 500);
  });

  it('should display correct message', () => {
    button.triggerEventHandler('mouseover', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).not.toBeNull();
      expect(document.querySelector('.oui-tooltip')[0].innerText).toBe(
        'this is a tooltip'
      );
    }, 500);

    button.triggerEventHandler('mouseout', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).toBeNull();
    }, 500);
  });
});

@Component({
  template: `
    <button ouiTooltip="this is a tooltip" oui-tooltip-disabled>button</button>
  `
})
class TestTooltipDisabledComponent {}
describe('Directive: HoverFocus', () => {
  let fixture: ComponentFixture<TestTooltipDisabledComponent>;
  let button: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTooltipDisabledComponent],
      imports: [OuiTooltipModule]
    });
    fixture = TestBed.createComponent(TestTooltipDisabledComponent);
    button = fixture.debugElement.query(By.css('button'));
  });

  it('should not display tooltip on element hover', () => {
    button.triggerEventHandler('mouseover', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).toBeNull();
    }, 500);

    button.triggerEventHandler('mouseout', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).toBeNull();
    }, 500);
  });
});

@Component({
  template: `
    <button ouiTooltip="this is a tooltip" oui-tooltip-class="test">
      button
    </button>
  `
})
class TestTooltipClassComponent {}

describe('Directive: HoverFocus', () => {
  let fixture: ComponentFixture<TestTooltipClassComponent>;
  let button: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTooltipClassComponent],
      imports: [OuiTooltipModule]
    });
    fixture = TestBed.createComponent(TestTooltipClassComponent);
    button = fixture.debugElement.query(By.css('button'));
  });

  it('should add proper tooltip class', () => {
    button.triggerEventHandler('mouseover', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).not.toBeNull();
      expect(
        document
          .getElementsByClassName('oui-tooltip')[0]
          .classList.contains('test')
      ).toBeTruthy();
    }, 500);

    button.triggerEventHandler('mouseout', null);
    fixture.detectChanges();
    setTimeout(() => {
      expect(document.querySelector('.oui-tooltip')).toBeNull();
    }, 500);
  });
});
