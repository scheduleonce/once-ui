import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';
import { OuiDialog } from '../../components';

@Component({
  selector: 'oui-dialog-storybook',
  template: `
    <button oui-button [disabled]="disabled" (click)="openDialog($event)">
      Open
    </button>
    <ng-template #dialogTemplate>
      <div oui-dialog-header>
        <label oui-dialog-header-title>this is the title</label>
        <div oui-dialog-header-action>
          <div title="Close" oui-dialog-header-close oui-dialog-close></div>
          <a
            title="Article"
            oui-dialog-header-article
            href="https://youtube.com"
            target="blank"
          ></a>
          <a
            title="Video"
            href="https://youtube.com"
            target="blank"
            oui-dialog-header-video
            oui-dialog-header-separator
          ></a>
          <a
            title="Video"
            href="https://youtube.com"
            target="blank"
            oui-dialog-header-video
          ></a>
        </div>
      </div>
      <div oui-dialog-content><div class="simple"></div></div>
      <div oui-dialog-footer>
        <div oui-dialog-footer-action-left>
          <button oui-link-button>Left</button>
          <button oui-link-button>Left</button>
        </div>
        <div oui-dialog-footer-action-right>
          <button oui-ghost-button>Open</button>
          <button oui-button ouiDialogClose>Close</button>
        </div>
      </div>
    </ng-template>
  `,
  standalone: false,
})
export class OuiDialogStorybook {
  private dialog = inject(OuiDialog);

  @Output()
  readonly close: EventEmitter<string> = new EventEmitter<string>();
  @Input() disabled = false;
  @ViewChild('dialogTemplate')
  dialogTemplate: TemplateRef<unknown>;

  constructor() {}
  openDialog(e?: string) {
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(() => {
      this.close.emit(e);
    });
  }
}
