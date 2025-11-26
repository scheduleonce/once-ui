import { Direction } from '@angular/cdk/bidi';
import {
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
} from '@angular/cdk/keycodes';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule, ViewportRuler } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  waitForAsync,
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { OuiTabHeader } from './tab-header';
import { OuiTabLabelWrapper } from './tab-label-wrapper';
import {
  ObserversModule,
  MutationObserverFactory,
} from '@angular/cdk/observers';
import { dispatchKeyboardEvent } from '../core/test/utils';

describe('MDC-based OuiTabHeader', () => {
  let fixture: ComponentFixture<SimpleTabHeaderApp>;
  let appComponent: SimpleTabHeaderApp;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, PortalModule, ScrollingModule, ObserversModule],
      declarations: [OuiTabHeader, OuiTabLabelWrapper, SimpleTabHeaderApp],
      providers: [ViewportRuler],
    });

    TestBed.compileComponents();
  }));

  describe('focusing', () => {
    let tabListContainer: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabHeaderApp);
      fixture.detectChanges();

      appComponent = fixture.componentInstance;
      tabListContainer = appComponent.tabHeader._tabListContainer.nativeElement;
    });

    it('should initialize to the selected index', () => {
      // Recreate the fixture so we can test that it works with a non-default selected index
      fixture.destroy();
      fixture = TestBed.createComponent(SimpleTabHeaderApp);
      fixture.componentInstance.selectedIndex = 1;
      fixture.detectChanges();
      appComponent = fixture.componentInstance;
      tabListContainer = appComponent.tabHeader._tabListContainer.nativeElement;

      expect(appComponent.tabHeader.focusIndex).toBe(1);
    });

    it('should send focus change event', () => {
      appComponent.tabHeader.focusIndex = 2;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);
    });

    it('should be able to focus a disabled tab', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      appComponent.tabHeader.focusIndex = appComponent.disabledTabIndex;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(
        appComponent.disabledTabIndex
      );
    });

    it('should move focus right including over disabled tabs', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      expect(appComponent.disabledTabIndex).toBe(1);
      dispatchKeyboardEvent(tabListContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(1);

      dispatchKeyboardEvent(tabListContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);
    });

    it('should move focus left including over disabled tabs', () => {
      appComponent.tabHeader.focusIndex = 3;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(3);

      // Move focus left to index 3
      dispatchKeyboardEvent(tabListContainer, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);

      expect(appComponent.disabledTabIndex).toBe(1);
      dispatchKeyboardEvent(tabListContainer, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(1);
    });

    it('should support key down events to move and select focus', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      // Move focus right to 1
      dispatchKeyboardEvent(tabListContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(1);

      // Try to select 1. Should not work since it's disabled.
      expect(appComponent.selectedIndex).toBe(0);
      const firstEnterEvent = dispatchKeyboardEvent(
        tabListContainer,
        'keydown',
        ENTER
      );
      fixture.detectChanges();
      expect(appComponent.selectedIndex).toBe(0);
      expect(firstEnterEvent.defaultPrevented).toBe(false);

      // Move focus right to 2
      dispatchKeyboardEvent(tabListContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);

      // Select 2 which is enabled.
      expect(appComponent.selectedIndex).toBe(0);
      const secondEnterEvent = dispatchKeyboardEvent(
        tabListContainer,
        'keydown',
        ENTER
      );
      fixture.detectChanges();
      expect(appComponent.selectedIndex).toBe(2);
      expect(secondEnterEvent.defaultPrevented).toBe(true);

      // Move focus left to 1
      dispatchKeyboardEvent(tabListContainer, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(1);

      // Move again to 0
      dispatchKeyboardEvent(tabListContainer, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      // Select the focused 0 using space.
      expect(appComponent.selectedIndex).toBe(2);
      const spaceEvent = dispatchKeyboardEvent(
        tabListContainer,
        'keydown',
        SPACE
      );
      fixture.detectChanges();
      expect(appComponent.selectedIndex).toBe(0);
      expect(spaceEvent.defaultPrevented).toBe(true);
    });

    it('should not prevent the default space/enter action if the current is selected', () => {
      appComponent.tabHeader.focusIndex =
        appComponent.tabHeader.selectedIndex = 0;
      fixture.detectChanges();

      const spaceEvent = dispatchKeyboardEvent(
        tabListContainer,
        'keydown',
        SPACE
      );
      fixture.detectChanges();
      expect(spaceEvent.defaultPrevented).toBe(false);

      const enterEvent = dispatchKeyboardEvent(
        tabListContainer,
        'keydown',
        ENTER
      );
      fixture.detectChanges();
      expect(enterEvent.defaultPrevented).toBe(false);
    });

    it('should move focus to the first tab when pressing HOME', () => {
      appComponent.tabHeader.focusIndex = 3;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(3);

      const event = dispatchKeyboardEvent(tabListContainer, 'keydown', HOME);
      fixture.detectChanges();

      expect(appComponent.tabHeader.focusIndex).toBe(0);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should focus disabled items when moving focus using HOME', () => {
      appComponent.tabHeader.focusIndex = 3;
      appComponent.tabs[0].disabled = true;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(3);

      dispatchKeyboardEvent(tabListContainer, 'keydown', HOME);
      fixture.detectChanges();

      expect(appComponent.tabHeader.focusIndex).toBe(0);
    });

    it('should move focus to the last tab when pressing END', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      const event = dispatchKeyboardEvent(tabListContainer, 'keydown', END);
      fixture.detectChanges();

      expect(appComponent.tabHeader.focusIndex).toBe(3);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should focus disabled items when moving focus using END', () => {
      appComponent.tabHeader.focusIndex = 0;
      appComponent.tabs[3].disabled = true;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      dispatchKeyboardEvent(tabListContainer, 'keydown', END);
      fixture.detectChanges();

      expect(appComponent.tabHeader.focusIndex).toBe(3);
    });

    it('should not do anything if a modifier key is pressed', () => {
      // const rightArrowEvent = createKeyboardEvent(
      //   'keydown',
      //   RIGHT_ARROW,
      //   undefined,
      //   { shift: true }
      // );
      // const enterEvent = createKeyboardEvent('keydown', ENTER, undefined, {
      //   shift: true,
      // });

      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      // dispatchEvent(tabListContainer, rightArrowEvent);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);
      // expect(rightArrowEvent.defaultPrevented).toBe(false);

      expect(appComponent.selectedIndex).toBe(0);
      // dispatchEvent(tabListContainer, enterEvent);
      fixture.detectChanges();
      expect(appComponent.selectedIndex).toBe(0);
      // expect(enterEvent.defaultPrevented).toBe(false);
    });
  });

  describe('pagination', () => {
    describe('ltr', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleTabHeaderApp);
        appComponent = fixture.componentInstance;
        appComponent.dir = 'ltr';
        fixture.detectChanges();
      });

      it('should show width when tab list width exceeds container', () => {
        fixture.detectChanges();
        expect(appComponent.tabHeader._showPaginationControls).toBe(false);

        // Add enough tabs that it will obviously exceed the width
        appComponent.addTabsForScrolling();
        fixture.detectChanges();

        expect(appComponent.tabHeader._showPaginationControls).toBe(true);
      });

      xit('should scroll to show the focused tab label', () => {
        appComponent.addTabsForScrolling();
        fixture.detectChanges();
        expect(appComponent.tabHeader.scrollDistance).toBe(0);

        // Focus on the last tab, expect this to be the maximum scroll distance.
        appComponent.tabHeader.focusIndex = appComponent.tabs.length - 1;
        fixture.detectChanges();
        const { offsetLeft, offsetWidth } = appComponent.getSelectedLabel(
          appComponent.tabHeader.focusIndex
        );
        const viewLength = appComponent.getViewLength();
        expect(appComponent.tabHeader.scrollDistance).toBe(
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          offsetLeft + offsetWidth - viewLength
        );

        // Focus on the first tab, expect this to be the maximum scroll distance.
        appComponent.tabHeader.focusIndex = 0;
        fixture.detectChanges();
        expect(appComponent.tabHeader.scrollDistance).toBe(0);
      });

      xit('should show ripples for pagination buttons', () => {
        appComponent.addTabsForScrolling();
        fixture.detectChanges();

        expect(appComponent.tabHeader._showPaginationControls).toBe(true);

        // const buttonAfter = fixture.debugElement.query(
        //   By.css('.oui-mdc-tab-header-pagination-after')
        // );

        expect(
          fixture.nativeElement.querySelectorAll('.oui-ripple-element').length
        )
          .withContext('Expected no ripple to show up initially.')
          .toBe(0);

        // dispatchFakeEvent(buttonAfter.nativeElement, 'mousedown');
        // dispatchFakeEvent(buttonAfter.nativeElement, 'mouseup');

        expect(
          fixture.nativeElement.querySelectorAll('.oui-ripple-element').length
        )
          .withContext('Expected one ripple to show up after mousedown')
          .toBe(1);
      });

      it('should allow disabling ripples for pagination buttons', () => {
        appComponent.addTabsForScrolling();
        appComponent.disableRipple = true;
        fixture.detectChanges();

        expect(appComponent.tabHeader._showPaginationControls).toBe(true);

        // const buttonAfter = fixture.debugElement.query(
        //   By.css('.oui-mdc-tab-header-pagination-after')
        // );

        expect(
          fixture.nativeElement.querySelectorAll('.oui-ripple-element').length
        )
          .withContext('Expected no ripple to show up initially.')
          .toBe(0);

        // dispatchFakeEvent(buttonAfter.nativeElement, 'mousedown');
        // dispatchFakeEvent(buttonAfter.nativeElement, 'mouseup');

        expect(
          fixture.nativeElement.querySelectorAll('.oui-ripple-element').length
        )
          .withContext('Expected no ripple to show up after mousedown')
          .toBe(0);
      });

      xit('should update the scroll distance if a tab is removed and no tabs are selected', fakeAsync(() => {
        appComponent.selectedIndex = 0;
        appComponent.addTabsForScrolling();
        fixture.detectChanges();

        // Focus the last tab so the header scrolls to the end.
        appComponent.tabHeader.focusIndex = appComponent.tabs.length - 1;
        fixture.detectChanges();
        const { offsetLeft, offsetWidth } = appComponent.getSelectedLabel(
          appComponent.tabHeader.focusIndex
        );
        const viewLength = appComponent.getViewLength();
        expect(appComponent.tabHeader.scrollDistance).toBe(
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          offsetLeft + offsetWidth - viewLength
        );

        // Remove the first two tabs which includes the selected tab.
        appComponent.tabs = appComponent.tabs.slice(2);
        fixture.detectChanges();
        tick();

        expect(appComponent.tabHeader.scrollDistance).toBe(
          appComponent.tabHeader._getMaxScrollDistance()
        );
      }));
    });

    describe('rtl', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleTabHeaderApp);
        appComponent = fixture.componentInstance;
        appComponent.dir = 'rtl';
        fixture.detectChanges();
      });

      xit('should scroll to show the focused tab label', () => {
        appComponent.addTabsForScrolling();
        fixture.detectChanges();
        expect(appComponent.tabHeader.scrollDistance).toBe(0);

        // Focus on the last tab, expect this to be the maximum scroll distance.
        appComponent.tabHeader.focusIndex = appComponent.tabs.length - 1;
        fixture.detectChanges();
        const { offsetLeft } = appComponent.getSelectedLabel(
          appComponent.tabHeader.focusIndex
        );
        expect(offsetLeft).toBe(0);

        // Focus on the first tab, expect this to be the maximum scroll distance.
        appComponent.tabHeader.focusIndex = 0;
        fixture.detectChanges();
        expect(appComponent.tabHeader.scrollDistance).toBe(0);
      });
    });

    describe('disabling pagination', () => {
      it('should not show the pagination controls if pagination is disabled', () => {
        fixture = TestBed.createComponent(SimpleTabHeaderApp);
        appComponent = fixture.componentInstance;
        appComponent.disablePagination = true;
        fixture.detectChanges();
        expect(appComponent.tabHeader._showPaginationControls).toBe(false);

        // Add enough tabs that it will obviously exceed the width
        appComponent.addTabsForScrolling();
        fixture.detectChanges();

        expect(appComponent.tabHeader._showPaginationControls).toBe(false);
      });

      it('should not change the scroll position if pagination is disabled', () => {
        fixture = TestBed.createComponent(SimpleTabHeaderApp);
        appComponent = fixture.componentInstance;
        appComponent.disablePagination = true;
        fixture.detectChanges();
        appComponent.addTabsForScrolling();
        fixture.detectChanges();
        expect(appComponent.tabHeader.scrollDistance).toBe(0);

        appComponent.tabHeader.focusIndex = appComponent.tabs.length - 1;
        fixture.detectChanges();
        expect(appComponent.tabHeader.scrollDistance).toBe(0);

        appComponent.tabHeader.focusIndex = 0;
        fixture.detectChanges();
        expect(appComponent.tabHeader.scrollDistance).toBe(0);
      });
    });

    it('should re-align the ink bar when the direction changes', fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleTabHeaderApp);
      fixture.detectChanges();

      const inkBar = fixture.componentInstance.tabHeader._inkBar;
      spyOn(inkBar, 'alignToElement');

      fixture.detectChanges();

      fixture.componentInstance.dir = 'rtl';
      fixture.detectChanges();
      tick();

      expect(inkBar.alignToElement).toHaveBeenCalled();
    }));

    xit('should re-align the ink bar when the window is resized', fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleTabHeaderApp);
      fixture.detectChanges();

      const inkBar = fixture.componentInstance.tabHeader._inkBar;

      spyOn(inkBar, 'alignToElement');

      // dispatchFakeEvent(window, 'resize');
      tick(150);
      fixture.detectChanges();

      expect(inkBar.alignToElement).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it('should update arrows when the window is resized', fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleTabHeaderApp);

      const header = fixture.componentInstance.tabHeader;

      spyOn(header, '_checkPaginationEnabled');

      // dispatchFakeEvent(window, 'resize');
      tick(10);
      fixture.detectChanges();

      expect(header._checkPaginationEnabled).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    xit('should update the pagination state if the content of the labels changes', () => {
      const mutationCallbacks: Function[] = [];
      TestBed.overrideProvider(MutationObserverFactory, {
        useValue: {
          // Stub out the MutationObserver since the native one is async.
          create: function (callback: Function) {
            mutationCallbacks.push(callback);
            return { observe: () => {}, disconnect: () => {} };
          },
        },
      });

      fixture = TestBed.createComponent(SimpleTabHeaderApp);
      fixture.detectChanges();

      const tabHeaderElement: HTMLElement = fixture.nativeElement.querySelector(
        '.oui-mdc-tab-header'
      );
      const labels = Array.from<HTMLElement>(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        fixture.nativeElement.querySelectorAll('.label-content')
      );
      const extraText = new Array(100).fill('w').join();
      const enabledClass = 'oui-mdc-tab-header-pagination-controls-enabled';

      expect(tabHeaderElement.classList).not.toContain(enabledClass);

      labels.forEach((label) => {
        label.style.width = '';
        label.textContent += extraText;
      });

      mutationCallbacks.forEach((callback) => callback());
      fixture.detectChanges();

      expect(tabHeaderElement.classList).toContain(enabledClass);
    });
  });
});

interface Tab {
  label: string;
  disabled?: boolean;
}

@Component({
  template: `
    <div [dir]="dir">
      <oui-tab-header
        [selectedIndex]="selectedIndex"
        [disableRipple]="disableRipple"
        (indexFocused)="focusedIndex = $event"
        (selectFocusedIndex)="selectedIndex = $event"
        [disablePagination]="disablePagination"
      >
        <div
          ouiTabLabelWrapper
          class="label-content"
          style="min-width: 30px; width: 30px"
          *ngFor="let tab of tabs; let i = index"
          [disabled]="!!tab.disabled"
          (click)="selectedIndex = i"
        >
          {{ tab.label }}
        </div>
      </oui-tab-header>
    </div>
  `,
  styles: [
    `
      :host {
        width: 130px;
      }
    `,
  ],
  standalone: false,
})
class SimpleTabHeaderApp {
  disableRipple = false;
  selectedIndex = 0;
  focusedIndex: number;
  disabledTabIndex = 1;
  tabs: Tab[] = [
    { label: 'tab one' },
    { label: 'tab one' },
    { label: 'tab one' },
    { label: 'tab one' },
  ];
  dir: Direction = 'ltr';
  disablePagination: boolean;

  @ViewChild(OuiTabHeader, { static: true }) tabHeader: OuiTabHeader;

  constructor() {
    this.tabs[this.disabledTabIndex].disabled = true;
  }

  addTabsForScrolling(amount = 4) {
    for (let i = 0; i < amount; i++) {
      this.tabs.push({ label: 'new' });
    }
  }

  getViewLength() {
    return this.tabHeader._tabListContainer.nativeElement.offsetWidth;
  }

  getSelectedLabel(_index: number) {
    return this.tabHeader._items.toArray()[this.tabHeader.focusIndex].elementRef
      .nativeElement;
  }
}
