# Popup/Dialog shared angular component

The component deals with the popup/dialog shared angular component. 

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
import { DialogModule, DialogService } from '@once/ui';

@NgModule({
  imports: [
    DialogModule
  ],
  providers: [DialogService]
})
```

## Properties

| Input            | Type            | Default                 | Required | Description |
| ---------------- | --------------- | ----------------------- | -------- | ----------------------- |
| [header]       | object         | null                 | no       | Header section: `IHEADER`|               |
| [footer]       | object         | null                 | no       | Footer section: `IFOOTER`|               |
| [size]       | string         | small                 | no       | Dialog box size|               |
| [theme]       | string         | once-ui-theme-blue                 | no       | Name of the themes|               |
| [modal]       | boolean         | false                 | no       | If `true` make the dialog a modal|               |

##### HEADER :: IHEADER
##

| Input            | Type            | Default                 | Required | Description |
| ---------------- | --------------- | ----------------------- | -------- | ----------------------- |
| [title]       | object         | `{text: '', icon: ''}`         | yes       | Expects title and icon from the user|               |
| [video]       | object         | `{tooltip: 'Video',  link: "<any-valid-url>"}`               | no       | Will open a video in a new tab. |               |
| [article]       | object         | `{tooltip: 'Article',  link: "<any-valid-url>"  }`               | no       | Will open a help article in a new tab |               |
| [close]       | object         | {tooltip: 'Close'}                 | no       | Will close the popup without taking any action |               |

##### FOOTER :: IFOOTER
##

| Input            | Type            | Default                 | Required | Description |
| ---------------- | --------------- | ----------------------- | -------- | ----------------------- |
| [linkButtons]       | object         | `[{ tooltip: 'Cancel 1', text: 'Cancel 1', disabled: false, callback: function () {} }]`          | no       | Array of “links” that will be stacked from the left corner of the footer.|               |
| [buttons]       | object         | `{tooltip: 'Cancel 1', text: 'Cancel 1', disabled: true, callback: function () {}},`               | no       | Call to actions buttons. Props.: If disabled, button is disabled |               |


## Methods


##### 1) Open(componentORTemplateRef, config)
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
