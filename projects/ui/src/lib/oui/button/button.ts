import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  OnDestroy,
  Input,
  OnInit
} from '@angular/core';
import {
  CanDisable,
  CanColor,
  CanDisableCtor,
  CanColorCtor,
  mixinColor,
  mixinDisabled
} from '../core';
import { coerceArray } from '@angular/cdk/coercion';

/**
 * List of classes to add to Button instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'oui-button',
  'oui-ghost-button',
  'oui-link-button',
  'oui-icon-button'
];

/** Default color palette for round buttons (mat-fab and mat-mini-fab) */
const DEFAULT_COLOR = 'primary';

// Boilerplate for applying mixins to OuiButton.
/** @docs-private */
export class OuiButtonBase {
  constructor(public _elementRef: ElementRef) { }
}

export const OuiButtonMixinBase: CanDisableCtor &
  CanColorCtor &
  typeof OuiButtonBase = mixinColor(mixinDisabled(OuiButtonBase));

/**
 * Once Ui button.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: `button[oui-button], button[oui-ghost-button], button[oui-link-button],
               button[oui-icon-button]`,
  exportAs: 'ouiButton',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[disabled]': 'disabled || null'
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled', 'color'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OuiButton extends OuiButtonMixinBase
  implements OnDestroy, CanDisable, CanColor {
  constructor(protected elementRef: ElementRef) {
    super(elementRef);
    this.addClass();
  }

  protected addClass() {
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this.hasHostAttributes(attr)) {
        (this.elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }
    if (!this.color) {
      this.color = DEFAULT_COLOR;
    }
  }

  getHostElement() {
    return this.elementRef.nativeElement;
  }
  /** Gets whether the button has one of the given attributes. */
  hasHostAttributes(...attributes: string[]) {
    return attributes.some(attribute =>
      this.getHostElement().hasAttribute(attribute)
    );
  }

  ngOnDestroy() { }
}

/**
 * Once UI anchor.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: `a[oui-button], a[oui-ghost-button], a[oui-link-button],
    a[oui-icon-button]`,
  exportAs: 'ouiButton, ouiAnchor',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_haltDisabledEvents($event)'
  },
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled', 'color'],
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OuiAnchor extends OuiButton {
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  _haltDisabledEvents(event: Event) {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}


const PROGRESS_BUTTON_HOST_ATTRIBUTES = [
  'oui-progress-button',
  'oui-progress-ghost-button',
  'oui-progress-link-button'
];

/**
 * Once Ui progress button.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: `button[oui-progress-button], button[oui-progress-ghost-button],
             button[oui-progress-link-button]`,
  exportAs: 'ouiProgressButton',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[disabled]': 'disabled || null',
  },
  template: '{{label}}',
  styleUrls: ['button.scss'],
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['disabled', 'color'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class OuiProgressButton extends OuiButton implements OnInit {
  private _labels: string[] = ['Save', 'Saving...', 'Saved'];

  get labels(): string[]{
    return this._labels;
  }
  @Input() set labels(values){
    this._labels = coerceArray(values);
  };
  private stage: 'default' | 'progress' | 'done' = 'default';
  label: string;
  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.addClass();
  }
  
  ngOnInit(){
    this.setLabel();  
  }

  setToProgress(){
    this.stage = 'progress';
    this.setLabel();
  }

  setToDone(){
    this.stage = 'done';
    this.setLabel();
    this.resetToDefault();
  }

  private resetToDefault(){
    setTimeout(() => {
      this.stage = 'default';
      this.setLabel();
    }, 3000);
  }

  private setLabel() {
    const indexes = { default: 0, progress: 1, done: 2 };
    const labelIndex = indexes[this.stage];
    this.label = this.labels[labelIndex];
    this.removeClasses();    
    this.elementRef.nativeElement.classList.add(`oui-stage-${this.stage}`);
  }

  protected addClass() {
    for (const attr of PROGRESS_BUTTON_HOST_ATTRIBUTES) {
      if (this.hasHostAttributes(attr)) {
        (this.elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }
    if (!this.color) {
      this.color = DEFAULT_COLOR;
    }
  }

  private removeClasses(){
    const stages = ['default', 'progress', 'done'];
    for(const stage of stages){
      this.elementRef.nativeElement.classList.remove(`oui-stage-${stage}`);
    }
  }

}