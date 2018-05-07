import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  OnChanges,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit, OnChanges {
  @Input() closable = true;
  @Input() visible: boolean;
  @Input() autoClose = true;
  @Input() displayCloseCross = true;
  @Input() processing = false;
  @Input() setStyle = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('dialog') elementView: ElementRef;
  dialogTop = 50;
  dialogMargin: number;
  internalVisible = false;

  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit() {}

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  closeOnDiv() {
    if (this.autoClose) {
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
  }

  ngOnChanges() {
    if (this.visible) {
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
