import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  OuiButtonModule,
  OuiDialogModule,
  OuiDialog
} from '../../../projects/ui/src/lib/oui';
import { boolean } from '@storybook/addon-knobs';
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import markdownText from '../../../projects/ui/src/lib/oui/dialog/README.md';

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
  `
})
export class OuiDialogStorybook {
  @Output()
  readonly close: EventEmitter<string> = new EventEmitter<string>();
  @Input() disabled: boolean = false;
  @ViewChild('dialogTemplate')
  dialogTemplate;
  constructor(private dialog: OuiDialog) {}
  openDialog(e) {
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(() => {
      this.close.emit(e);
    });
  }
}
storiesOf('Dialog', module).add(
  'regular',
  () => ({
    moduleMetadata: {
      imports: [OuiButtonModule, OuiDialogModule],
      schemas: [],
      declarations: [OuiDialogStorybook]
    },
    template: `<oui-dialog-storybook [disabled]="disabled" (click)="click($event)" (close)="close($event)"></oui-dialog-storybook>`,
    props: {
      click: action('clicked'),
      close: action('closed'),
      disabled: boolean('disabled', false)
    }
  }),
  { notes: { markdown: markdownText } }
);
