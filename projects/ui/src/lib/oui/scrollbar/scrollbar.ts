import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  template: `
    <ng-content></ng-content>
  `,
  // tslint:disable-next-line:component-selector
  selector: '[oui-scrollbar]',
  exportAs: 'OuiScrollbar',
  styleUrls: ['scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-scrollbar-container',
    '[class.oui-scrollbar-container-large]': 'large'
  }
})
export class OuiScrollbar {
  private _large = false;

  /** Whether the oui-select is of large size. */
  @Input()
  get large(): boolean {
    return this._large;
  }
  set large(value) {
    this._large = coerceBooleanProperty(value);
  }
  constructor() {}
}
