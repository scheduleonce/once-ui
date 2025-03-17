import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewChildren,
  QueryList,
  Type,
  Provider,
} from '@angular/core';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import {
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  DOWN_ARROW,
  TAB,
} from '@angular/cdk/keycodes';
import {
  OUI_MENU_DEFAULT_OPTIONS,
  OuiMenu,
  OuiMenuModule,
  OuiMenuPanel,
  OuiMenuTrigger,
  MenuPositionX,
  MenuPositionY,
  OuiMenuItem,
} from './public-api';
import { OUI_MENU_SCROLL_STRATEGY } from './menu-trigger';
import { Subject } from 'rxjs';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  dispatchFakeEvent,
  patchElementFocus,
  dispatchMouseEvent,
  createMouseEvent,
  dispatchKeyboardEvent,
  createKeyboardEvent,
  dispatchEvent,
} from '../core/test/utils';

@Component({
  template: `
    <button [ouiMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>
    <oui-menu
      #menu="ouiMenu"
      class="custom-one custom-two"
      (closed)="closeCallback($event)"
      [backdropClass]="backdropClass"
    >
      <button oui-menu-item>Item</button>
      <button oui-menu-item disabled>Disabled</button>
      <button oui-menu-item disableRipple>
        <oui-fake-icon>unicorn</oui-fake-icon>
        Item with an icon
      </button>
      <button *ngFor="let item of extraItems" oui-menu-item>{{ item }}</button>
    </oui-menu>
  `,
  standalone: false,
})
class SimpleMenu {
  @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
  @ViewChild(OuiMenu) menu: OuiMenu;
  @ViewChildren(OuiMenuItem) items: QueryList<OuiMenuItem>;
  extraItems: string[] = [];
  closeCallback = jasmine.createSpy('menu closed callback');
  backdropClass: string;
}

@Component({
  template: `
    <button [ouiMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>
    <oui-menu [xPosition]="xPosition" [yPosition]="yPosition" #menu="ouiMenu">
      <button oui-menu-item>Positioned Content</button>
    </oui-menu>
  `,
  standalone: false,
})
class PositionedMenu {
  @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
  xPosition: MenuPositionX = 'before';
  yPosition: MenuPositionY = 'above';
}

interface TestableMenu {
  trigger: OuiMenuTrigger;
  triggerEl: ElementRef<HTMLElement>;
}
@Component({
  template: `
    <button [ouiMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>
    <oui-menu [overlapTrigger]="overlapTrigger" #menu="ouiMenu">
      <button oui-menu-item>Not overlapped Content</button>
    </oui-menu>
  `,
  standalone: false,
})
class OverlapMenu implements TestableMenu {
  @Input() overlapTrigger: boolean;
  @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
}

@Component({
  selector: 'oui-custom-menu',
  template: `
    <ng-template>
      Custom Menu header
      <ng-content></ng-content>
    </ng-template>
  `,
  exportAs: 'ouiCustomMenu',
  standalone: false,
})
class CustomMenuPanel implements OuiMenuPanel {
  direction: Direction;
  xPosition: MenuPositionX = 'after';
  yPosition: MenuPositionY = 'below';
  overlapTrigger = true;
  parentMenu: OuiMenuPanel;

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @Output() close = new EventEmitter<void | 'click' | 'keydown' | 'tab'>();
  focusFirstItem = () => {};
  resetActiveItem = () => {};
  setPositionClasses = () => {};
}

@Component({
  template: `
    <button [ouiMenuTriggerFor]="menu">Toggle menu</button>
    <oui-custom-menu #menu="ouiCustomMenu">
      <button oui-menu-item>Custom Content</button>
    </oui-custom-menu>
  `,
  standalone: false,
})
class CustomMenu {
  @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;
}

@Component({
  template: `
    <button
      [ouiMenuTriggerFor]="root"
      #rootTrigger="ouiMenuTrigger"
      #rootTriggerEl
    >
      Toggle menu
    </button>

    <button [ouiMenuTriggerFor]="levelTwo" #alternateTrigger="ouiMenuTrigger">
      Toggle alternate menu
    </button>

    <oui-menu #root="ouiMenu" (closed)="rootCloseCallback($event)">
      <button
        oui-menu-item
        id="level-one-trigger"
        [ouiMenuTriggerFor]="levelOne"
        #levelOneTrigger="ouiMenuTrigger"
      >
        One
      </button>
      <button oui-menu-item>Two</button>
      <button
        oui-menu-item
        *ngIf="showLazy"
        id="lazy-trigger"
        [ouiMenuTriggerFor]="lazy"
        #lazyTrigger="ouiMenuTrigger"
      >
        Three
      </button>
    </oui-menu>

    <oui-menu #levelOne="ouiMenu" (closed)="levelOneCloseCallback($event)">
      <button oui-menu-item>Four</button>
      <button
        oui-menu-item
        id="level-two-trigger"
        [ouiMenuTriggerFor]="levelTwo"
        #levelTwoTrigger="ouiMenuTrigger"
      >
        Five
      </button>
      <button oui-menu-item>Six</button>
    </oui-menu>

    <oui-menu #levelTwo="ouiMenu" (closed)="levelTwoCloseCallback($event)">
      <button oui-menu-item>Seven</button> <button oui-menu-item>Eight</button>
      <button oui-menu-item>Nine</button>
    </oui-menu>

    <oui-menu #lazy="ouiMenu">
      <button oui-menu-item>Ten</button> <button oui-menu-item>Eleven</button>
      <button oui-menu-item>Twelve</button>
    </oui-menu>
  `,
  standalone: false,
})
class NestedMenu {
  @ViewChild('root') rootMenu: OuiMenu;
  @ViewChild('rootTrigger') rootTrigger: OuiMenuTrigger;
  @ViewChild('rootTriggerEl') rootTriggerEl: ElementRef<HTMLElement>;
  @ViewChild('alternateTrigger')
  alternateTrigger: OuiMenuTrigger;
  readonly rootCloseCallback = jasmine.createSpy('root menu closed callback');

  @ViewChild('levelOne') levelOneMenu: OuiMenu;
  @ViewChild('levelOneTrigger')
  levelOneTrigger: OuiMenuTrigger;
  readonly levelOneCloseCallback = jasmine.createSpy(
    'level one menu closed callback'
  );

  @ViewChild('levelTwo') levelTwoMenu: OuiMenu;
  @ViewChild('levelTwoTrigger')
  levelTwoTrigger: OuiMenuTrigger;
  readonly levelTwoCloseCallback = jasmine.createSpy(
    'level one menu closed callback'
  );

  @ViewChild('lazy') lazyMenu: OuiMenu;
  @ViewChild('lazyTrigger') lazyTrigger: OuiMenuTrigger;
  showLazy = false;
}

@Component({
  template: `
    <button [ouiMenuTriggerFor]="root" #rootTriggerEl>Toggle menu</button>
    <oui-menu #root="ouiMenu">
      <button
        oui-menu-item
        class="level-one-trigger"
        *ngFor="let item of items"
        [ouiMenuTriggerFor]="levelOne"
      >
        {{ item }}
      </button>
    </oui-menu>

    <oui-menu #levelOne="ouiMenu">
      <button oui-menu-item>Four</button> <button oui-menu-item>Five</button>
    </oui-menu>
  `,
  standalone: false,
})
class NestedMenuRepeater {
  @ViewChild('rootTriggerEl') rootTriggerEl: ElementRef<HTMLElement>;
  @ViewChild('levelOneTrigger')
  levelOneTrigger: OuiMenuTrigger;

  items = ['one', 'two', 'three'];
}

@Component({
  template: `
    <button [ouiMenuTriggerFor]="root" #rootTriggerEl>Toggle menu</button>

    <oui-menu #root="ouiMenu">
      <button
        oui-menu-item
        class="level-one-trigger"
        [ouiMenuTriggerFor]="levelOne"
      >
        One
      </button>

      <oui-menu #levelOne="ouiMenu">
        <button oui-menu-item class="level-two-item">Two</button>
      </oui-menu>
    </oui-menu>
  `,
  standalone: false,
})
class SubmenuDeclaredInsideParentMenu {
  @ViewChild('rootTriggerEl') rootTriggerEl: ElementRef;
}

@Component({
  selector: 'oui-fake-icon',
  template: '<ng-content></ng-content>',
  standalone: false,
})
class FakeIcon {}

@Component({
  template: `
    <button [ouiMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>

    <oui-menu #menu="ouiMenu">
      <ng-template ouiMenuContent>
        <button oui-menu-item>Item</button>
        <button oui-menu-item>Another item</button>
      </ng-template>
    </oui-menu>
  `,
  standalone: false,
})
class SimpleLazyMenu {
  @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
  @ViewChildren(OuiMenuItem) items: QueryList<OuiMenuItem>;
}

@Component({
  template: `
    <button
      [ouiMenuTriggerFor]="menu"
      [ouiMenuTriggerData]="{ label: 'one' }"
      #triggerOne="ouiMenuTrigger"
    >
      One
    </button>

    <button
      [ouiMenuTriggerFor]="menu"
      [ouiMenuTriggerData]="{ label: 'two' }"
      #triggerTwo="ouiMenuTrigger"
    >
      Two
    </button>

    <oui-menu #menu="ouiMenu">
      <ng-template let-label="label" ouiMenuContent>
        <button oui-menu-item>{{ label }}</button>
      </ng-template>
    </oui-menu>
  `,
  standalone: false,
})
class LazyMenuWithContext {
  @ViewChild('triggerOne') triggerOne: OuiMenuTrigger;
  @ViewChild('triggerTwo') triggerTwo: OuiMenuTrigger;
}

@Component({
  template: `
    <button [ouiMenuTriggerFor]="one">Toggle menu</button>
    <oui-menu #one="ouiMenu"> <button oui-menu-item>One</button> </oui-menu>

    <oui-menu #two="ouiMenu"> <button oui-menu-item>Two</button> </oui-menu>
  `,
  standalone: false,
})
class DynamicPanelMenu {
  @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;
  @ViewChild('one') firstMenu: OuiMenu;
  @ViewChild('two') secondMenu: OuiMenu;
}

@Component({
  template: `
    <button [ouiMenuTriggerFor]="menu">Toggle menu</button>

    <oui-menu #menu="ouiMenu">
      <button oui-menu-item role="menuitemcheckbox" aria-checked="true">
        Checked
      </button>
      <button oui-menu-item role="menuitemcheckbox" aria-checked="false">
        Not checked
      </button>
    </oui-menu>
  `,
  standalone: false,
})
class MenuWithCheckboxItems {
  @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;
}

describe('OuiMenu', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let focusMonitor: FocusMonitor;

  function createComponent<T>(
    component: Type<T>,
    providers: Provider[] = [],
    declarations: any[] = []
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [OuiMenuModule, NoopAnimationsModule],
      declarations: [component, ...declarations],
      providers,
    }).compileComponents();

    inject(
      [OverlayContainer, FocusMonitor],
      (oc: OverlayContainer, fm: FocusMonitor) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        focusMonitor = fm;
      }
    )();

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

  it('should open the menu as an idempotent operation', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Item');
      expect(overlayContainerElement.textContent).toContain('Disabled');
    }).not.toThrowError();
  });

  it('should close the menu when a click occurs outside the menu', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();

    const backdrop = <HTMLElement>(
      overlayContainerElement.querySelector('.cdk-overlay-backdrop')
    );
    backdrop.click();
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.textContent).toBe('');
  }));

  it('should be able to remove the backdrop', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.menu.hasBackdrop = false;
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(
      overlayContainerElement.querySelector('.cdk-overlay-backdrop')
    ).toBeFalsy();
  }));

  it('should be able to remove the backdrop on repeat openings', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    // Start off with a backdrop.
    expect(
      overlayContainerElement.querySelector('.cdk-overlay-backdrop')
    ).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    // Change `hasBackdrop` after the first open.
    fixture.componentInstance.menu.hasBackdrop = false;
    fixture.detectChanges();

    // Reopen the menu.
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(
      overlayContainerElement.querySelector('.cdk-overlay-backdrop')
    ).toBeFalsy();
  }));

  it('should restore focus to the trigger when the menu was opened by keyboard', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    // A click without a mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();

    expect(
      overlayContainerElement.querySelector('.oui-menu-panel')
    ).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(triggerEl);
  }));

  it('should be able to set a custom class on the backdrop', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.componentInstance.backdropClass = 'custom-backdrop';
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const backdrop = <HTMLElement>(
      overlayContainerElement.querySelector('.cdk-overlay-backdrop')
    );

    expect(backdrop.classList).toContain('custom-backdrop');
  }));

  it('should restore focus to the root trigger when the menu was opened by mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    dispatchFakeEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();

    expect(
      overlayContainerElement.querySelector('.oui-menu-panel')
    ).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(triggerEl);
  }));

  it('should restore focus to the root trigger when the menu was opened by touch', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    dispatchFakeEvent(triggerEl, 'touchstart');
    triggerEl.click();
    fixture.detectChanges();

    expect(
      overlayContainerElement.querySelector('.oui-menu-panel')
    ).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    flush();

    expect(document.activeElement).toBe(triggerEl);
  }));

  it('should scroll the panel to the top on open, when it is scrollable', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    // Add 50 items to make the menu scrollable
    fixture.componentInstance.extraItems = new Array(50).fill('Hello there');
    fixture.detectChanges();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    dispatchFakeEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();

    // Flush due to the additional tick that is necessary for the FocusMonitor.
    flush();

    expect(
      overlayContainerElement.querySelector('.oui-menu-panel')!.scrollTop
    ).toBe(0);
  }));

  it('should set the proper focus origin when restoring focus after opening by keyboard', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);
    triggerEl.click(); // A click without a mousedown before it is considered a keyboard open.
    fixture.detectChanges();
    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(triggerEl.classList).toContain('cdk-program-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should set the proper focus origin when restoring focus after opening by mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();
    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);
    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(triggerEl.classList).toContain('cdk-mouse-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should set proper focus origin when right clicking on trigger, before opening by keyboard', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);

    // Trigger a fake right click.
    dispatchEvent(triggerEl, createMouseEvent('mousedown', 50, 100, 2));

    // A click without a left button mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(triggerEl.classList).toContain('cdk-program-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should set the proper focus origin when restoring focus after opening by touch', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'touchstart');
    triggerEl.click();
    fixture.detectChanges();
    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);
    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    flush();

    expect(triggerEl.classList).toContain('cdk-touch-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should close the menu when pressing ESCAPE', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();

    const panel = overlayContainerElement.querySelector('.oui-menu-panel')!;
    const event: Event = createKeyboardEvent('keydown', ESCAPE);

    dispatchEvent(panel, event);
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.textContent).toBe('');
  }));

  it('should open a custom menu', () => {
    const fixture = createComponent(CustomMenu, [], [CustomMenuPanel]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.componentInstance.trigger.openMenu();

      expect(overlayContainerElement.textContent).toContain(
        'Custom Menu header'
      );
      expect(overlayContainerElement.textContent).toContain('Custom Content');
    }).not.toThrowError();
  });

  it('should transfer any custom classes from the host to the overlay', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const menuEl = fixture.debugElement.query(By.css('oui-menu')).nativeElement;
    const panel = overlayContainerElement.querySelector('.oui-menu-panel')!;

    expect(menuEl.classList).not.toContain('custom-one');
    expect(menuEl.classList).not.toContain('custom-two');

    expect(panel.classList).toContain('custom-one');
    expect(panel.classList).toContain('custom-two');
  });

  it('should set the "menu" role on the overlay panel', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const menuPanel = overlayContainerElement.querySelector('.oui-menu-panel');

    expect(menuPanel).toBeTruthy('Expected to find a menu panel.');

    const role = menuPanel ? menuPanel.getAttribute('role') : '';
    expect(role).toBe('menu', 'Expected panel to have the "menu" role.');
  });

  it('should set the "menuitem" role on the items by default', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const items = Array.from(
      overlayContainerElement.querySelectorAll('.oui-menu-item')
    );

    expect(items.length).toBeGreaterThan(0);
    expect(
      items.every((item) => item.getAttribute('role') === 'menuitem')
    ).toBe(true);
  });

  it('should be able to set an alternate role on the menu items', () => {
    const fixture = createComponent(MenuWithCheckboxItems);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const items = Array.from(
      overlayContainerElement.querySelectorAll('.oui-menu-item')
    );

    expect(items.length).toBeGreaterThan(0);
    expect(
      items.every((item) => item.getAttribute('role') === 'menuitemcheckbox')
    ).toBe(true);
  });

  it('should not throw an error on destroy', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    expect(fixture.destroy.bind(fixture)).not.toThrow();
  });

  it('should be able to extract the menu item text', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.first.getLabel()).toBe('Item');
  });

  it('should filter out non-text nodes when figuring out the label', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.last.getLabel()).toBe(
      'Item with an icon'
    );
  });

  it('should set the proper focus origin when opening by mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    spyOn(fixture.componentInstance.items.first, 'focus').and.callThrough();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();
    tick(500);

    expect(fixture.componentInstance.items.first.focus).toHaveBeenCalledWith(
      'mouse'
    );
  }));

  it('should set the proper focus origin when opening by touch', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    spyOn(fixture.componentInstance.items.first, 'focus').and.callThrough();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'touchstart');
    triggerEl.click();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.items.first.focus).toHaveBeenCalledWith(
      'touch'
    );
  }));

  it('should close the menu when using the CloseScrollStrategy', fakeAsync(() => {
    const scrolledSubject: Subject<void> = new Subject();
    const fixture = createComponent(
      SimpleMenu,
      [
        {
          provide: ScrollDispatcher,
          useFactory: () => ({ scrolled: () => scrolledSubject }),
        },
        {
          provide: OUI_MENU_SCROLL_STRATEGY,
          deps: [Overlay],
          useFactory: (overlay: Overlay) => () =>
            overlay.scrollStrategies.close(),
        },
      ],
      [FakeIcon]
    );
    fixture.detectChanges();
    const trigger = fixture.componentInstance.trigger;

    fixture.detectChanges();
    trigger.openMenu();
    fixture.detectChanges();

    expect(trigger.menuOpen).toBe(true);

    scrolledSubject.next();
    tick(500);

    expect(trigger.menuOpen).toBe(false);
  }));

  it('should switch to keyboard focus when using the keyboard after opening using the mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.detectChanges();
    fixture.componentInstance.triggerEl.nativeElement.click();
    fixture.detectChanges();

    const panel = document.querySelector('.oui-menu-panel')! as HTMLElement;
    const items: HTMLElement[] = Array.from(
      panel.querySelectorAll('.oui-menu-panel [oui-menu-item]')
    );

    items.forEach((item) => patchElementFocus(item));

    tick(500);
    tick();
    fixture.detectChanges();
    expect(
      items.some((item) => item.classList.contains('cdk-keyboard-focused'))
    ).toBe(false);

    dispatchKeyboardEvent(panel, 'keydown', DOWN_ARROW);
    fixture.detectChanges();

    // Flush due to the additional tick that is necessary for the FocusMonitor.
    flush();
    // We skip to the third item, because the second one is disabled.
    expect(items[2].classList).toContain('cdk-focused');
    expect(items[2].classList).toContain('cdk-keyboard-focused');
  }));

  it('should toggle the aria-expanded attribute on the trigger', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    expect(triggerEl.hasAttribute('aria-expanded')).toBe(false);

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();

    expect(triggerEl.hasAttribute('aria-expanded')).toBe(false);
  });

  it('should throw the correct error if the menu is not defined after init', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.menu = null!;
    fixture.detectChanges();

    expect(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
    }).toThrowError(/must pass in an oui-menu instance/);
  });

  it('should be able to swap out a menu after the first time it is opened', fakeAsync(() => {
    const fixture = createComponent(DynamicPanelMenu);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('One');
    expect(overlayContainerElement.textContent).not.toContain('Two');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toBe('');

    fixture.componentInstance.trigger.menu =
      fixture.componentInstance.secondMenu;
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).not.toContain('One');
    expect(overlayContainerElement.textContent).toContain('Two');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toBe('');
  }));

  describe('lazy rendering', () => {
    it('should be able to render the menu content lazily', fakeAsync(() => {
      const fixture = createComponent(SimpleLazyMenu);

      fixture.detectChanges();
      fixture.componentInstance.triggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      const panel = overlayContainerElement.querySelector('.oui-menu-panel')!;

      expect(panel).toBeTruthy('Expected panel to be defined');
      expect(panel.textContent).toContain(
        'Another item',
        'Expected panel to have correct content'
      );
      expect(fixture.componentInstance.trigger.menuOpen).toBe(
        true,
        'Expected menu to be open'
      );
    }));

    it('should be able to open the same menu with a different context', fakeAsync(() => {
      const fixture = createComponent(LazyMenuWithContext);

      fixture.detectChanges();
      fixture.componentInstance.triggerOne.openMenu();
      fixture.detectChanges();
      tick(500);

      let item = overlayContainerElement.querySelector(
        '.oui-menu-panel [oui-menu-item]'
      )!;

      expect(item.textContent!.trim()).toBe('one');

      fixture.componentInstance.triggerOne.closeMenu();
      fixture.detectChanges();
      tick(500);

      fixture.componentInstance.triggerTwo.openMenu();
      fixture.detectChanges();
      tick(500);
      item = overlayContainerElement.querySelector(
        '.oui-menu-panel [oui-menu-item]'
      )!;

      expect(item.textContent!.trim()).toBe('two');
    }));
  });

  describe('positions', () => {
    let fixture: ComponentFixture<PositionedMenu>;
    let trigger: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(PositionedMenu);
      fixture.detectChanges();

      trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the bottom edge of viewport,so it has space to open "above"
      trigger.style.position = 'fixed';
      trigger.style.top = '600px';

      // Push trigger to the right, so it has space to open "before"
      trigger.style.left = '100px';
    });

    it('should append oui-menu-above if the y position is changed', () => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector(
        '.oui-menu-panel'
      ) as HTMLElement;

      expect(panel.classList).toContain('oui-menu-above');
      expect(panel.classList).not.toContain('oui-menu-below');

      fixture.componentInstance.yPosition = 'below';
      fixture.detectChanges();

      expect(panel.classList).toContain('oui-menu-below');
      expect(panel.classList).not.toContain('oui-menu-above');
    });

    it('should default to the "below" and "after" positions', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();

      const newFixture = createComponent(SimpleMenu, [], [FakeIcon]);

      newFixture.detectChanges();
      newFixture.componentInstance.trigger.openMenu();
      newFixture.detectChanges();
      const panel = overlayContainerElement.querySelector(
        '.oui-menu-panel'
      ) as HTMLElement;

      expect(panel.classList).toContain('oui-menu-below');
      expect(panel.classList).toContain('oui-menu-after');
    });
  });

  describe('overlapping trigger', () => {
    /**
     * This test class is used to create components containing a menu.
     * It provides helpers to reposition the trigger, open the menu,
     * and access the trigger and overlay positions.
     * Additionally it can take any inputs for the menu wrapper component.
     *
     * Basic usage:
     * const subject = new OverlapSubject(MyComponent);
     * subject.openMenu();
     */
    class OverlapSubject<T extends TestableMenu> {
      readonly fixture: ComponentFixture<T>;
      readonly trigger: HTMLElement;
      // eslint-disable-next-line @typescript-eslint/prefer-function-type
      constructor(ctor: { new (): T }, inputs: { [key: string]: any } = {}) {
        this.fixture = createComponent(ctor);
        Object.keys(inputs).forEach(
          (key) => ((this.fixture.componentInstance as any)[key] = inputs[key])
        );
        this.fixture.detectChanges();
        this.trigger = this.fixture.componentInstance.triggerEl.nativeElement;
      }

      openMenu() {
        this.fixture.componentInstance.trigger.openMenu();
        this.fixture.detectChanges();
      }

      get overlayRect() {
        return this.getOverlayPane().getBoundingClientRect();
      }

      get triggerRect() {
        return this.trigger.getBoundingClientRect();
      }

      get menuPanel() {
        return overlayContainerElement.querySelector('.oui-menu-panel');
      }

      private getOverlayPane() {
        return overlayContainerElement.querySelector(
          '.cdk-overlay-pane'
        ) as HTMLElement;
      }
    }

    let subject: OverlapSubject<OverlapMenu>;

    describe('not overlapping', () => {
      beforeEach(() => {
        subject = new OverlapSubject(OverlapMenu, { overlapTrigger: false });
      });

      it('repositions the origin to be below, so the menu opens from the trigger', () => {
        subject.openMenu();
        subject.fixture.detectChanges();

        expect(subject.menuPanel!.classList).toContain('oui-menu-below');
        expect(subject.menuPanel!.classList).not.toContain('oui-menu-above');
      });
    });
  });

  describe('animations', () => {
    describe('close event', () => {
      let fixture: ComponentFixture<SimpleMenu>;

      beforeEach(() => {
        fixture = createComponent(SimpleMenu, [], [FakeIcon]);
        fixture.detectChanges();
        fixture.componentInstance.trigger.openMenu();
        fixture.detectChanges();
      });

      it('should emit an event when a menu item is clicked', () => {
        const menuItem = overlayContainerElement.querySelector(
          '[oui-menu-item]'
        ) as HTMLElement;

        menuItem.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith(
          'click'
        );
        expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(
          1
        );
      });

      it('should emit a close event when the backdrop is clicked', () => {
        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop'
        ) as HTMLElement;

        backdrop.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith(
          undefined
        );
        expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(
          1
        );
      });

      it('should emit an event when pressing ESCAPE', () => {
        const menu = overlayContainerElement.querySelector(
          '.oui-menu-panel'
        ) as HTMLElement;

        dispatchKeyboardEvent(menu, 'keydown', ESCAPE);
        fixture.detectChanges();

        expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith(
          'keydown'
        );
        expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(
          1
        );
      });

      it('should complete the callback when the menu is destroyed', () => {
        const emitCallback = jasmine.createSpy('emit callback');
        const completeCallback = jasmine.createSpy('complete callback');

        fixture.componentInstance.menu.closed.subscribe(
          emitCallback,
          null,
          completeCallback
        );
        fixture.destroy();

        expect(emitCallback).toHaveBeenCalledWith(undefined);
        expect(emitCallback).toHaveBeenCalledTimes(1);
        expect(completeCallback).toHaveBeenCalled();
      });
    });

    describe('nested menu', () => {
      let fixture: ComponentFixture<NestedMenu>;
      let instance: NestedMenu;
      let overlay: HTMLElement;
      const compileTestComponent = (direction: Direction = 'ltr') => {
        fixture = createComponent(NestedMenu, [
          {
            provide: Directionality,
            useFactory: () => ({ value: direction }),
          },
        ]);

        fixture.detectChanges();
        instance = fixture.componentInstance;
        overlay = overlayContainerElement;
      };

      it('should set the `triggersSubmenu` flags on the triggers', () => {
        compileTestComponent();
        expect(instance.rootTrigger.triggersSubmenu()).toBe(false);
        expect(instance.levelOneTrigger.triggersSubmenu()).toBe(true);
        expect(instance.levelTwoTrigger.triggersSubmenu()).toBe(true);
      });

      it('should set the `parentMenu` on the sub-menu instances', () => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();

        instance.levelOneTrigger.openMenu();
        fixture.detectChanges();

        instance.levelTwoTrigger.openMenu();
        fixture.detectChanges();

        expect(instance.rootMenu.parentMenu).toBeFalsy();
        expect(instance.levelOneMenu.parentMenu).toBe(instance.rootMenu);
        expect(instance.levelTwoMenu.parentMenu).toBe(instance.levelOneMenu);
      });

      it('should emit an event when the hover state of the menu items changes', () => {
        compileTestComponent();
        instance.rootTrigger.openMenu();
        fixture.detectChanges();

        const spy = jasmine.createSpy('hover spy');
        const subscription = instance.rootMenu._hovered().subscribe(spy);
        const menuItems = overlay.querySelectorAll('[oui-menu-item]');

        dispatchMouseEvent(menuItems[0], 'mouseenter');
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(1);

        dispatchMouseEvent(menuItems[1], 'mouseenter');
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(2);

        subscription.unsubscribe();
      });

      it('should toggle a nested menu when its trigger is hovered', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        const items = Array.from(
          overlay.querySelectorAll('.oui-menu-panel [oui-menu-item]')
        );
        const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

        dispatchMouseEvent(levelOneTrigger, 'mouseenter');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(levelOneTrigger.classList).toContain(
          'oui-menu-item-highlighted',
          'Expected the trigger to be highlighted'
        );
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );

        dispatchMouseEvent(
          items[items.indexOf(levelOneTrigger) + 1],
          'mouseenter'
        );
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );
        expect(levelOneTrigger.classList).not.toContain(
          'oui-menu-item-highlighted',
          'Expected the trigger to not be highlighted'
        );
      }));

      it('should close all the open sub-menus when the hover state is changed at the root', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();

        const items = Array.from(
          overlay.querySelectorAll('.oui-menu-panel [oui-menu-item]')
        );
        const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

        dispatchMouseEvent(levelOneTrigger, 'mouseenter');
        fixture.detectChanges();
        tick();

        const levelTwoTrigger = overlay.querySelector(
          '#level-two-trigger'
        )! as HTMLElement;
        dispatchMouseEvent(levelTwoTrigger, 'mouseenter');
        fixture.detectChanges();
        tick();

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          3,
          'Expected three open menus'
        );

        dispatchMouseEvent(
          items[items.indexOf(levelOneTrigger) + 1],
          'mouseenter'
        );
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );
      }));

      it('should close submenu when hovering over disabled sibling item', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();
        tick(500);

        const items = fixture.debugElement.queryAll(By.directive(OuiMenuItem));

        dispatchFakeEvent(items[0].nativeElement as HTMLElement, 'mouseenter');
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );

        items[1].componentInstance.disabled = true;
        fixture.detectChanges();

        // Invoke the handler directly since the fake events are flaky on disabled elements.
        items[1].componentInstance._handleMouseEnter();
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );
      }));

      it('should not open submenu when hovering over disabled trigger', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        const item = fixture.debugElement.query(By.directive(OuiMenuItem));

        item.componentInstance.disabled = true;
        fixture.detectChanges();

        // Invoke the handler directly since the fake events are flaky on disabled elements.
        item.componentInstance._handleMouseEnter();
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected to remain at one open menu'
        );
      }));

      it('should open a nested menu when its trigger is clicked', () => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        const levelOneTrigger = overlay.querySelector(
          '#level-one-trigger'
        )! as HTMLElement;

        levelOneTrigger.click();
        fixture.detectChanges();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );

        levelOneTrigger.click();
        fixture.detectChanges();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected repeat clicks not to close the menu.'
        );
      });

      it('should open and close a nested menu with arrow keys in ltr', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        const levelOneTrigger = overlay.querySelector(
          '#level-one-trigger'
        )! as HTMLElement;

        dispatchKeyboardEvent(levelOneTrigger, 'keydown', RIGHT_ARROW);
        fixture.detectChanges();

        const panels = overlay.querySelectorAll('.oui-menu-panel');

        expect(panels.length).toBe(2, 'Expected two open menus');
        dispatchKeyboardEvent(panels[1], 'keydown', LEFT_ARROW);
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(1);
      }));

      it('should not do anything with the arrow keys for a top-level menu', () => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();

        const menu = overlay.querySelector('.oui-menu-panel')!;

        dispatchKeyboardEvent(menu, 'keydown', RIGHT_ARROW);
        fixture.detectChanges();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one menu to remain open'
        );

        dispatchKeyboardEvent(menu, 'keydown', LEFT_ARROW);
        fixture.detectChanges();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one menu to remain open'
        );
      });

      it('should close all of the menus when the backdrop is clicked', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();

        instance.levelOneTrigger.openMenu();
        fixture.detectChanges();

        instance.levelTwoTrigger.openMenu();
        fixture.detectChanges();

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          3,
          'Expected three open menus'
        );
        expect(overlay.querySelectorAll('.cdk-overlay-backdrop').length).toBe(
          1,
          'Expected one backdrop element'
        );
        expect(
          overlay.querySelectorAll('.oui-menu-panel, .cdk-overlay-backdrop')[0]
            .classList
        ).toContain(
          'cdk-overlay-backdrop',
          'Expected backdrop to be beneath all of the menus'
        );

        (
          overlay.querySelector('.cdk-overlay-backdrop')! as HTMLElement
        ).click();
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          0,
          'Expected no open menus'
        );
      }));

      it('should shift focus between the sub-menus', () => {
        compileTestComponent();
        instance.rootTrigger.openMenu();
        fixture.detectChanges();

        expect(
          overlay
            .querySelector('.oui-menu-panel')!
            .contains(document.activeElement)
        ).toBe(true, 'Expected focus to be inside the root menu');

        instance.levelOneTrigger.openMenu();
        fixture.detectChanges();

        expect(
          overlay
            .querySelectorAll('.oui-menu-panel')[1]
            .contains(document.activeElement)
        ).toBe(true, 'Expected focus to be inside the first nested menu');

        instance.levelTwoTrigger.openMenu();
        fixture.detectChanges();

        expect(
          overlay
            .querySelectorAll('.oui-menu-panel')[2]
            .contains(document.activeElement)
        ).toBe(true, 'Expected focus to be inside the second nested menu');

        instance.levelTwoTrigger.closeMenu('keydown');
        fixture.detectChanges();

        expect(
          overlay
            .querySelectorAll('.oui-menu-panel')[1]
            .contains(document.activeElement)
        ).toBe(true, 'Expected focus to be back inside the first nested menu');

        instance.levelOneTrigger.closeMenu('keydown');
        fixture.detectChanges();

        expect(
          overlay
            .querySelector('.oui-menu-panel')!
            .contains(document.activeElement)
        ).toBe(true, 'Expected focus to be back inside the root menu');
      });

      it('should close all of the menus when an item is clicked', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();

        instance.levelOneTrigger.openMenu();
        fixture.detectChanges();

        instance.levelTwoTrigger.openMenu();
        fixture.detectChanges();

        const menus = overlay.querySelectorAll('.oui-menu-panel');

        expect(menus.length).toBe(3, 'Expected three open menus');

        (menus[2].querySelector('.oui-menu-item')! as HTMLElement).click();
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          0,
          'Expected no open menus'
        );
      }));

      it('should close all of the menus when the user tabs away', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();

        instance.levelOneTrigger.openMenu();
        fixture.detectChanges();

        instance.levelTwoTrigger.openMenu();
        fixture.detectChanges();

        const menus = overlay.querySelectorAll('.oui-menu-panel');

        expect(menus.length).toBe(3, 'Expected three open menus');

        dispatchKeyboardEvent(menus[menus.length - 1], 'keydown', TAB);
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          0,
          'Expected no open menus'
        );
      }));

      it('should set a class on the menu items that trigger a sub-menu', () => {
        compileTestComponent();
        instance.rootTrigger.openMenu();
        fixture.detectChanges();

        const menuItems = overlay.querySelectorAll('[oui-menu-item]');

        expect(menuItems[0].classList).toContain(
          'oui-menu-item-submenu-trigger'
        );
        expect(menuItems[1].classList).not.toContain(
          'oui-menu-item-submenu-trigger'
        );
      });

      it('should close all of the menus when the root is closed programmatically', fakeAsync(() => {
        compileTestComponent();
        instance.rootTrigger.openMenu();
        fixture.detectChanges();

        instance.levelOneTrigger.openMenu();
        fixture.detectChanges();

        instance.levelTwoTrigger.openMenu();
        fixture.detectChanges();

        const menus = overlay.querySelectorAll('.oui-menu-panel');

        expect(menus.length).toBe(3, 'Expected three open menus');

        instance.rootTrigger.closeMenu();
        fixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          0,
          'Expected no open menus'
        );
      }));

      it('should toggle a nested menu when its trigger is added after init', fakeAsync(() => {
        compileTestComponent();
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        instance.showLazy = true;
        fixture.detectChanges();

        const lazyTrigger = overlay.querySelector('#lazy-trigger')!;

        dispatchMouseEvent(lazyTrigger, 'mouseenter');
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();

        expect(lazyTrigger.classList).toContain(
          'oui-menu-item-highlighted',
          'Expected the trigger to be highlighted'
        );
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );
      }));

      it('should prevent the default mousedown action if the menu item opens a sub-menu', () => {
        compileTestComponent();
        instance.rootTrigger.openMenu();
        fixture.detectChanges();

        const event = createMouseEvent('mousedown');

        event.preventDefault = jasmine.createSpy('preventDefault spy');

        dispatchMouseEvent(
          overlay.querySelector('[oui-menu-item]')!,
          'mousedown',
          0,
          0,
          event
        );
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle the items being rendered in a repeater', fakeAsync(() => {
        const repeaterFixture = createComponent(NestedMenuRepeater);
        overlay = overlayContainerElement;

        expect(() => repeaterFixture.detectChanges()).not.toThrow();

        repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
        repeaterFixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        dispatchMouseEvent(
          overlay.querySelector('.level-one-trigger')!,
          'mouseenter'
        );
        repeaterFixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );
      }));

      it('should be able to trigger the same nested menu from different triggers', fakeAsync(() => {
        const repeaterFixture = createComponent(NestedMenuRepeater);
        overlay = overlayContainerElement;

        repeaterFixture.detectChanges();
        repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
        repeaterFixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        const triggers = overlay.querySelectorAll('.level-one-trigger');

        dispatchMouseEvent(triggers[0], 'mouseenter');
        repeaterFixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );

        dispatchMouseEvent(triggers[1], 'mouseenter');
        repeaterFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );
      }));

      it('should close the initial menu if the user moves away while animating', fakeAsync(() => {
        const repeaterFixture = createComponent(NestedMenuRepeater);
        overlay = overlayContainerElement;

        repeaterFixture.detectChanges();
        repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
        repeaterFixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        const triggers = overlay.querySelectorAll('.level-one-trigger');

        dispatchMouseEvent(triggers[0], 'mouseenter');
        repeaterFixture.detectChanges();
        tick(100);
        dispatchMouseEvent(triggers[1], 'mouseenter');
        repeaterFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );
      }));

      it(
        'should be able to open a submenu through an item that is not a direct descendant ' +
          'of the panel',
        fakeAsync(() => {
          const nestedFixture = createComponent(
            SubmenuDeclaredInsideParentMenu
          );
          overlay = overlayContainerElement;

          nestedFixture.detectChanges();
          nestedFixture.componentInstance.rootTriggerEl.nativeElement.click();
          nestedFixture.detectChanges();
          tick(500);
          expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
            1,
            'Expected one open menu'
          );

          dispatchMouseEvent(
            overlay.querySelector('.level-one-trigger')!,
            'mouseenter'
          );
          nestedFixture.detectChanges();
          tick(500);

          expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
            2,
            'Expected two open menus'
          );
        })
      );

      it(
        'should not close when hovering over a menu item inside a sub-menu panel that is declared' +
          'inside the root menu',
        fakeAsync(() => {
          const nestedFixture = createComponent(
            SubmenuDeclaredInsideParentMenu
          );
          overlay = overlayContainerElement;

          nestedFixture.detectChanges();
          nestedFixture.componentInstance.rootTriggerEl.nativeElement.click();
          nestedFixture.detectChanges();
          tick(500);
          expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
            1,
            'Expected one open menu'
          );

          dispatchMouseEvent(
            overlay.querySelector('.level-one-trigger')!,
            'mouseenter'
          );
          nestedFixture.detectChanges();
          tick(500);

          expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
            2,
            'Expected two open menus'
          );

          dispatchMouseEvent(
            overlay.querySelector('.level-two-item')!,
            'mouseenter'
          );
          nestedFixture.detectChanges();
          tick(500);

          expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
            2,
            'Expected two open menus to remain'
          );
        })
      );

      it('should not re-focus a child menu trigger when hovering another trigger', fakeAsync(() => {
        compileTestComponent();

        dispatchFakeEvent(instance.rootTriggerEl.nativeElement, 'mousedown');
        instance.rootTriggerEl.nativeElement.click();
        fixture.detectChanges();

        const items = Array.from(
          overlay.querySelectorAll('.oui-menu-panel [oui-menu-item]')
        );
        const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

        dispatchMouseEvent(levelOneTrigger, 'mouseenter');
        fixture.detectChanges();
        tick();
        expect(overlay.querySelectorAll('.oui-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );

        dispatchMouseEvent(
          items[items.indexOf(levelOneTrigger) + 1],
          'mouseenter'
        );
        fixture.detectChanges();
        tick(500);

        expect(document.activeElement).not.toBe(
          levelOneTrigger,
          'Expected focus not to be returned to the initial trigger.'
        );
      }));
    });
  });
});

describe('OuiMenu default overrides', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiMenuModule, NoopAnimationsModule],
      declarations: [SimpleMenu, FakeIcon],
      providers: [
        {
          provide: OUI_MENU_DEFAULT_OPTIONS,
          useValue: {
            overlapTrigger: true,
            xPosition: 'before',
            yPosition: 'above',
          },
        },
      ],
    }).compileComponents();
  }));

  it('should allow for the default menu options to be overridden', () => {
    const fixture = TestBed.createComponent(SimpleMenu);
    fixture.detectChanges();
    const menu = fixture.componentInstance.menu;

    expect(menu.overlapTrigger).toBe(true);
    expect(menu.xPosition).toBe('before');
    expect(menu.yPosition).toBe('above');
  });
});
