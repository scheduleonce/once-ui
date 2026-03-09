import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { mixinColor } from '../core';
import { ThemePalette } from '../core/common-behaviors/color';

export class OuiProgressBarBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _OuiProgressBarMixinBase = mixinColor(
  OuiProgressBarBase,
  'primary'
);

/** Possible mode for a progress spinner. */
export type ProgressBarMode = 'determinate' | 'indeterminate';

@Component({
  templateUrl: './progress-bar.html',
  selector: 'oui-progress-bar',
  exportAs: 'OuiProgressBar',
  styleUrls: ['progress-bar.scss'],
  host: {
    class: 'oui-progress-bar',
    '[attr.aria-valuemin]': 'mode === "determinate" ? 0 : null',
    '[attr.aria-valuemax]': 'mode === "determinate" ? 100 : null',
    '[attr.aria-valuenow]': 'value',
    '[attr.mode]': 'mode',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class OuiProgressBar extends _OuiProgressBarMixinBase {
  private _changeDetectorRef: ChangeDetectorRef | null = inject(
    ChangeDetectorRef
  );

  private _value = 0;
  private _strokeWidth: number;

  @Input()
  get color(): ThemePalette {
    return super.color;
  }
  set color(value: ThemePalette) {
    super.color = value;
    this._changeDetectorRef?.markForCheck();
  }

  /** Mode of the progress circle */
  mode: ProgressBarMode = 'indeterminate';

  @Input()
  get value(): number {
    return this.mode === 'determinate' ? this._value : 0;
  }
  set value(newValue: number) {
    this._value = Math.max(0, Math.min(100, coerceNumberProperty(newValue)));
    this.mode = 'determinate';
  }

  @Input() get strokeWidth(): number {
    return this._strokeWidth;
  }
  set strokeWidth(value: number) {
    this._strokeWidth = coerceNumberProperty(value);
  }

  constructor() {
    const elementRef = inject(ElementRef);

    super(elementRef);
  }
}
