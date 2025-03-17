import { OverlayContainer } from '@angular/cdk/overlay';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Type,
  Provider,
  Component,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  tick,
  fakeAsync,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { OuiPanelModule } from './panel-module';
import { OuiPanelTrigger } from './panel-trigger';
import { OuiPanel } from './panel';
import { OuiIconTestingModule } from '../icon/public-api';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({
  selector: 'oui-fake-icon',
  template: '<ng-content></ng-content>',
  standalone: false,
})
class FakeIcon {}

// eslint-disable-next-line @angular-eslint/component-selector
@Component({
  template: `
    <button [ouiPanelTriggerFor]="panel" #triggerEl>Toggle panel</button>
    <oui-panel #panel>
      <h6>Lorem ipsum, dolor sit amet consectetur</h6>
      <p>Lorem ipsum dolor sit, amet consectetur adipisiciiandae</p>
      <p>Lorem ipsum dolor sit amet</p>
    </oui-panel>
  `,
  standalone: false,
})
class SimplePanel {
  @ViewChild(OuiPanelTrigger) trigger: OuiPanelTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
  @ViewChild(OuiPanel) panel: OuiPanel;
}

describe('OuiPanel', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  // @ts-ignore
  let focusMonitor: FocusMonitor;
  function createComponent<T>(
    component: Type<T>,
    providers: Provider[] = [],
    declarations: any[] = []
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [OuiPanelModule, OuiIconTestingModule],
      declarations: [component, ...declarations],
      providers,
    }).compileComponents();

    inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject(
    [OverlayContainer],
    (currentOverlayContainer: OverlayContainer) => {
      // Since we're resetting the testing module in some of the tests,
      // we can potentially have multiple overlay containers.
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();
    }
  ));

  it('should open the panel as an idempotent operation', () => {
    const fixture = createComponent(SimplePanel, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('h6')).toBeTruthy();
      expect(overlayContainerElement.querySelector('p')).toBeTruthy();
      expect(overlayContainerElement.textContent).toContain('Lorem ipsum');
    }).not.toThrowError();
  });

  it('should open the panel by mouse-enter on trigger', () => {
    const fixture = createComponent(SimplePanel, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      const triggerEl = fixture.componentInstance.triggerEl;
      const event = new Event('mouseenter');
      triggerEl.nativeElement.dispatchEvent(event);
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('h6')).toBeTruthy();
      expect(overlayContainerElement.querySelector('p')).toBeTruthy();
      expect(overlayContainerElement.textContent).toContain('Lorem ipsum');
    }).not.toThrowError();
  });

  it('should close the panel by mouse-leave on trigger after 200ms delay', fakeAsync(() => {
    const fixture = createComponent(SimplePanel, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    // opening dialog
    const triggerEl = fixture.componentInstance.triggerEl;
    const mouseEnter = new Event('mouseenter');
    triggerEl.nativeElement.dispatchEvent(mouseEnter);
    fixture.detectChanges();
    // closing dialog
    const mouseLeave = new Event('mouseleave');
    triggerEl.nativeElement.dispatchEvent(mouseLeave);
    fixture.detectChanges();
    tick(400);
    expect(overlayContainerElement.textContent).toBe('');
  }));

  it('should not close the panel by mouse-leave on trigger before 200ms delay', fakeAsync(() => {
    const fixture = createComponent(SimplePanel, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    // opening dialog
    const triggerEl = fixture.componentInstance.triggerEl;
    const mouseEnter = new Event('mouseenter');
    triggerEl.nativeElement.dispatchEvent(mouseEnter);
    fixture.detectChanges();
    // closing dialog
    const mouseLeave = new Event('mouseleave');
    triggerEl.nativeElement.dispatchEvent(mouseLeave);
    tick(100);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toContain('Lorem');
    discardPeriodicTasks();
  }));

  it('should not close the panel by mouse-leave on trigger if mouse-enter event happens on trigger before 200ms', fakeAsync(() => {
    const fixture = createComponent(SimplePanel, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    // mouse enters in trigger
    const triggerEl = fixture.componentInstance.triggerEl;
    let mouseEnter = new Event('mouseenter');
    triggerEl.nativeElement.dispatchEvent(mouseEnter);
    fixture.detectChanges();
    // mouse leave in trigger
    const mouseLeave = new Event('mouseleave');
    triggerEl.nativeElement.dispatchEvent(mouseLeave);
    fixture.detectChanges();
    tick(100);
    // mouse enters again before 200ms
    mouseEnter = new Event('mouseenter');
    triggerEl.nativeElement.dispatchEvent(mouseEnter);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toContain('Lorem');
    discardPeriodicTasks();
  }));

  it('should not close the panel by mouse-leave on trigger if mouse-enter event happens on overlay panel before 200ms', fakeAsync(() => {
    const fixture = createComponent(SimplePanel, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    // mouse enters in trigger
    const triggerEl = fixture.componentInstance.triggerEl;
    let mouseEnter = new Event('mouseenter');
    triggerEl.nativeElement.dispatchEvent(mouseEnter);
    fixture.detectChanges();
    // mouse leave in trigger
    const mouseLeave = new Event('mouseleave');
    triggerEl.nativeElement.dispatchEvent(mouseLeave);
    fixture.detectChanges();
    tick(100);
    // mouse enters again before 200ms
    mouseEnter = new Event('mouseenter');
    overlayContainerElement.dispatchEvent(mouseEnter);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toContain('Lorem');
    discardPeriodicTasks();
  }));

  it('should set the "dialog" role on the overlay panel', () => {
    const fixture = createComponent(SimplePanel, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();

    const overlayPanel = overlayContainerElement.querySelector('.oui-panel');

    expect(overlayPanel).toBeTruthy('Expected to find a overlay panel.');

    const role = overlayPanel ? overlayPanel.getAttribute('role') : '';
    expect(role).toBe('dialog', 'Expected panel to have the "dialog" role.');
  });
});
