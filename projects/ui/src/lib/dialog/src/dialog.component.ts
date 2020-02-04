import {
  Component,
  ViewEncapsulation,
  Input,
  ViewChild,
  Inject,
  OnInit,
  OnChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Internal component that wraps user-provided dialog content.
 */
@Component({
  selector: 'once-ui-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['styles/dialog.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'onceUiDialogContainer',
    tabindex: '-1'
  },
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit, OnChanges {
  @Input()
  visible: boolean;
  @ViewChild('dialog', { static: false })
  elementView;
  custom: any;
  dialogTop = 50;
  dialogMargin: number;
  internalVisible = false;
  allowNgContent = false;

  /**
   * @whatIsThisFor: System settings are for dialog internal use
   */
  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit() {
    // For AOT compiler
    this.custom = this.custom;
    // custom html- allow ng content
    if (this.custom.customHtml === true) {
      this.allowNgContent = true;
    }
    this.ngOnChanges();
  }

  ngOnChanges() {
    setTimeout(() => {
      // Calculating dynamic position
      this.dialogMargin = this.elementView
        ? (this.elementView.nativeElement.offsetHeight / 2) * -1
        : 0;
      const dialogHeight = this.elementView
        ? this.elementView.nativeElement.offsetHeight + 120
        : 0;
      const clientHeight = document.documentElement.clientHeight;
      if (dialogHeight >= clientHeight) {
        this.dialogMargin = 0;
        this.dialogTop = 0;
      }
      this.internalVisible = true; // Showing Dialog after calculating position
      this.document.body.classList.add('dialogOpen');
    });
  }
}
