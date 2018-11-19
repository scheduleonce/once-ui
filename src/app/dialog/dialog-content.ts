import {
  Directive,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ElementRef
} from '@angular/core';
import { OuiDialog } from './dialog';
import { OuiDialogRef } from './dialog-ref';

/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;

/**
 * Header section of ui.
 */
@Directive({
  selector: '[oui-dialog-header], [ouiDialogHeader]',
  exportAs: 'ouiDialogHeader',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header'
  }
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
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header-title'
  }
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
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header-image'
  }
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
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header-action'
  }
})
export class OuiDialogHeaderAction {
  constructor() {}
}

/**
 * header action article.
 */
@Directive({
  selector: '[oui-dialog-header-article], [ouiDialogHeaderArticle]',
  exportAs: 'ouiDialogHeaderArticle',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header-article'
  }
})
export class OuiDialogHeaderArticle {
  constructor() {}
}

/**
 * header action article.
 */
@Directive({
  selector: '[oui-dialog-header-video], [ouiDialogHeaderVideo]',
  exportAs: 'ouiDialogHeaderVideo',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header-video'
  }
})
export class OuiDialogHeaderVideo {
  constructor() {}
}

/**
 * header action close
 */
@Directive({
  selector: '[oui-dialog-header-close], [ouiDialogHeaderClose]',
  exportAs: 'ouiDialogHeaderClose',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header-close'
  }
})
export class OuiDialogHeaderClose {
  constructor() {}
}

/**
 * header action separator close
 */
@Directive({
  selector: '[oui-dialog-header-separator], [ouiDialogHeaderSeparator]',
  exportAs: 'ouiDialogHeaderSeparator',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-header-separator'
  }
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
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[class.cross-disabled]': 'dialogResult===false',
    '(click)': 'closeDialog()',
    '[attr.aria-label]': 'ariaLabel'
    // 'type': 'button', // Prevents accidental form submits.
  }
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
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-content'
  }
})
export class OuiDialogContent {
  constructor() {}
}

/**
 * Content section of dialog.
 */
@Directive({
  selector: '[oui-dialog-footer], [ouiDialogFooter]',
  exportAs: 'ouiDialogFooter',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-footer'
  }
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
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-footer-action-left'
  }
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
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'oui-dialog-footer-action-right'
  }
})
export class OuiDialogFooterActionRight {
  constructor() {}
}

/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
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

  return parent ? openDialogs.find(dialog => dialog.id === parent!.id) : null;
}
