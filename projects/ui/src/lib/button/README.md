# Button

Button Module - contains ButtonComponent and ProgressButtonComponent

## Usage

Example of simple usage:

### ButtonComponent

```html
<once-button
  [label]="'Title here'"
  [type]="'link'"
  (click)="myFunction()"
  [disabled]="form.pristine"
></once-button>
```

### ProgressButtonComponent

```html
<once-progress-button #saveButton (click)="onSubmit()"></once-progress-button>
```

```js
  @ViewChild('saveButton') saveButton;

  onSubmit() {
    this.saveButton.setToProgress();
    this.service.saveSomething().subscribe(data => {
      this.saveButton.setToDone();
      }
    )
  }
```

## API

### ButtonComponent

| Input     | Type    | Default   | Description                                |
| --------- | ------- | --------- | ------------------------------------------ |
| label     | string  | null      | button label                               |
| type      | string  | 'primary' | 'primary', 'secondary', 'link'             |
| disabled  | boolean | null      | add true condition to make button disabled |
| className | string  | null      | apply any additional classes               |

| Output      | Type          | Description                               |
| ----------- | ------------- | ----------------------------------------- |
| buttonClick | Event Emitter | callback to invoke when button is clicked |

### ProgressButtonComponent

| Input    | Type                                                | Default                                                  | Description                                |
| -------- | --------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------ |
| label    | { default: string; progress: string; done: string } | { default: 'Save', progress: 'Saving...', done: 'Saved'} | button label                               |
| disabled | boolean                                             | null                                                     | add true condition to make button disabled |

| Output      | Type          | Description                               |
| ----------- | ------------- | ----------------------------------------- |
| buttonClick | Event Emitter | callback to invoke when button is clicked |

| Method          | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| setToProgress() | sets to progress state                                       |
| setToDone()     | sets to done state and after 3 seconds returns to idle state |
| reset()         | sets to idle state immediately                               |
