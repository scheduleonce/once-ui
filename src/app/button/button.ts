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
  selector: `button[oui-button], button[oui-ghost-button], button[oui-link-button],
               button[oui-icon-button]`,
  exportAs: 'ouiButton',
  host: {
    '[disabled]': 'disabled || null'
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
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

  addClass() {
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
  selector: `a[oui-button], a[oui-ghost-button], a[oui-link-button],
    a[oui-icon-button]`,
  exportAs: 'ouiButton, ouiAnchor',
  host: {
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_haltDisabledEvents($event)'
  },
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


/**
 * Once Ui progress button.
 */
@Component({
  selector: `button[oui-progress-button]`,
  exportAs: 'ouiProgressButton',
  host: {
    '[disabled]': 'disabled || null',
    'class': 'oui-progress-button'
  },
  template: '{{label}}',
  styleUrls: ['button.scss'],
  inputs: ['disabled', 'color'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OuiProgressButton extends OuiButton implements OnInit {
  private _labels: string[] = ['Save', 'Saving...', 'Saved'];

  get labels(): string[]{
    return this._labels;
  }
  @Input() set labels(values){
    this._labels = coerceArray(values);
    console.log(this._labels);
  };
  @Input() stage: 'default' | 'progress' | 'done' = 'default';

  label: string;
  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.addClass();
  }
  
  ngOnInit(){
    this.setLabel();  
  }

  setLabel() {
    const indexes = { default: 0, progress: 1, done: 2 };
    const labelIndex = indexes[this.stage];
    this.label = this.labels[labelIndex];
    this.elementRef.nativeElement.classList.add(`oui-stage-${this.stage}`);
  }

  addClass() {
    if (!this.color) {
      this.color = DEFAULT_COLOR;
    }
  }

  ngOnDestroy() { }
}