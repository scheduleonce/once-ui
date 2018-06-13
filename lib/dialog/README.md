# Angular dialog

The dialog component allow users to build a modal with dynamic data.

# Features
- Dialog box with dynamic content
- Variable positioning of dialog box
- Overlay based on user's requirement


## Getting started

```js
import { DialogModule } from '@once/ui';
````

The only remaining part is to list the imported module in your application module.:

```js
import { DialogModule } from '@once/ui';

@NgModule({
  imports: [
    DialogModule
  ]
})
```

## Props

| Input            | Type            | Default                 | Required | Description |
| ---------------- | --------------- | ----------------------- | -------- | ----------------------- |
| [id]       | string         | `text`                 | no       | ID for the dialog. If omitted, a unique one will be generated.|                                         
| [disableClose]          | boolean          | `false`                  | no       | Whether the user can use escape or clicking outside to close a modal. |
| [width]           | string          | `text`      | no       | Width of the dialog.|
| [height]          | string           | `text`     | no       | Height of the dialog.|
| [minWidth]        | number/string | `text`     | no       | Min-width of the dialog. If a number is provided, pixel units are assumed.|
| [minHeight]        | number/string | `text`  | no       | Min-height of the dialog. If a number is provided, pixel units are assumed.|                         
| [maxWidth]    | number/string | `text`  | no   | Max-width of the dialog. If a number is provided, pixel units are assumed. Defaults to 80vw|
| [maxHeight]   | number/string | `text`  | no   | Max-height of the dialog. If a number is provided, pixel units are assumed.|
| [data]   | json  | `null` | no   | Data being injected into the child component.|
| [autoFocus]   | boolean  | `true` | no   | Whether the dialog should focus the first focusable element on open.|
| [header]   | Header  | `true` | no   | Header section.|
| [footer]   | Footer  | `true` | no   | Footer section.|
| [theme]   | string  | `text` | no   | Name of the themes.|


## Methods


##### 1) Open(component,config)
##
| Description | 
|-------------|
|Opens a modal dialog containing the given component.|

Dialog can be opened by calling following params


| Parameters        |      Description         |
|-------------------| -------------------------|
| component or template reference | Type of component to load|
| config            | Optional config object   |

| Returns|
|--------|
|Open dialog box instance|


        

### Basic example using component
```js
component.ts

@Component({
  selector: 'dialog-example',
  templateUrl: 'dialog-example.html',
  styleUrls: ['dialog-example.css'],
})
export class DialogExample {
  firstname: string;
  constructor(public dialog: MatDialog) {}
  openModal(): void {
    let dialogRef = this.dialog.open(MyDialogComponent, {
      width: '250px',
      data: {firstname: this.firstname }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.firstname = result;
    });
  }
}

@Component({
  selector: 'my-dialog-component',
  templateUrl: 'my-dialog-component.html',
})
export class MyDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
 }


template.html:

<ol>
  <li>
<button mat-raised-button (click)="openModal()">Open Dialog box</button>
  </li>
  <li *ngIf="firstname">
    Firstname: <i>{{firstname}}</i>
  </li>
</ol>

```
### Basic example using template reference

```js

component.ts

openModal(templateRef) {
        let dialogRef = this.dialog.open(templateRef, {
            width: '250px',
             data: { firstname: this.firstname, lastname: this.lastname }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
             this.firstname = result;
        });
}

template.html
 <ol>
 <li>
<button (click)="openModal(mytemplate)">Open my template</button>
</li>
<ng-template #mytemplate>
        <h1>Dialog Box</h1>
        <li *ngIf="firstname">
        Firstname: <i>{{firstname}}</i>
       </li>
</ng-template>
</ol>
```

##### 2) Close()
##
|Description                           |
|-------------------------------------|
|Closes the currently opened dialog box|

### Basic example

```js
constructor(private dialogRef:MatDialogRef<MyDialogComponent>){ }

closeDialog(){
  this.dialogRef.close();
}
```