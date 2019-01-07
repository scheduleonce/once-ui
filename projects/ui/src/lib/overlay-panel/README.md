# Overlay Panel

Overlay Panel Component

## Usage

Example of simple usage:

```html
<div (mouseenter)="op1.show($event)" (mouseleave)="op1.hide($event)"></div>
<once-overlay-panel #op1>
  <p>Enter your content here</p>
  <p>Another paragraph</p>
</once-overlay-panel>
```

Example of uses with all configurations:

```html
<div (mouseenter)="op1.show($event)" (mouseleave)="op1.hide($event)"></div>
<once-overlay-panel
  #op1
  [title]="'My title here'"
  [size]="'large'"
  [imageLink]="'abc.svg'"
>
  <p>Enter your content here</p>
  <p>Another paragraph</p>
</once-overlay-panel>
```

## API

| Input     | Type   | Default | Description                        |
| --------- | ------ | ------- | ---------------------------------- |
| title     | string | null    | overlay title                      |
| size      | string | 'small' | 'small' or 'large'                 |
| imageLink | string | null    | enter image url for large overlays |
