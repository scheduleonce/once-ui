# Angular app-dialog

The dialog component allow users to build a modal with dynamic data.

# Features
- Dialog box with dynamic content
- Variable positioning of dialog box
- Overlay based on user's requirement


## Getting started

```js
import { DialogModule } from '@once/ui/dialog';
````

The only remaining part is to list the imported module in your application module.:

```js
import { DialogModule } from '@once/ui/dialog';

@NgModule({
  imports: [
    DialogModule
  ]
})
```

## Props

| Input            | Type            | Default                 | Required | Description                                                                                         |
| ---------------- | --------------- | ----------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| [(visible)]      | boolean         | `false`                 | yes      | Dialog box appears if visible prop is `true`                          |
| [autoClose]      | boolean         | `false`                 | no       | Close on outside click if true                                                   |
| (visibleChange)  | Function        | `false`                 | no       | Custom event emitter                                                              |
| [disabled]       | boolean         | `false`                 | no       | Disable or enable the close icon of the modal                                         |


### Basic example
```js
@Component({
  selector: 'app-localization-editor',
  template: `template.html`
})

tempate.html:
<once-ui-dialog [(visible)]="showUpgradePopup" class="so-modal" [autoClose]="false" (visibleChange)="close()">
    <div class="modal-content">
        <div class="modal-header confirmBlueStrip">
            <label class="modal-title">Title Heading</label>
        </div>
        <div class="modal-body cfUnselectable dialogBody newtheme">
            <div class="clearfix"></div>
            modal body content
            <div class="vSpace2 simpleBox"></div>
        </div>
        <div class="modal-footer">
            <div class="btnRow"><a class="cencel_link btnLink" (click)="close()">Close</a>
            <a class="btn createBtn" href="">Ok</a>
            </div>
        </div>
    </div>
</once-ui-dialog>
```