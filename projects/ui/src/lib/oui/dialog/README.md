

## Steps for making dialog using template-ref method 

1. Import `OuiDialogModule` in your module.

```typescript

  import { OuiDialogModule } from '@once/ui';

  @NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, OuiDialogModule],
    providers: [],
    bootstrap: [AppComponent]
  })

```
Now we are ready to use all utilities of dialog in our components under that module.

2. Import and Inject `OuiDialog` service in your component. This service will open the dialog with configuration and returns
   dialog reference object.;

```typescript
  import { OuiDialog } from '@once/ui';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
  })
  export class AppComponent {
    constructor(private dialog: OuiDialog) {}


  }

```

3. In your component html code add the required button to open the dialog and add your dialog html in the <ng-template> tag      with template-ref id.
   You can use helper directives to design your dialogs. Please see the docs related to helper directives for more information.

   ```html

    <ng-template #dialogTemplate>
        <div oui-dialog-header>
            <div oui-dialog-header-image><img src="/assets/images/v-green.svg" /></div>
            <label oui-dialog-header-title>this is the title</label>
            <div oui-dialog-header-action>
                <div title="Close" oui-dialog-header-close oui-dialog-close></div>
                <a title="Article" oui-dialog-header-article href="https://youtube.com" target="blank"></a>
                <a title="Video" href="https://youtube.com" target="blank"
                    oui-dialog-header-video oui-dialog-header-separator></a>
            </div>
        </div>
        <div oui-dialog-content>
            <div class="simple">
            </div>
        </div>
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

    <button oui-button (click)="openDialog()">Open</button>
   ```

4. Open dialog in your component.

```typescript

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
  })
  export class AppComponent {
    @ViewChild('dialogTemplate')
    dialogTemplate;
    dialogRef: any = null;
    constructor(private dialog: OuiDialog) {}

    openDialog() {
      this.dialogRef = this.dialog.open(this.dialogTemplate);
      this.dialogRef.afterClosed().subscribe(() => {
        // do something after dialog popup closed
      });
    }

    closeDialog(){
      if(this.dialogRef){
        this.dialogRef.close();
      }
    }

  }

```


## Steps for making dialog using component method.

1. Import `OuiDialogModule` in your module same as template-ref method.

2. Generate separate component for dialog. For example we generate `some-dialog` component as separate component that consists
   all required html and business logic code. We can open this component dynamically from our main component.

3. Add this component in your module in declarations and entrycomponents. 
  For any component loaded into a dialog, you must include your component class in the list of entryComponents in your NgModule definition so that the Angular compiler knows to create the ComponentFactory for it.

```typescript

  @NgModule({
    declarations: [AppComponent, SomeDialogComponent],
    imports: [BrowserModule, OuiButtonModule, OuiDialogModule],
    providers: [],
    entryComponents: [SomeDialogComponent],
  })
  export class AppModule {}

```
4. Inject `OUI_DIALOG_DATA` to your dialog component, using this utility you can get data from your main component (from where you are invoking your dialog component).

```typescript
import { Component, Inject } from '@angular/core';
import { OUI_DIALOG_DATA } from '@once/ui';

@Component({
  selector: 'your-dialog',
  template: 'passed in {{ data.name }}'
})
export class SomeDialogComponent {
  constructor(@Inject(OUI_DIALOG_DATA) public data: any) {}
}
```

Now you can use data object to get all the properties provided by main component.


5. Open your dialog component from your main component and pass input data;


```typescript

  import {SomeDialogComponent} from 'some-dialog/some-dialog.component.ts'

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
  })
  export class AppComponent {
    @ViewChild('dialogTemplate')
    dialogTemplate;
    dialogRef: any = null;
    constructor(private dialog: OuiDialog) {}

    openDialog() {
      const config = {
        data: {
          title: 'this is the title',
          save: this.save.bind(this)
        }
      }
      this.dialogRef = this.dialog.open(SomeDialogComponent);
      this.dialogRef.afterClosed().subscribe(() => {
        // do something after dialog popup closed
      });
    }

    save(){
      // save something
      console.log('save..');
    }

    closeDialog(){
      if(this.dialogRef){
        this.dialogRef.close();
      }
    }

  }

```


## Dialog Content

Several directives are available to make it easier to structure your dialog content:

| **Name**                        | **Description**                                            |
| -----------------------------   | ---------------------------------------------------------- |
| `oui-dialog-header`             | container for dialog header                                |
| `oui-dialog-header-image`       | dialog header image before title                           |
| `oui-dialog-header-title`       | dialog header title                                        |
| `oui-dialog-header-action`      | dialog header action area                                  |
| `oui-dialog-header-close`       | dialog header close icon                                   |
| `oui-dialog-close`              | utility to close dialog                                    |
| `oui-dialog-header-article`     | dialog header article icon                                 |
| `oui-dialog-header-video`       | dialog header video icon                                   |
| `oui-dialog-header-separator`   | dialog header separator between article and video          |
| `oui-dialog-content`            | container for dialog content                               |
| `oui-dialog-footer`             | container for dialog footer                                |
| `oui-dialog-footer-action-left` | container for actions on left side of footer               |
| `oui-dialog-footer-action-right`| container for actions on right side of footer              |


For example:

```html
    <div oui-dialog-header>
        <div oui-dialog-header-image><img src="/assets/images/v-green.svg" /></div>
        <label oui-dialog-header-title>this is the title</label>
        <div oui-dialog-header-action>
            <div title="Close" oui-dialog-header-close oui-dialog-close></div>
            <a title="Article" oui-dialog-header-article href="https://youtube.com" target="blank"></a>
            <a title="Video" href="https://youtube.com" target="blank"
                oui-dialog-header-video oui-dialog-header-separator></a>
        </div>
    </div>
    <div oui-dialog-content>
        <div class="simple">
        </div>
    </div>
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

```