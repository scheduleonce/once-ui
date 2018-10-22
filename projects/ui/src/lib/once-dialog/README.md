## Using OnceDialog Service

The `dialog` service can be used to open modal dialogs with Themes and Animation.

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

The `dialogRefrence` object provides utility that can be used to close it or provides other notifications utility.

```typescript
dialogReference.afterClose().subscribe(result => {
  // you can call your method here to do action when dialog closed
  console.log(`Dialog Result : ${result}`);
});

const user = 'John';
dialogReference.close(user);
```

## Create your dialog components

Components created via OnceDialog can Inject `OnceDialogRef` and use it to close a dialog or handle other events.

```typescript
@Component({
  /* ... */
})
export class YourDialog {
  constructor(public dialogRef: OnceDialogRef<YourDialog>) {}

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
import { DIALOG_DATA } from '@once/ui';

@Component({
  selector: 'your-dialog',
  template: 'passed in {{ data.name }}'
})
export class YourDialog {
  constructor(@Inject(DIALOG_DATA) public data: any) {}
}
```

## Dialog Content

Several directives are availaible to make it easier to structure your dialog content:

| **Name**                      | **Description**                                            |
| ----------------------------- | ---------------------------------------------------------- |
| `<once-dialog-header>`        | Dialog header, applied to a heading element                |
| `once-dialog-title`           | [Attr] dialog title on the top left                        |
| `once-dialog-help`            | [Attr] dialog help icon on the top right                   |
| `once-dialog-video`           | [Attr] dialog video icon on the top right                  |
| `once-dialog-close`           | [Attr] dialog close icon on the top right                  |
| `<once-dialog-content>`       | container for content of the dialog                        |
| `<once-dialog-footer>`        | container for actions buttons for the bottom of the dialog |
| `<once-dialog-actions-right>` | container for action buttons on the right                  |
| `<once-dialog-actions-left>`  | container for action buttons on the left                   |

For example:

```html
    <once-dialog-header title="Delete all" once-dialog-help="http://scheduleonce.com/article" once-dialog-video="https://youtube.com/..." once-dialog-close />
    <once-dialog-content>Are you sure?</once-dialog-content>
    <once-dialog-footer>
      <once-dialog-action-right>
        <button once-button-primary>No</button>
        <button once-button>Yes</button>
      </once-dialog-action-right>
      <once-dialog-action-left>
        <button once-button-link>Cancel</button>
      </once-dialog-action-left>
    </once-dialog-footer>
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

## Using a pre-built theme

The once-ui comes with prepackaged several themes in css files. These themes can be added in your style.css file( common css file). So you have to include single css file in your whole application.

You can include a theme file directly into your application from `@once/ui/prebuilt-themes`

Available prebuilt themes

- `oncehub.css`
- `scheduleonce.css`
- `inviteonce.css`
- `chatonce.css`

You have to add single one line in style.css file

```css
@import '~@once/ui/prebuilt-themes/oncehub.css';
```
