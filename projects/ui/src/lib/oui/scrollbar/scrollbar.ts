import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input
} from '@angular/core';

@Component({
  templateUrl: './scrollbar.html',
  selector: '[oui-scrollbar]',
  exportAs: 'OuiScrollbar',
  styleUrls: ['scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'oui-scrollbar-container',
    '[style.height.px]': 'height'
  }
})
export class OuiScrollbar {
  @Input() height: number;
  @Input() width: number;
  @Input() containerClass: string;
  constructor() {}
}
