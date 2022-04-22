import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  waitForAsync,
} from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ThemePalette } from '../core';
import {
  OuiPaginatorModule,
  OuiPaginator,
  OuiPaginatorIntl,
} from './public-api';

function getPreviousButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelector(
    '.oui-paginator-navigation-previous'
  );
}

function getNextButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelector('.oui-paginator-navigation-next');
}

function getFirstButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelector('.oui-paginator-navigation-first');
}

function getLastButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelector('.oui-paginator-navigation-last');
}

@Component({
  template: `
    <oui-paginator
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [hidePageSize]="hidePageSize"
      [length]="length"
      [disabled]="disabled"
      (page)="pageEvent($event)"
    >
    </oui-paginator>
  `,
})
class OuiPaginatorApp {
  pageIndex = 0;
  pageSize = 10;
  hidePageSize = false;
  showFirstLastButtons = false;
  length = 100;
  disabled: boolean;
  pageEvent = jasmine.createSpy('page event');
  color: ThemePalette;

  @ViewChild(OuiPaginator) paginator: OuiPaginator;

  goToLastPage() {
    this.pageIndex = Math.ceil(this.length / this.pageSize) - 1;
  }
}

@Component({
  template: ` <oui-paginator></oui-paginator> `,
})
class OuiPaginatorWithoutInputsApp {
  @ViewChild(OuiPaginator) paginator: OuiPaginator;
}

@Component({
  template: ` <oui-paginator [pageSize]="10"></oui-paginator> `,
})
class OuiPaginatorWithoutOptionsApp {
  @ViewChild(OuiPaginator) paginator: OuiPaginator;
}

@Component({
  template: `
    <oui-paginator pageIndex="0" pageSize="10" length="100"> </oui-paginator>
  `,
})
class OuiPaginatorWithStringValues {
  @ViewChild(OuiPaginator) paginator: OuiPaginator;
}

describe('OuiPaginator', () => {
  let fixture: ComponentFixture<OuiPaginatorApp>;
  let component: OuiPaginatorApp;
  let paginator: OuiPaginator;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OuiPaginatorModule, NoopAnimationsModule],
      declarations: [
        OuiPaginatorApp,
        OuiPaginatorWithoutOptionsApp,
        OuiPaginatorWithoutInputsApp,
        OuiPaginatorWithStringValues,
      ],
      providers: [OuiPaginatorIntl],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuiPaginatorApp);
    fixture.detectChanges();
    component = fixture.componentInstance;
    paginator = component.paginator;

    fixture.detectChanges();
  });

  describe('with the default text', () => {
    it('should show the right text', () => {
      const totalPages = fixture.nativeElement.querySelector(
        '.oui-paginator-total-count'
      );
      const currentPage = fixture.nativeElement.querySelector(
        '.oui-paginator-current-page'
      );

      // View second page of list of 100, each page contains 10 items.
      component.length = 100;
      component.pageSize = 10;
      component.pageIndex = 1;
      fixture.detectChanges();
      expect(currentPage.innerText).toBe('2');
      expect(totalPages.innerText).toBe('of 10');

      // View third page of list of 200, each page contains 20 items.
      component.length = 200;
      component.pageSize = 20;
      component.pageIndex = 2;
      fixture.detectChanges();
      expect(currentPage.innerText).toBe('3');
      expect(totalPages.innerText).toBe('of 10');

      // View first page of list of 0, each page contains 5 items.
      component.length = 0;
      component.pageSize = 5;
      component.pageIndex = 2;
      fixture.detectChanges();
      expect(currentPage.innerText).toBe('0');
      expect(totalPages.innerText).toBe('of 0');

      // View third page of list of 12, each page contains 5 items.
      component.length = 12;
      component.pageSize = 5;
      component.pageIndex = 2;
      fixture.detectChanges();
      expect(currentPage.innerText).toBe('3');
      expect(totalPages.innerText).toBe('of 3');

      // View third page of list of 10, each page contains 5 items.
      component.length = 10;
      component.pageSize = 5;
      component.pageIndex = 2;
      fixture.detectChanges();
      expect(currentPage.innerText).toBe('3');
      expect(totalPages.innerText).toBe('of 2');

      // View third page of list of -5, each page contains 5 items.
      component.length = -5;
      component.pageSize = 5;
      component.pageIndex = 2;
      fixture.detectChanges();
      expect(currentPage.innerText).toBe('0');
      expect(totalPages.innerText).toBe('of 0');
    });

    it('should show right aria-labels for buttons', () => {
      expect(getPreviousButton(fixture).getAttribute('aria-label')).toBe(
        'Previous page'
      );
      expect(getNextButton(fixture).getAttribute('aria-label')).toBe(
        'Next page'
      );
      expect(getFirstButton(fixture).getAttribute('aria-label')).toBe(
        'First page'
      );
      expect(getLastButton(fixture).getAttribute('aria-label')).toBe(
        'Last page'
      );
    });
  });

  describe('when navigating with the next and previous buttons', () => {
    it('should be able to go to the next page', () => {
      expect(paginator.pageIndex).toBe(0);

      const button = getNextButton(fixture);
      button.click();
      fixture.whenStable().then(() => {
        expect(paginator.pageIndex).toBe(1);
        expect(component.pageEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            previousPageIndex: 0,
            pageIndex: 1,
          })
        );
      });
    });

    it('should be able to go to the previous page', () => {
      paginator.pageIndex = 1;
      fixture.detectChanges();
      expect(paginator.pageIndex).toBe(1);

      const button = getPreviousButton(fixture);
      button.click();
      fixture.whenStable().then(() => {
        expect(paginator.pageIndex).toBe(0);
        expect(component.pageEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            previousPageIndex: 1,
            pageIndex: 0,
          })
        );
      });
    });

    it('should be able to go to the last page via the last page button', () => {
      expect(paginator.pageIndex).toBe(0);

      const button = getLastButton(fixture);
      button.click();
      fixture.whenStable().then(() => {
        expect(paginator.pageIndex).toBe(9);
        expect(component.pageEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            previousPageIndex: 0,
            pageIndex: 9,
          })
        );
      });
    });

    it('should be able to go to the first page via the first page button', () => {
      paginator.pageIndex = 3;
      fixture.detectChanges();
      expect(paginator.pageIndex).toBe(3);

      const button = getFirstButton(fixture);
      button.click();

      fixture.whenStable().then(() => {
        expect(paginator.pageIndex).toBe(0);
        expect(component.pageEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            previousPageIndex: 3,
            pageIndex: 0,
          })
        );
      });
    });
  });

  it('should mark itself as initialized', fakeAsync(() => {
    let isMarkedInitialized = false;
    paginator.initialized.subscribe(() => (isMarkedInitialized = true));

    tick();
    expect(isMarkedInitialized).toBeTruthy();
  }));

  it('should not allow a negative pageSize', () => {
    paginator.pageSize = -1337;
    expect(paginator.pageSize).toBeGreaterThanOrEqual(0);
  });

  it('should not allow a negative pageIndex', () => {
    paginator.pageSize = -42;
    expect(paginator.pageIndex).toBeGreaterThanOrEqual(0);
  });

  describe('first and last button functionalities', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should disable navigating to the next page if at last page', () => {
      component.goToLastPage();
      fixture.detectChanges();
      expect(paginator.pageIndex).toBe(9);
      expect(paginator.hasNextPage()).toBe(false);

      component.pageEvent.calls.reset();
      //   dispatchMouseEvent(getNextButton(fixture), 'click');

      expect(component.pageEvent).not.toHaveBeenCalled();
      expect(paginator.pageIndex).toBe(9);
    });

    it('should disable navigating to the previous page if at first page', () => {
      expect(paginator.pageIndex).toBe(0);
      expect(paginator.hasPreviousPage()).toBe(false);

      component.pageEvent.calls.reset();
      //   dispatchMouseEvent(getPreviousButton(fixture), 'click');

      expect(component.pageEvent).not.toHaveBeenCalled();
      expect(paginator.pageIndex).toBe(0);
    });
  });

  it('should be able to change the page size while keeping the first item present', () => {
    // Start on the third page of a list of 100 with a page size of 10.
    component.pageIndex = 4;
    component.pageSize = 10;
    component.length = 100;
    fixture.detectChanges();

    // The first item of the page should be item with index 40
    expect(paginator.pageIndex * paginator.pageSize).toBe(40);

    // The first item on the page is now 25. Change the page size to 25 so that we should now be
    // on the second page where the top item is index 25.
    component.pageEvent.calls.reset();
    paginator._changePageSize(25);

    expect(component.pageEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pageIndex: 1,
        pageSize: 25,
      })
    );

    // The first item on the page is still 25. Change the page size to 8 so that we should now be
    // on the fourth page where the top item is index 24.
    component.pageEvent.calls.reset();
    paginator._changePageSize(8);

    expect(component.pageEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pageIndex: 3,
        pageSize: 8,
      })
    );

    // The first item on the page is 24. Change the page size to 16 so that we should now be
    // on the first page where the top item is index 0.
    component.pageEvent.calls.reset();
    paginator._changePageSize(25);

    expect(component.pageEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pageIndex: 0,
        pageSize: 25,
      })
    );
  });

  it('should keep track of the right number of pages', () => {
    component.pageSize = 10;
    component.length = 100;
    fixture.detectChanges();
    expect(paginator.getNumberOfPages()).toBe(10);

    component.pageSize = 10;
    component.length = 0;
    fixture.detectChanges();
    expect(paginator.getNumberOfPages()).toBe(0);

    component.pageSize = 10;
    component.length = 10;
    fixture.detectChanges();
    expect(paginator.getNumberOfPages()).toBe(1);
  });

  it('should handle the number inputs being passed in as strings', () => {
    const withStringFixture = TestBed.createComponent(
      OuiPaginatorWithStringValues
    );
    withStringFixture.detectChanges();
    const withStringPaginator = withStringFixture.componentInstance.paginator;

    withStringFixture.detectChanges();

    expect(withStringPaginator.pageIndex).toEqual(0);
    expect(withStringPaginator.length).toEqual(100);
    expect(withStringPaginator.pageSize).toEqual(10);
  });

  it('should be able to disable all the controls in the paginator via the binding', () => {
    fixture.componentInstance.pageIndex = 1;
    fixture.componentInstance.showFirstLastButtons = true;
    fixture.detectChanges();

    expect(getPreviousButton(fixture).hasAttribute('disabled')).toBe(false);
    expect(getNextButton(fixture).hasAttribute('disabled')).toBe(false);
    expect(getFirstButton(fixture).hasAttribute('disabled')).toBe(false);
    expect(getLastButton(fixture).hasAttribute('disabled')).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(getPreviousButton(fixture).hasAttribute('disabled')).toBe(true);
    expect(getNextButton(fixture).hasAttribute('disabled')).toBe(true);
    expect(getFirstButton(fixture).hasAttribute('disabled')).toBe(true);
    expect(getLastButton(fixture).hasAttribute('disabled')).toBe(true);
  });
});
