import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
    template: ` <ng-content></ng-content> `,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[oui-scrollbar]',
    exportAs: 'OuiScrollbar',
    styleUrls: ['scrollbar.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: 'oui-scrollbar-container',
        '[class.oui-scrollbar-container-large]': 'large',
    },
    standalone: false
})
export class OuiScrollbar {
  private _large = false;

  /** Whether the oui-select is of large size. */
  @Input('oui-scrollbar-large')
  get large(): boolean {
    return this._large;
  }
  set large(value) {
    this._large = coerceBooleanProperty(value);
  }
  constructor() {}
}
