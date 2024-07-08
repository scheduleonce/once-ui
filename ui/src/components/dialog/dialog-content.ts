import {
  Directive,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ElementRef,
  Component,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { OuiDialog } from './dialog';
import { OuiDialogRef } from './dialog-ref';
import { OuiIconRegistry } from '../icon/icon-registery';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from '../core/shared/icons';
import { Subscription } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;

/**
 * Header section of ui.
 */
@Directive({
  selector: '[oui-dialog-header], [ouiDialogHeader]',
  exportAs: 'ouiDialogHeader',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header',
  },
})
export class OuiDialogHeader {
  constructor() {}
}

/**
 * Header Title of ui.
 */
@Directive({
  selector: '[oui-dialog-header-title], [ouiDialogHeaderTitle]',
  exportAs: 'ouiDialogHeaderTitle',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header-title',
  },
})
export class OuiDialogHeaderTitle {
  constructor() {}
}

/**
 * Header Image of ui.
 */
@Directive({
  selector: '[oui-dialog-header-image], [ouiDialogHeaderImage]',
  exportAs: 'ouiDialogHeaderImage',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header-image',
  },
})
export class OuiDialogHeaderImage {
  constructor() {}
}

/**
 * Header action area of dialog.
 */
@Directive({
  selector: '[oui-dialog-header-action], [ouiDialogHeaderAction]',
  exportAs: 'ouiDialogHeaderAction',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header-action',
  },
})
export class OuiDialogHeaderAction {
  constructor() {}
}

/**
 * header action article.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[oui-dialog-header-article], [ouiDialogHeaderArticle]',
  template: '<oui-icon svgIcon="help-library"></oui-icon>',
  exportAs: 'ouiDialogHeaderArticle',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header-article',
  },
})
export class OuiDialogHeaderArticle implements OnDestroy {
  private _monitorSubscription: Subscription = Subscription.EMPTY;
  constructor(
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer,
    protected elementRef: ElementRef<HTMLElement>,
    private _focusMonitor: FocusMonitor,
    private _ngZone: NgZone
  ) {
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://cdn.icomoon.io/135790/oncehub-20/symbol-defs.svg?5df5gz'
      )
    );
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));
  }
  ngOnDestroy() {
    this._monitorSubscription.unsubscribe();
  }
}

/**
 * header action article.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[oui-dialog-header-video], [ouiDialogHeaderVideo]',
  template: '<oui-icon svgIcon="video-icon"></oui-icon>',
  exportAs: 'ouiDialogHeaderVideo',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header-video',
  },
})
export class OuiDialogHeaderVideo implements OnDestroy {
  private _monitorSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer,
    protected elementRef: ElementRef<HTMLElement>,
    private _focusMonitor: FocusMonitor,
    private _ngZone: NgZone
  ) {
    this.ouiIconRegistry.addSvgIconLiteral(
      `video-icon`,
      this.domSanitizer.bypassSecurityTrustHtml(ICONS.VIDEO_ICON)
    );
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));
  }
  ngOnDestroy() {
    this._monitorSubscription.unsubscribe();
  }
}

/**
 * header action close
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[oui-dialog-header-close], [ouiDialogHeaderClose]',
  template: '<oui-icon svgIcon="close-icon"></oui-icon>',
  exportAs: 'ouiDialogHeaderClose',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header-close',
    '[attr.tabindex]': '0',
  },
})
export class OuiDialogHeaderClose implements OnDestroy {
  private _monitorSubscription: Subscription = Subscription.EMPTY;
  constructor(
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer,
    protected elementRef: ElementRef<HTMLElement>,
    private _focusMonitor: FocusMonitor,
    private _ngZone: NgZone
  ) {
    this.ouiIconRegistry.addSvgIconLiteral(
      `close-icon`,
      this.domSanitizer.bypassSecurityTrustHtml(ICONS.CLOSE_ICON)
    );
    this._monitorSubscription = this._focusMonitor
      .monitor(this.elementRef, true)
      .subscribe(() => this._ngZone.run(() => {}));
  }
  ngOnDestroy() {
    this._monitorSubscription.unsubscribe();
  }
}

/**
 * header action separator close
 */
@Directive({
  selector: '[oui-dialog-header-separator], [ouiDialogHeaderSeparator]',
  exportAs: 'ouiDialogHeaderSeparator',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-header-separator',
  },
})
export class OuiDialogHeaderSeparator {
  constructor() {}
}

/**
 * directive for close the current dialog.
 */
@Directive({
  selector: `[oui-dialog-close], [ouiDialogClose]`,
  exportAs: 'ouiDialogClose',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.cross-disabled]': 'dialogResult===false',
    '(click)': 'closeDialog()',
    '[attr.aria-label]': 'ariaLabel',
    '(keyup.space)': 'handleKeydown($event)',
    '(keydown.enter)': 'handleKeydown($event)',
  },
})
export class OuiDialogClose implements OnInit, OnChanges {
  /** Screenreader label for the button. */
  @Input('aria-label')
  ariaLabel = 'Close dialog';

  /** Dialog close input. */
  @Input('oui-dialog-close')
  dialogResult: any;

  @Input('ouiDialogClose')
  _ouiDialogClose: any;

  constructor(
    @Optional() public dialogRef: OuiDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: OuiDialog
  ) {}

  /** Ensures the option is selected when activated from the keyboard. */
  handleKeydown(event: KeyboardEvent): void {
    this.closeDialog();
    event.preventDefault();
  }

  closeDialog() {
    if (this.dialogResult !== false) {
      this.dialogRef.close(this.dialogResult);
    }
  }

  ngOnInit() {
    if (!this.dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the DialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the DialogRef by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      this.dialogRef = getClosestDialog(
        this._elementRef,
        this._dialog.openDialogs
      )!;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const proxiedChange =
      changes._ouiDialogClose || changes._ouiDialogCloseResult;
    if (proxiedChange) {
      this.dialogResult = proxiedChange.currentValue;
    }
  }
}

/**
 * Content section of dialog.
 */
@Directive({
  selector: '[oui-dialog-content], [ouiDialogContent]',
  exportAs: 'ouiDialogContent',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-content',
  },
})
export class OuiDialogContent implements OnInit {
  constructor(
    @Optional() public dialogRef: OuiDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: OuiDialog
  ) {}

  ngOnInit() {
    if (!this.dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the DialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the DialogRef by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      this.dialogRef = getClosestDialog(
        this._elementRef,
        this._dialog.openDialogs
      )!;
    }
    this._setContentHeight();
  }
  /* prevent content scroll in default scroll strategy **/
  private _setContentHeight() {
    if (!this.dialogRef.dialogConfig.scrollStrategy) {
      this._elementRef.nativeElement.style.maxHeight = 'none';
      this._elementRef.nativeElement.style.overflow = 'visible';
    }
  }
}

/**
 * Content section of dialog.
 */
@Directive({
  selector: '[oui-dialog-footer], [ouiDialogFooter]',
  exportAs: 'ouiDialogFooter',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-footer',
  },
})
export class OuiDialogFooter {
  @Input()
  id = `oui-dialog-footer-${dialogElementUid++}`;
  constructor() {}
}

/**
 * footer action left
 */
@Directive({
  selector: '[oui-dialog-footer-action-left], [ouiDialogFooterActionLeft]',
  exportAs: 'ouiDialogFooterActionLeft',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-footer-action-left',
  },
})
export class OuiDialogFooterActionLeft {
  constructor() {}
}

/**
 * footer action right
 */
@Directive({
  selector: '[oui-dialog-footer-action-right], [ouiDialogFooterActionRight]',
  exportAs: 'ouiDialogFooterActionRight',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'oui-dialog-footer-action-right',
  },
})
export class OuiDialogFooterActionRight {
  constructor() {}
}

/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
 *
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(
  element: ElementRef<HTMLElement>,
  openDialogs: OuiDialogRef<any>[]
) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('oui-dialog-container')) {
    parent = parent.parentElement;
  }

  return parent ? openDialogs.find((dialog) => dialog.id === parent!.id) : null;
}
