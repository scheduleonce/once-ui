import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  ViewChild,
  Inject,
  ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

/**
 * Internal component that wraps user-provided dialog content.
 */
@Component({
  selector: 'once-ui-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./theme/dialog.component.scss'],
  host: {
    'class': 'onceUiDialogContainer',
    'tabindex': '-1'
  },
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
  @Input() visible: boolean;
  @ViewChild('dialog') elementView: ElementRef;
  dialogTop = 50;
  dialogMargin: number;
  internalVisible = false;
  /**
   * @whatIsThisFor: System settings are for dialog internal use
   */
  constructor(@Inject(DOCUMENT) private document: any) {
    this.visible = true;
  }

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    console.log("this.visible : ", this.visible);
    if (this.visible) {
      console.log("Yes");
      setTimeout(() => {
        // Calculating dynamic position
        this.dialogMargin = this.elementView
          ? this.elementView.nativeElement.offsetHeight / 2 * -1
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
    } else {
      this.document.body.classList.remove('dialogOpen');
    }
  }
}
