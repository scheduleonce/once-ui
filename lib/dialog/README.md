# Dialog shared angular component

The component deals with the popup/dialog shared angular component. 

## Getting started

```js
import { DialogModule } from '@once/ui';
````

### Usage

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
| [theme]       | string         | once-ui-theme-blue                 | no       | Name of the themes (once-ui-theme-blue, once-ui-theme-green)|               |
| [modal]       | boolean         | false                 | no       | If `true` make the dialog a modal|               |
| [escape]       | boolean         | false                 | no       | If `true`If true dialog gets closed on escape button press from keyboard|               |

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
|Opens a dialog/popup containing the given component or template.|

##### Params:
#

| Parameters        |      Description         |
|-------------------| -------------------------|
| component or template reference | Type of component to load|
| config            | Optional config object   |

| Returns|
|--------|
|Open dialog box instance|


##### Basic example using component

- Import TestingComponent in the module
- Declare TestingComponent in entryComponents
###### any.module.ts
#

```js
import { TestingComponent } from './testing/testing.component';
@NgModule({
  entryComponents: [TestingComponent]
});
```

###### component.ts 
#


```js 
export class MyComponent {

openDialog(){
   this.dialog.open(TestingComponent, {
      modal: true,
      header: {
        video: {
          tooltip: 'Video',
          link: 'https://www.youtube.com/watch?v=b1ieJtIx1NY',
        },
        close: {
          tooltip: 'Close'
        }
      }
    });
   }
}
```

##### Basic example using template reference
- Import Dialog Service
- Use @ViewChild to get the element from the view DOM

###### component.ts
#

```js
import {DialogService} from './dialog/src/dialog.service';

export class MyComponent {

@ViewChild('vertex') element: ElementRef;

constructor(private dialog: DialogService) {
}

openDialog() {
    this.dialog.open(this.element, {
      title: {
        text: "Header Title",
        icon: 'https://cloudinary-res.cloudinary.com/image/upload/c_fit,dpr_auto,h_100,w_85/v1501276210/ico-image-upload2x-170x201.png'
      },
      header: {
        article: {
          tooltip: 'article',
          link: 'https://www.youtube.com/watch?v=b1ieJtIx1NY',
        },
        video: {
          tooltip: 'Video',
          link: 'https://www.youtube.com/watch?v=b1ieJtIx1NY',
        },
        close: {
          tooltip: 'Close'
        }
      },
      footer: {
        linkButtons: [
          {
            tooltip: 'tooltip text',
            text: 'Link text to show',
            disabled: false,
            callback: function(){
            }
          },
          {
            tooltip: 'tooltip text',
            text: 'Link text to show',
            disabled: true,
            callback: function(){
            }
          }
        ],
        buttons: [
          {
            tooltip: 'Button tooltip text',
            text: 'Button text to show',
            disabled: true,
            callback: function(){
            }
          },
          {
            tooltip: 'Button tooltip text',
            text: 'Button text to show',
            disabled: true,
            callback: function(){
            }
          }
        ]
        }
    });
   }
}
```

######  template.html
#
```js
<div #vertex>
   Dialog box content goes here...
   <h1>Content..</h1>
</div>
```

##### 2) Close()
##
|Description                           |
|-------------------------------------|
|Closes the currently opened dialog box|

### Basic example

```js
import {DialogService} from '../dialog.service';

constructor(public dialog: DialogService) {
}

close() {
  this.dialog.close();
}
```
