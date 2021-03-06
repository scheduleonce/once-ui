import { Injectable, NgModule } from '@angular/core';
import { OuiIconRegistry } from '../icon-registery';
import { Observable, of as observableOf } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type PublicApi<T> = {
  [K in keyof T]: T[K] extends (...x: any[]) => T
    ? (...x: any[]) => PublicApi<T>
    : T[K];
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * A null icon registry that must be imported to allow disabling of custom icons
 */
@Injectable()
export class FakeOuiIconRegistry implements PublicApi<OuiIconRegistry> {
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
