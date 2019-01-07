import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  Inject,
  Optional
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { mixinColor } from '../core';

export class OuiProgressSpinnerBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _OuiProgressSpinnerMixinBase: typeof OuiProgressSpinnerBase = mixinColor(
  OuiProgressSpinnerBase
);
/**
 * Base reference size of the spinner.
 * @docs-private
 */
const BASE_SIZE = 100;

/**
 * Base reference stroke width of the spinner.
 * @docs-private
 */
const BASE_STROKE_WIDTH = 10;

const INDETERMINATE_ANIMATION_TEMPLATE = `
 @keyframes oui-progress-spinner-stroke-rotate-SIZE {
    0%      { stroke-dashoffset: START_VALUE;  transform: rotate(0); }
    12.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(0); }
    12.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(72.5deg); }
    25%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(72.5deg); }

    25.0001%   { stroke-dashoffset: START_VALUE;  transform: rotate(270deg); }
    37.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(270deg); }
    37.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(161.5deg); }
    50%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(161.5deg); }

    50.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(180deg); }
    62.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(180deg); }
    62.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(251.5deg); }
    75%     { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(251.5deg); }

    75.0001%  { stroke-dashoffset: START_VALUE;  transform: rotate(90deg); }
    87.5%   { stroke-dashoffset: END_VALUE;    transform: rotate(90deg); }
    87.5001%  { stroke-dashoffset: END_VALUE;    transform: rotateX(180deg) rotate(341.5deg); }
    100%    { stroke-dashoffset: START_VALUE;  transform: rotateX(180deg) rotate(341.5deg); }
  }
`;

@Component({
  templateUrl: './progress-spinner.html',
  selector: 'oui-progress-spinner',
  exportAs: 'OuiProgressSpinner',
  styleUrls: ['progress-spinner.scss'],
  host: {
    class: 'oui-progress-spinner',
    '[style.width.px]': 'size',
    '[style.height.px]': 'size',
    '[attr.mode]': 'mode'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OuiProgressSpinner extends _OuiProgressSpinnerMixinBase {
  
  private static diameters = new Set<number>([BASE_SIZE]); 
  private static styleTag: HTMLStyleElement|null = null;

  @Input() percentage = 50;
  @Input() color = 'primary';
  @Input()
  get size(): number { return this._diameter; }
  set size(value: number) {        
    this._diameter = coerceNumberProperty(value);
    if (!OuiProgressSpinner.diameters.has(this._diameter)) {
      
      this._attachStyleNode();
      
    }
  }
  private _diameter = BASE_SIZE;

  @Input() mode = 'determinate';
  @Input() strokeWidth = BASE_STROKE_WIDTH;
  private radius;  
  constructor(
    _elementRef: ElementRef,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    super(_elementRef);
    this.radius = (this.size - this.strokeWidth) / 2;
  }
  /** The view box of the spinner's svg element. */
  get _viewBox() {
    const viewBox = this.radius * 2 + this.strokeWidth;
    return `0 0 ${viewBox} ${viewBox}`;
  }
  get _circleStrokeWidth() {
    return this.strokeWidth / this.size * 100;
  }
  
  /** The stroke circumference of the svg circle. */
  get _strokeCircumference(): number {
    return 2 * Math.PI * this.radius;
  }

  /** The dash offset of the svg circle. */
  get _strokeDashOffset() {
    if (this.mode === 'determinate') {      
    return this._strokeCircumference * (100 - this.percentage) / 100;
    }

    // In fallback mode set the circle to 80% and rotate it with CSS.
    if (this.mode === 'indeterminate') {
      return this._strokeCircumference * 0.2;
    }

    return null;
  }

  /** Dynamically generates a style tag containing the correct animation for this diameter. */
  private _attachStyleNode(): void {
    let styleTag = OuiProgressSpinner.styleTag;
    
    if (!styleTag) {
      styleTag = this._document.createElement('style');
      this._document.head.appendChild(styleTag);
      OuiProgressSpinner.styleTag = styleTag;
    }

    if (styleTag && styleTag.sheet) {
      (styleTag.sheet as CSSStyleSheet).insertRule(this._getAnimationText(), 0);
    }

    OuiProgressSpinner.diameters.add(this.size);
  }

  /** Generates animation styles adjusted for the spinner's diameter. */
  private _getAnimationText(): string {
       return INDETERMINATE_ANIMATION_TEMPLATE
        // Animation should begin at 5% and end at 80%
        .replace(/START_VALUE/g, `${0.95 * this._strokeCircumference}`)
        .replace(/END_VALUE/g, `${0.2 * this._strokeCircumference}`)
        .replace(/SIZE/g, `${this.size}`);
  }
  
}
