import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  waitForAsync,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { Subject } from 'rxjs';
import { OuiTabsModule } from '../module';
import { OuiTabLink, OuiTabNav } from './tab-nav-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OUI_TABS_CONFIG } from '../index';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
} from '../../core/test/utils';

describe('MDC-based OuiTabNavBar', () => {
  const dir: Direction = 'ltr';
  const dirChange = new Subject();
  let globalRippleOptions: any;

  beforeEach(waitForAsync(() => {
    globalRippleOptions = {};

    TestBed.configureTestingModule({
      imports: [OuiTabsModule],
      declarations: [
        SimpleTabNavBarTestApp,
        TabLinkWithNgIf,
        TabBarWithInactiveTabsOnInit,
      ],
      providers: [
        {
          provide: Directionality,
          useFactory: () => ({ value: dir, change: dirChange }),
        },
      ],
    });

    TestBed.compileComponents();
  }));

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleTabNavBarTestApp>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
      fixture.detectChanges();
    });

    it('should change active index on click', () => {
      // select the second link
      let tabLink = fixture.debugElement.queryAll(By.css('a'))[1];
      tabLink.nativeElement.click();
      expect(fixture.componentInstance.activeIndex).toBe(1);

      // select the third link
      tabLink = fixture.debugElement.queryAll(By.css('a'))[2];
      tabLink.nativeElement.click();
      expect(fixture.componentInstance.activeIndex).toBe(2);
    });

    it('should add the active class if active', () => {
      const tabLink1 = fixture.debugElement.queryAll(By.css('a'))[0];
      const tabLink2 = fixture.debugElement.queryAll(By.css('a'))[1];
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      tabLink1.nativeElement.click();
      fixture.detectChanges();
      expect(
        tabLinkElements[0].classList.contains('mdc-tab--active')
      ).toBeTruthy();
      expect(
        tabLinkElements[1].classList.contains('mdc-tab--active')
      ).toBeFalsy();

      tabLink2.nativeElement.click();
      fixture.detectChanges();
      expect(
        tabLinkElements[0].classList.contains('mdc-tab--active')
      ).toBeFalsy();
      expect(
        tabLinkElements[1].classList.contains('mdc-tab--active')
      ).toBeTruthy();
    });

    it('should update aria-disabled if disabled', () => {
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      expect(
        tabLinkElements.every(
          (tabLink) => tabLink.getAttribute('aria-disabled') === 'false'
        )
      )
        .withContext('Expected aria-disabled to be set to "false" by default.')
        .toBe(true);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(
        tabLinkElements.every(
          (tabLink) => tabLink.getAttribute('aria-disabled') === 'true'
        )
      )
        .withContext(
          'Expected aria-disabled to be set to "true" if link is disabled.'
        )
        .toBe(true);
    });

    it('should update the tabindex if links are disabled', () => {
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      expect(tabLinkElements.map((tabLink) => tabLink.tabIndex))
        .withContext(
          'Expected first element to be keyboard focusable by default'
        )
        .toEqual([0, -1, -1]);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElements.every((tabLink) => tabLink.tabIndex === -1))
        .withContext(
          'Expected element to no longer be keyboard focusable if disabled.'
        )
        .toBe(true);
    });

    it('should mark disabled links', () => {
      const tabLinkElement = fixture.debugElement.query(
        By.css('a')
      ).nativeElement;

      expect(tabLinkElement.classList).not.toContain('oui-mdc-tab-disabled');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElement.classList).toContain('oui-mdc-tab-disabled');
    });

    it('should prevent default keyboard actions on disabled links', () => {
      const link = fixture.debugElement.query(By.css('a')).nativeElement;
      fixture.componentInstance.disabled = true;
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const spaceEvent = dispatchKeyboardEvent(link, 'keydown', SPACE);
      fixture.detectChanges();
      expect(spaceEvent.defaultPrevented).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const enterEvent = dispatchKeyboardEvent(link, 'keydown', ENTER);
      fixture.detectChanges();
      expect(enterEvent.defaultPrevented).toBe(true);
    });

    xit('should re-align the ink bar when the direction changes', fakeAsync(() => {
      const inkBar = fixture.componentInstance.tabNavBar._inkBar;

      spyOn(inkBar, 'alignToElement');

      // dirChange.next();
      tick();
      fixture.detectChanges();

      expect(inkBar.alignToElement).toHaveBeenCalled();
    }));

    it('should re-align the ink bar when the tabs list change', fakeAsync(() => {
      const inkBar = fixture.componentInstance.tabNavBar._inkBar;

      spyOn(inkBar, 'alignToElement');

      fixture.componentInstance.tabs = [1, 2, 3, 4];
      fixture.detectChanges();
      tick();

      expect(inkBar.alignToElement).toHaveBeenCalled();
    }));

    it('should re-align the ink bar when the tab labels change the width', (done) => {
      const inkBar = fixture.componentInstance.tabNavBar._inkBar;

      const spy = spyOn(inkBar, 'alignToElement').and.callFake(() => {
        expect(spy.calls.any()).toBe(true);
        done();
      });

      fixture.componentInstance.label = 'label change';
      fixture.detectChanges();

      expect(spy.calls.any()).toBe(false);
    });

    it('should re-align the ink bar when the window is resized', fakeAsync(() => {
      const inkBar = fixture.componentInstance.tabNavBar._inkBar;

      spyOn(inkBar, 'alignToElement');

      dispatchFakeEvent(window, 'resize');
      tick(150);
      fixture.detectChanges();

      expect(inkBar.alignToElement).toHaveBeenCalled();
    }));

    it('should hide the ink bar when all the links are inactive', () => {
      const inkBar = fixture.componentInstance.tabNavBar._inkBar;

      spyOn(inkBar, 'hide');

      fixture.componentInstance.tabLinks.forEach(
        (link) => (link.active = false)
      );
      fixture.detectChanges();

      expect(inkBar.hide).toHaveBeenCalled();
    });

    it('should update the focusIndex when a tab receives focus directly', () => {
      const thirdLink = fixture.debugElement.queryAll(By.css('a'))[2];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatchFakeEvent(thirdLink.nativeElement, 'focus');
      fixture.detectChanges();

      expect(fixture.componentInstance.tabNavBar.focusIndex).toBe(2);
    });
  });

  it('should hide the ink bar if no tabs are active on init', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabBarWithInactiveTabsOnInit);
    fixture.detectChanges();
    tick(20); // Angular turns rAF calls into 16.6ms timeouts in tests.
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('.mdc-tab-indicator--active')
        .length
    ).toBe(0);
  }));

  it('should clean up the ripple event handlers on destroy', () => {
    const fixture: ComponentFixture<TabLinkWithNgIf> =
      TestBed.createComponent(TabLinkWithNgIf);
    fixture.detectChanges();

    const link =
      fixture.debugElement.nativeElement.querySelector('.oui-mdc-tab-link');

    fixture.componentInstance.isDestroyed = true;
    fixture.detectChanges();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    dispatchMouseEvent(link, 'mousedown');

    expect(link.querySelector('.oui-ripple-element'))
      .withContext(
        'Expected no ripple to be created when ripple target is destroyed.'
      )
      .toBeFalsy();
  });

  it('should select the proper tab, if the tabs come in after init', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    const instance = fixture.componentInstance;

    instance.tabs = [];
    instance.activeIndex = 1;
    fixture.detectChanges();

    expect(instance.tabNavBar.selectedIndex).toBe(-1);

    instance.tabs = [0, 1, 2];
    fixture.detectChanges();

    expect(instance.tabNavBar.selectedIndex).toBe(1);
  });

  it('should have the proper roles', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    fixture.detectChanges();

    const tabBar = fixture.nativeElement.querySelector('.oui-mdc-tab-nav-bar')!;
    expect(tabBar.getAttribute('role')).toBe('tablist');

    const tabLinks =
      fixture.nativeElement.querySelectorAll('.oui-mdc-tab-link');

    expect(tabLinks[0].getAttribute('role')).toBe('tab');
    expect(tabLinks[1].getAttribute('role')).toBe('tab');
    expect(tabLinks[2].getAttribute('role')).toBe('tab');

    const tabPanel = fixture.nativeElement.querySelector(
      '.oui-mdc-tab-nav-panel'
    )!;
    expect(tabPanel.getAttribute('role')).toBe('tabpanel');
  });

  it('should manage tabindex properly', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    fixture.detectChanges();

    const tabLinks =
      fixture.nativeElement.querySelectorAll('.oui-mdc-tab-link');
    expect(tabLinks[0].tabIndex).toBe(0);
    expect(tabLinks[1].tabIndex).toBe(-1);
    expect(tabLinks[2].tabIndex).toBe(-1);

    tabLinks[1].click();
    fixture.detectChanges();

    expect(tabLinks[0].tabIndex).toBe(-1);
    expect(tabLinks[1].tabIndex).toBe(0);
    expect(tabLinks[2].tabIndex).toBe(-1);
  });

  it('should setup aria-controls properly', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    fixture.detectChanges();

    const tabLinks =
      fixture.nativeElement.querySelectorAll('.oui-mdc-tab-link');
    expect(tabLinks[0].getAttribute('aria-controls')).toBe('tab-panel');
    expect(tabLinks[1].getAttribute('aria-controls')).toBe('tab-panel');
    expect(tabLinks[2].getAttribute('aria-controls')).toBe('tab-panel');
  });

  it('should not manage aria-current', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    fixture.detectChanges();

    const tabLinks =
      fixture.nativeElement.querySelectorAll('.oui-mdc-tab-link');
    expect(tabLinks[0].getAttribute('aria-current')).toBe(null);
    expect(tabLinks[1].getAttribute('aria-current')).toBe(null);
    expect(tabLinks[2].getAttribute('aria-current')).toBe(null);
  });

  it('should manage aria-selected properly', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    fixture.detectChanges();

    const tabLinks =
      fixture.nativeElement.querySelectorAll('.oui-mdc-tab-link');
    expect(tabLinks[0].getAttribute('aria-selected')).toBe('true');
    expect(tabLinks[1].getAttribute('aria-selected')).toBe('false');
    expect(tabLinks[2].getAttribute('aria-selected')).toBe('false');

    tabLinks[1].click();
    fixture.detectChanges();

    expect(tabLinks[0].getAttribute('aria-selected')).toBe('false');
    expect(tabLinks[1].getAttribute('aria-selected')).toBe('true');
    expect(tabLinks[2].getAttribute('aria-selected')).toBe('false');
  });

  it('should activate a link when space is pressed', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    fixture.detectChanges();

    const tabLinks =
      fixture.nativeElement.querySelectorAll('.oui-mdc-tab-link');
    expect(tabLinks[1].classList.contains('mdc-tab--active')).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    dispatchKeyboardEvent(tabLinks[1], 'keydown', SPACE);
    fixture.detectChanges();

    expect(tabLinks[1].classList.contains('mdc-tab--active')).toBe(true);
  });

  describe('ripples', () => {
    let fixture: ComponentFixture<SimpleTabNavBarTestApp>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
      fixture.detectChanges();
    });

    it('should be disabled on all tab links when they are disabled on the nav bar', () => {
      expect(
        fixture.componentInstance.tabLinks
          .toArray()
          .every((tabLink) => !tabLink.rippleDisabled)
      )
        .withContext('Expected every tab link to have ripples enabled')
        .toBe(true);

      fixture.componentInstance.disableRippleOnBar = true;
      fixture.detectChanges();

      expect(
        fixture.componentInstance.tabLinks
          .toArray()
          .every((tabLink) => tabLink.rippleDisabled)
      )
        .withContext('Expected every tab link to have ripples disabled')
        .toBe(true);
    });

    it('should have the `disableRipple` from the tab take precedence over the nav bar', () => {
      const firstTab = fixture.componentInstance.tabLinks.first;

      expect(firstTab.rippleDisabled)
        .withContext('Expected ripples to be enabled on first tab')
        .toBe(false);

      firstTab.disableRipple = true;
      fixture.componentInstance.disableRippleOnBar = false;
      fixture.detectChanges();

      expect(firstTab.rippleDisabled)
        .withContext('Expected ripples to be disabled on first tab')
        .toBe(true);
    });

    xit('should show up for tab link elements on mousedown', () => {
      const tabLink =
        fixture.debugElement.nativeElement.querySelector('.oui-mdc-tab-link');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatchMouseEvent(tabLink, 'mousedown');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatchMouseEvent(tabLink, 'mouseup');

      expect(tabLink.querySelectorAll('.oui-ripple-element').length)
        .withContext(
          'Expected one ripple to show up if user clicks on tab link.'
        )
        .toBe(1);
    });

    it('should be able to disable ripples on an individual tab link', () => {
      const tabLinkDebug = fixture.debugElement.query(By.css('a'));
      const tabLinkElement = tabLinkDebug.nativeElement;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      fixture.componentInstance.disableRippleOnLink = true;
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatchMouseEvent(tabLinkElement, 'mousedown');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatchMouseEvent(tabLinkElement, 'mouseup');

      expect(tabLinkElement.querySelectorAll('.oui-ripple-element').length)
        .withContext('Expected no ripple to show up if ripples are disabled.')
        .toBe(0);
    });

    xit('should be able to disable ripples through global options at runtime', () => {
      expect(
        fixture.componentInstance.tabLinks
          .toArray()
          .every((tabLink) => !tabLink.rippleDisabled)
      )
        .withContext('Expected every tab link to have ripples enabled')
        .toBe(true);

      globalRippleOptions.disabled = true;

      expect(
        fixture.componentInstance.tabLinks
          .toArray()
          .every((tabLink) => tabLink.rippleDisabled)
      )
        .withContext('Expected every tab link to have ripples disabled')
        .toBe(true);
    });

    it('should have a focus indicator', () => {
      const tabLinkNativeElements = [
        ...fixture.debugElement.nativeElement.querySelectorAll(
          '.oui-mdc-tab-link'
        ),
      ];

      expect(
        tabLinkNativeElements.every((element) =>
          element.classList.contains('oui-mdc-focus-indicator')
        )
      ).toBe(true);
    });
  });

  describe('with the ink bar fit to content', () => {
    let fixture: ComponentFixture<SimpleTabNavBarTestApp>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
      fixture.componentInstance.fitInkBarToContent = true;
      fixture.detectChanges();
    });

    it('should properly nest the ink bar when fit to content', () => {
      const tabElement = fixture.nativeElement.querySelector('.mdc-tab');
      const contentElement = tabElement.querySelector('.mdc-tab__content');
      const indicatorElement = tabElement.querySelector('.mdc-tab-indicator');
      expect(indicatorElement.parentElement).toBeTruthy();
      expect(indicatorElement.parentElement).toBe(contentElement);
    });

    it('should be able to move the ink bar between content and full', () => {
      fixture.componentInstance.fitInkBarToContent = false;
      fixture.detectChanges();

      const tabElement = fixture.nativeElement.querySelector('.mdc-tab');
      const indicatorElement = tabElement.querySelector('.mdc-tab-indicator');
      expect(indicatorElement.parentElement).toBeTruthy();
      expect(indicatorElement.parentElement).toBe(tabElement);

      fixture.componentInstance.fitInkBarToContent = true;
      fixture.detectChanges();

      const contentElement = tabElement.querySelector('.mdc-tab__content');
      expect(indicatorElement.parentElement).toBeTruthy();
      expect(indicatorElement.parentElement).toBe(contentElement);
    });
  });
});

describe('OuiTabNavBar with a default config', () => {
  let fixture: ComponentFixture<TabLinkWithNgIf>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiTabsModule, BrowserAnimationsModule],
      declarations: [TabLinkWithNgIf],
      providers: [
        { provide: OUI_TABS_CONFIG, useValue: { fitInkBarToContent: true } },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabLinkWithNgIf);
    fixture.detectChanges();
  });

  it('should set whether the ink bar fits to content', () => {
    const tabElement = fixture.nativeElement.querySelector('.mdc-tab');
    const contentElement = tabElement.querySelector('.mdc-tab__content');
    const indicatorElement = tabElement.querySelector('.mdc-tab-indicator');
    expect(indicatorElement.parentElement).toBeTruthy();
    expect(indicatorElement.parentElement).toBe(contentElement);
  });
});

describe('OuiTabNavBar with enabled animations', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiTabsModule, BrowserAnimationsModule],
      declarations: [TabsWithCustomAnimationDuration],
    });

    TestBed.compileComponents();
  }));

  it('should not throw when setting an animationDuration without units', fakeAsync(() => {
    expect(() => {
      const fixture = TestBed.createComponent(TabsWithCustomAnimationDuration);
      fixture.detectChanges();
      tick();
    }).not.toThrow();
  }));

  it('should set appropiate css variable given a specified animationDuration', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsWithCustomAnimationDuration);
    fixture.detectChanges();
    tick();

    const tabNavBar = fixture.nativeElement.querySelector(
      '.oui-mdc-tab-nav-bar'
    );
    expect(
      tabNavBar.style.getPropertyValue('--oui-tab-animation-duration')
    ).toBe('500ms');
  }));
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-app',
  template: `
    <nav
      oui-tab-nav-bar
      [disableRipple]="disableRippleOnBar"
      [fitInkBarToContent]="fitInkBarToContent"
      [tabPanel]="tabPanel"
    >
      <a
        oui-tab-link
        *ngFor="let tab of tabs; let index = index"
        [active]="activeIndex === index"
        [disabled]="disabled"
        (click)="activeIndex = index"
        [disableRipple]="disableRippleOnLink"
      >
        Tab link {{ label }}
      </a>
    </nav>
    <oui-tab-nav-panel #tabPanel id="tab-panel">Tab panel</oui-tab-nav-panel>
  `,
  standalone: false,
})
class SimpleTabNavBarTestApp {
  @ViewChild(OuiTabNav) tabNavBar: OuiTabNav;
  @ViewChildren(OuiTabLink) tabLinks: QueryList<OuiTabLink>;

  label = '';
  disabled = false;
  disableRippleOnBar = false;
  disableRippleOnLink = false;
  tabs = [0, 1, 2];
  fitInkBarToContent = false;

  activeIndex = 0;
}

@Component({
  template: `
    <nav oui-tab-nav-bar [tabPanel]="tabPanel">
      <a oui-tab-link *ngIf="!isDestroyed">Link</a>
    </nav>
    <oui-tab-nav-panel #tabPanel>Tab panel</oui-tab-nav-panel>
  `,
  standalone: false,
})
class TabLinkWithNgIf {
  isDestroyed = false;
}

@Component({
  template: `
    <nav oui-tab-nav-bar [tabPanel]="tabPanel">
      <a oui-tab-link *ngFor="let tab of tabs" [active]="false"
        >Tab link {{ label }}</a
      >
    </nav>
    <oui-tab-nav-panel #tabPanel>Tab panel</oui-tab-nav-panel>
  `,
  standalone: false,
})
class TabBarWithInactiveTabsOnInit {
  tabs = [0, 1, 2];
}

@Component({
  template: `
    <nav [animationDuration]="500" oui-tab-nav-bar [tabPanel]="tabPanel">
      <a oui-tab-link *ngFor="let link of links">{{ link }}</a>
    </nav>
    <oui-tab-nav-panel #tabPanel></oui-tab-nav-panel>,
  `,
  standalone: false,
})
class TabsWithCustomAnimationDuration {
  links = ['First', 'Second', 'Third'];
}
