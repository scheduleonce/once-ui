import { Injectable, NgModule, OnDestroy } from '@angular/core';
import { OuiIconRegistry } from '../icon-registery';
import { Observable, of as observableOf } from 'rxjs';

// tslint:disable:no-any Impossible to tell param types.
type PublicApi<T> = {
  [K in keyof T]: T[K] extends (...x: any[]) => T
    ? (...x: any[]) => PublicApi<T>
    : T[K];
};
// tslint:enable:no-any

/**
 * A null icon registry that must be imported to allow disabling of custom icons
 */
@Injectable()
export class FakeOuiIconRegistry
  implements PublicApi<OuiIconRegistry>, OnDestroy {
  addSvgIcon(): this {
    return this;
  }

  addSvgIconLiteral(): this {
    return this;
  }

  addSvgIconSet(): this {
    return this;
  }

  getNamedSvgIcon(): Observable<SVGElement> {
    return observableOf(this._generateEmptySvg());
  }

  ngOnDestroy() {}

  private _generateEmptySvg(): SVGElement {
    const emptySvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    emptySvg.classList.add('fake-testing-svg');
    // Emulate real icon characteristics from `OuiIconRegistry` so size remains consistent in tests.
    emptySvg.setAttribute('fit', '');
    emptySvg.setAttribute('height', '100%');
    emptySvg.setAttribute('width', '100%');
    emptySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    emptySvg.setAttribute('focusable', 'false');
    return emptySvg;
  }
}

/** Use this module to install the null icon registry. */
@NgModule({
  providers: [{ provide: OuiIconRegistry, useClass: FakeOuiIconRegistry }],
})
export class OuiIconTestingModule {}
