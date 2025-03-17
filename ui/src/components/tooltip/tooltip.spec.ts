import {
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OuiTooltipModule } from './tooltip-module';
import { OuiTooltip } from './tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: ` <button ouiTooltip>button</button> `,
  standalone: false,
})
class TestTooltipComponent {}

describe('Directive: HoverFocus', () => {
  let fixture: ComponentFixture<TestTooltipComponent>;
  let buttonDebugElement: DebugElement;
  let tooltipDirective: OuiTooltip;
  const tooltipMessage = 'this is a tooltip';
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTooltipComponent],
      imports: [OuiTooltipModule, OverlayModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(TestTooltipComponent);
    buttonDebugElement = fixture.debugElement.query(By.css('button'));
    tooltipDirective = buttonDebugElement.injector.get<OuiTooltip>(OuiTooltip);
    TestBed.compileComponents();
  });

  it('should display tooltip on element hover', fakeAsync(() => {
    assertTooltipInstance(tooltipDirective, false);
    tooltipDirective.message = tooltipMessage;
    tooltipDirective.show();
    tick(0); // Tick for the show delay (default is 0)
    expect(tooltipDirective._isTooltipVisible()).toBe(true);
    tooltipDirective.hide();
    tick(500);
    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
  }));

  it('should display correct message', fakeAsync(() => {
    assertTooltipInstance(tooltipDirective, false);
    tooltipDirective.message = tooltipMessage;
    tooltipDirective.show();
    tick(0); // Tick for the show delay (default is 0)
    expect(tooltipDirective._isTooltipVisible()).toBe(true);
    expect(tooltipDirective._tooltipInstance.message).toBe(tooltipMessage);
    tooltipDirective.hide();
    tick(500);
    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
  }));

  it('should not display tooltip when disabled', fakeAsync(() => {
    assertTooltipInstance(tooltipDirective, false);
    tooltipDirective.message = tooltipMessage;
    tooltipDirective.disabled = true;
    tooltipDirective.show();
    tick(0); // Tick for the show delay (default is 0)
    expect(tooltipDirective._isTooltipVisible()).toBe(false);
  }));

  it('should add proper tooltip class', fakeAsync(() => {
    assertTooltipInstance(tooltipDirective, false);
    tooltipDirective.message = tooltipMessage;
    tooltipDirective.tooltipClass = 'class';
    tooltipDirective.show();
    tick(0); // Tick for the show delay (default is 0)
    expect(tooltipDirective._isTooltipVisible()).toBe(true);
    expect(tooltipDirective._tooltipInstance.tooltipClass).toBe('class');
    tooltipDirective.hide();
    tick(500);
    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
  }));
});

/** Asserts whether a tooltip directive has a tooltip instance. */
function assertTooltipInstance(
  tooltip: OuiTooltip,
  shouldExist: boolean
): void {
  // Note that we have to cast this to a boolean, because Jasmine will go into an infinite loop
  // if it tries to stringify the `_tooltipInstance` when an assertion fails. The infinite loop
  // happens due to the `_tooltipInstance` having a circular structure.
  expect(!!tooltip._tooltipInstance).toBe(shouldExist);
}
