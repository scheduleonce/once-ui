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
}
const dialogReference = this.dialog.open(AlertComponent,config);

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

@Component({/* ... */})
export class YourDialog {
  constructor(public dialogRef: OnceDialogRef<YourDialog>) { }

  closeDialog() {
    this.dialogRef.close('data...');
  }
}

```


## Sharing Data with dialog component

If you want to share data in your dialog component, you can use data option in second argument of open function.

```typescript

    const dialogRef = dialog.open(YourDialog, {
        data: { helpLink: 'http//something.com' },
    });

```

To access dialog data we have to use DIALOG_DATA injection token:

```typescript

    import {Component, Inject} from '@angular/core';
    import {DIALOG_DATA} from '@once/ui';

    @Component({
    selector: 'your-dialog',
    template: 'passed in {{ data.name }}',
    })
    export class YourDialog {
    constructor(@Inject(DIALOG_DATA) public data: any) { }
    }

```

## Dialog Content

Several directives are availaible to make it easier to structure your dialog content:

| **Name**  | **Description**                                                                 |
|---|---------------------------------------------------------------------------------|
| `once-dialog-title` | [Attr] Dialog title, applied to a heading element|
| `<once-dialog-content>`  | container for content of the dialog   |
| `<once-dialog-actions`|  container for actions buttons for the buttom of the dialog |


For example:

```html

    <h2 once-dialog-title>Delete all</h2>
    <once-dialog-content>Are you sure?</once-dialog-content>
    <once-dialog-actions>
        <once-button>No</button>
        <once-button>save</once-button>
    </once-dialog-actions>

```

## Configuring dialog content via `entryComponets`

The OnceDialog instantiates components at run-time, the Angular compiler need extra information to create the necessary ComponentFactory for your dialog content component.

For any component loaded into a dialog, you must include your component class in the list of entryComponents in your NgModule definition so that the Angular compiler knows to create the ComponentFactory for it.

```typescript

    @NgModule({
    imports: [
        OnceDialogModule
    ],

    declarations: [
        AppComponent,
        ExampleDialogComponent
    ],

    entryComponents: [
        ExampleDialogComponent
    ],

    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule {}

```


