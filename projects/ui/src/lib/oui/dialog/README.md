## Using OnceDialog Service

The `dialog` service can be used to open modal dialogs.

A dialog is opened by calling the `open` method with a component to be loaded. The open method will return an instance of
`dialogReference`. The input properties can be passed optional in second argument.

```typescript
const config = {
  data: {
    text: 'Do you want to leave?',
    title: 'Are you sure you want to leave this page.'
  }
};
const dialogReference = this.dialog.open(AlertComponent, config);
```

The `dialogReference` object provides utility that can be used to close it or provides other notifications utility.

```typescript
dialogReference.afterClose().subscribe(result => {
  // you can call your method here to do action when dialog closed
  console.log(`Dialog Result : ${result}`);
});

const user = 'John';
dialogReference.close(user);
```

## Create your dialog components

Components created via OnceDialog can Inject `OuiDialogRef` and use it to close a dialog or handle other events.

```typescript
@Component({
  /* ... */
})
export class YourDialog {
  constructor(public dialogRef: OuiDialogRef<YourDialog>) {}

  closeDialog() {
    this.dialogRef.close('data...');
  }
}
```

## Sharing Data with dialog component

If you want to share data in your dialog component, you can use data option in second argument of open function.

```typescript
const dialogRef = dialog.open(YourDialog, {
  data: { helpLink: 'http//something.com' }
});
```

To access dialog data we have to use DIALOG_DATA injection token:

```typescript
import { Component, Inject } from '@angular/core';
import { OUI_DIALOG_DATA } from '@once/ui';

@Component({
  selector: 'your-dialog',
  template: 'passed in {{ data.name }}'
})
export class YourDialog {
  constructor(@Inject(OUI_DIALOG_DATA) public data: any) {}
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
      <div oui-dialog-header-image><img src="/assets/images/v-green.svg"/></div>
      <label oui-dialog-header-title>this is the title</label>
      <div oui-dialog-header-action>
        <div title="Close" oui-dialog-header-close oui-dialog-close></div>
        <a title="Article" oui-dialog-header-article href="https://youtube.com" target="blank"></a>
        <a title="Video" href="https://youtube.com" target="blank" oui-dialog-header-video oui-dialog-header-separator></a>
      </div>
    </div>
    <div oui-dialog-content>
      <div class="simple">
      </div>
    </div>
    <div oui-dialog-footer>
      <div oui-dialog-footer-action-left>
        <once-button type="link" label="left1"></app-button>
        <once-button type="link" label="left2"></app-button>
      </div>
      <div oui-dialog-footer-action-right>
        <once-button type="secondary" label="right 1"></app-button>
        <once-button oui-dialog-close label="Close"></app-button>
      </div>
    </div>

```

## Configuring dialog content via `entryComponents`

The OnceDialog instantiates components at run-time, the Angular compiler need extra information to create the necessary ComponentFactory for your dialog content component.

For any component loaded into a dialog, you must include your component class in the list of entryComponents in your NgModule definition so that the Angular compiler knows to create the ComponentFactory for it.

```typescript
@NgModule({
  imports: [OnceDialogModule],

  declarations: [AppComponent, ExampleDialogComponent],

  entryComponents: [ExampleDialogComponent],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```


## Making dialog using template ref method

You can instantiate your dialog from template-reference method

include this code in your html

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
              <a title="Video" href="https://youtube.com" target="blank"
                  oui-dialog-header-video></a>
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
```

In your component class code you can do like following

```typescript

  @ViewChild('dialogTemplate')
    dialogTemplate;

  openDialog() {
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(() => {});
  }


```
