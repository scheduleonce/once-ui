import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  booleanAttribute,
} from '@angular/core';

@Component({
  template: ` <ng-content></ng-content> `,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[oui-scrollbar]',
  exportAs: 'OuiScrollbar',
  styleUrls: ['scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'oui-scrollbar-container',
    '[class.oui-scrollbar-container-large]': 'large()',
  },
  standalone: false,
})
export class OuiScrollbar {
  /** Whether the oui-select is of large size. */
  readonly large = input(false, {
    alias: 'oui-scrollbar-large',
    transform: booleanAttribute,
  });
  constructor() {}
}
