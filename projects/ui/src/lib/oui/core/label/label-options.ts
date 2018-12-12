import { InjectionToken } from '@angular/core';
/** InjectionToken that can be used to specify the global label options. */
export declare const OUI_LABEL_GLOBAL_OPTIONS: InjectionToken<LabelOptions>;
/** Type for the available floatLabel values. */
export declare type FloatLabelType = 'always' | 'never' | 'auto';
/** Configurable options for floating labels. */
export interface LabelOptions {
  /**
   * Whether the label should float `always`, `never`, or `auto` (only when necessary).
   * Default behavior is assumed to be `auto`.
   */
  float?: FloatLabelType;
}
