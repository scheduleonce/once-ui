import { Constructor } from '../core/common-behaviors/constructor';
import { ElementRef, ChangeDetectorRef } from '@angular/core';

/** @docs-private */
export interface CanProgress {
  /** progress texts */
  progress: string[] | string;
  setToProgress: Function;
  setToDone: Function;
  setToDefault: Function;
}

/** @docs-private */
export interface HasElementRef {
  _elementRef: ElementRef;
}

/** @docs-private */
export type CanProgressCtor = Constructor<CanProgress>;

/** Mixin to augment a directive with a `color` property. */
export function mixinProgress<T extends Constructor<HasElementRef>>(
  base: T
): CanProgressCtor & T {
  return class extends base {
    private _progress: string[] | string;
    private _stage: 'default' | 'progress' | 'done' = 'default';
    get progress(): string[] | string {
      return this._progress;
    }
    set progress(value: string[] | string) {
      if (value === '') {
        this._progress = ['Save', 'Saving...', 'Saved'];
      } else {
        this._progress = value;
      }
      setTimeout(() => {
        this._changeStage();
        const cdr = (this as any)._cdr as ChangeDetectorRef;
        if (cdr) {
          cdr.detectChanges();
        }
      }, 0);
    }

    constructor(...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      super(...args);
      this._progress = null;
    }

    private _setButtonText(text: string) {
      this._elementRef.nativeElement.children[0].innerHTML = text;
    }

    private _addClass(className: string) {
      this._elementRef.nativeElement.classList.add(className);
    }

    private _checkAttribute() {
      if (this._elementRef.nativeElement.tagName === 'A') {
        throw Error('please use <button> tag to use progress button');
      }
      if (!this._progress) {
        throw Error(
          'please add progress input attribute to change button state'
        );
      }
    }

    private _changeStage() {
      if (!this._progress) {
        return;
      }
      const indexes = { default: 0, progress: 1, done: 2 };
      const labelIndex = indexes[this._stage];
      this._setButtonText(this._progress[labelIndex]);
      this._removeClasses();
      this._addClass(`oui-stage-${this._stage}`);
    }

    private _removeClasses() {
      const stages = ['default', 'progress', 'done'];
      for (const stage of stages) {
        this._elementRef.nativeElement.classList.remove(`oui-stage-${stage}`);
      }
    }

    setToDefault() {
      this._checkAttribute();
      this._elementRef.nativeElement.disabled = false;
      this._stage = 'default';
      this._changeStage();
    }

    setToProgress() {
      this._checkAttribute();
      this._elementRef.nativeElement.disabled = true;
      this._stage = 'progress';
      this._changeStage();
    }

    setToDone() {
      this._checkAttribute();
      this._elementRef.nativeElement.disabled = false;
      this._stage = 'done';
      this._changeStage();
      this._resetToDefault();
    }

    private _resetToDefault() {
      setTimeout(() => {
        this._stage = 'default';
        this._changeStage();
      }, 3000);
    }
  };
}
