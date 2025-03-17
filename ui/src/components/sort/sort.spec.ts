import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OuiTableModule } from '../table/public_api';
import {
  OuiSort,
  OuiSortHeader,
  OuiSortModule,
  Sort,
  SortDirection,
} from './public-api';
import {
  getSortDuplicateSortableIdError,
  getSortHeaderMissingIdError,
  getSortHeaderNotContainedWithinSortError,
  getSortInvalidDirectionError,
} from './sort-errors';

@Component({
    template: `
    <div
      ouiSort
      [ouiSortActive]="active"
      [ouiSortDisabled]="disableAllSort"
      [ouiSortStart]="start"
      [ouiSortDirection]="direction"
      [ouiSortDisableClear]="disableClear"
      (ouiSortChange)="latestSortEvent = $event"
    >
      <div
        id="defaultA"
        #defaultA
        oui-sort-header="defaultA"
        [disabled]="disabledColumnSort"
      >
        A
      </div>
      <div id="defaultB" #defaultB oui-sort-header="defaultB">B</div>
      <div
        id="overrideStart"
        #overrideStart
        oui-sort-header="overrideStart"
        start="desc"
      >
        D
      </div>
      <div
        id="overrideDisableClear"
        #overrideDisableClear
        oui-sort-header="overrideDisableClear"
        disableClear
      >
        E
      </div>
    </div>
  `,
    standalone: false
})
class SimpleOuiSortApp {
  latestSortEvent: Sort;

  active: string;
  start: SortDirection = 'asc';
  direction: SortDirection = '';
  disableClear: boolean;
  disabledColumnSort = false;
  disableAllSort = false;

  @ViewChild(OuiSort) ouiSort: OuiSort;
  @ViewChild('defaultA') defaultA: OuiSortHeader;
  @ViewChild('defaultB') defaultB: OuiSortHeader;
  @ViewChild('overrideStart') overrideStart: OuiSortHeader;
  @ViewChild('overrideDisableClear')
  overrideDisableClear: OuiSortHeader;

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  /**
   * Checks expectations for each sort header's view state and arrow direction states. Receives a
   * map that is keyed by each sort header's ID and contains the expectation for that header's
   * states.
   */
  expectViewAndDirectionStates(
    viewStates: Map<string, { viewState: string; arrowDirection: string }>
  ) {
    const sortHeaders = new Map([
      ['defaultA', this.defaultA],
      ['defaultB', this.defaultB],
      ['overrideStart', this.overrideStart],
      ['overrideDisableClear', this.overrideDisableClear],
    ]);

    viewStates.forEach((viewState, id) => {
      expect(sortHeaders.get(id)!._getArrowViewState()).toEqual(
        viewState.viewState
      );
      expect(sortHeaders.get(id)!._getArrowDirectionState()).toEqual(
        viewState.arrowDirection
      );
    });
  }
}

class FakeDataSource extends DataSource<any> {
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return collectionViewer.viewChange.pipe(map(() => []));
  }
  disconnect() {}
}

@Component({
    template: `
    <cdk-table [dataSource]="dataSource" ouiSort>
      <ng-container cdkColumnDef="column_a">
        <cdk-header-cell
          id="sortHeaderA"
          *cdkHeaderCellDef
          #sortHeaderA
          oui-sort-header
        >
          Column A
        </cdk-header-cell>
        <cdk-cell *cdkCellDef="let row"> {{ row.a }} </cdk-cell>
      </ng-container>

      <ng-container cdkColumnDef="column_b">
        <cdk-header-cell
          id="sortHeaderB"
          *cdkHeaderCellDef
          #sortHeaderB
          oui-sort-header
        >
          Column B
        </cdk-header-cell>
        <cdk-cell *cdkCellDef="let row"> {{ row.b }} </cdk-cell>
      </ng-container>

      <ng-container cdkColumnDef="column_c">
        <cdk-header-cell
          id="sortHeaderC"
          *cdkHeaderCellDef
          #sortHeaderC
          oui-sort-header
        >
          Column C
        </cdk-header-cell>
        <cdk-cell *cdkCellDef="let row"> {{ row.c }} </cdk-cell>
      </ng-container>

      <cdk-header-row *cdkHeaderRowDef="columnsToRender"></cdk-header-row>
      <cdk-row *cdkRowDef="let row; columns: columnsToRender"></cdk-row>
    </cdk-table>
  `,
    standalone: false
})
class CdkTableOuiSortApp {
  @ViewChild(OuiSort) ouiSort: OuiSort;

  dataSource = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
}

@Component({
    template: `
    <oui-table [dataSource]="dataSource" ouiSort>
      <ng-container ouiColumnDef="column_a">
        <oui-header-cell *ouiHeaderCellDef #sortHeaderA oui-sort-header>
          Column A
        </oui-header-cell>
        <oui-cell *ouiCellDef="let row"> {{ row.a }} </oui-cell>
      </ng-container>

      <ng-container ouiColumnDef="column_b">
        <oui-header-cell *ouiHeaderCellDef #sortHeaderB oui-sort-header>
          Column B
        </oui-header-cell>
        <oui-cell *ouiCellDef="let row"> {{ row.b }} </oui-cell>
      </ng-container>

      <ng-container ouiColumnDef="column_c">
        <oui-header-cell *ouiHeaderCellDef #sortHeaderC oui-sort-header>
          Column C
        </oui-header-cell>
        <oui-cell *ouiCellDef="let row"> {{ row.c }} </oui-cell>
      </ng-container>

      <oui-header-row *ouiHeaderRowDef="columnsToRender"></oui-header-row>
      <oui-row *ouiRowDef="let row; columns: columnsToRender"></oui-row>
    </oui-table>
  `,
    standalone: false
})
class OuiTableOuiSortApp {
  @ViewChild(OuiSort) ouiSort: OuiSort;

  dataSource = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
}

@Component({
    template: ` <div oui-sort-header="a">A</div> `,
    standalone: false
})
class OuiSortHeaderMissingOuiSortApp {}

@Component({
    template: `
    <div ouiSort>
      <div oui-sort-header="duplicateId">A</div>
      <div oui-sort-header="duplicateId">A</div>
    </div>
  `,
    standalone: false
})
class OuiSortDuplicateOuiSortableIdsApp {}

@Component({
    template: ` <div ouiSort><div oui-sort-header>A</div></div> `,
    standalone: false
})
class OuiSortableMissingIdApp {}

@Component({
    template: `
    <div ouiSort ouiSortDirection="ascending">
      <div oui-sort-header="a">A</div>
    </div>
  `,
    standalone: false
})
class OuiSortableInvalidDirection {}

describe('OuiSort', () => {
  let fixture: ComponentFixture<SimpleOuiSortApp>;

  let component: SimpleOuiSortApp;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        OuiSortModule,
        OuiTableModule,
        CdkTableModule,
        NoopAnimationsModule,
      ],
      declarations: [
        SimpleOuiSortApp,
        CdkTableOuiSortApp,
        OuiTableOuiSortApp,
        OuiSortHeaderMissingOuiSortApp,
        OuiSortDuplicateOuiSortableIdsApp,
        OuiSortableMissingIdApp,
        OuiSortableInvalidDirection,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleOuiSortApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have the sort headers register and deregister themselves', () => {
    const sortables = component.ouiSort.sortables;
    expect(sortables.size).toBe(4);
    expect(sortables.get('defaultA')).toBe(component.defaultA);
    expect(sortables.get('defaultB')).toBe(component.defaultB);

    fixture.destroy();
    expect(sortables.size).toBe(0);
  });

  it('should mark itself as initialized', fakeAsync(() => {
    let isMarkedInitialized = false;
    component.ouiSort.initialized.subscribe(() => (isMarkedInitialized = true));

    tick();
    expect(isMarkedInitialized).toBeTruthy();
  }));

  it('should use the column definition if used within an oui table', () => {
    const ouiTableOuiSortAppFixture =
      TestBed.createComponent(OuiTableOuiSortApp);
    const ouiTableOuiSortAppComponent =
      ouiTableOuiSortAppFixture.componentInstance;

    ouiTableOuiSortAppFixture.detectChanges();
    ouiTableOuiSortAppFixture.detectChanges();

    const sortables = ouiTableOuiSortAppComponent.ouiSort.sortables;
    expect(sortables.size).toBe(3);
    expect(sortables.has('column_a')).toBe(true);
    expect(sortables.has('column_b')).toBe(true);
    expect(sortables.has('column_c')).toBe(true);
  });

  it('should throw an error if an OuiSortable is not contained within an OuiSort directive', () => {
    expect(() =>
      TestBed.createComponent(OuiSortHeaderMissingOuiSortApp).detectChanges()
    ).toThrow(getSortHeaderNotContainedWithinSortError());
  });

  it('should throw an error if two OuiSortables have the same id', () => {
    expect(() =>
      TestBed.createComponent(OuiSortDuplicateOuiSortableIdsApp).detectChanges()
    ).toThrow(getSortDuplicateSortableIdError('duplicateId'));
  });

  it('should throw an error if an OuiSortable is missing an id', () => {
    expect(() =>
      TestBed.createComponent(OuiSortableMissingIdApp).detectChanges()
    ).toThrow(getSortHeaderMissingIdError());
  });

  it('should throw an error if the provided direction is invalid', () => {
    expect(() =>
      TestBed.createComponent(OuiSortableInvalidDirection).detectChanges()
    ).toThrow(getSortInvalidDirectionError('ascending'));
  });
});
