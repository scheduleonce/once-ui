# Action menu

Action menu Component

## Usage

Example of simple usage:

```html
<oh-action-menu
  [items]="actionMenuItems"
  [dotsMenuTooltip]="'User profile menu'"
  [actionItem]="user"
></oh-action-menu>
```

```js
actionMenuItems = [
  {
    label: 'Delete User profile',
    icon: '/assets/images/templates-trash.svg',
    click: () => {},
    tooltip: 'Delete User profile'
  }
];
```

## API

| Input           | Type               | Default                      | Description                              |
| --------------- | ------------------ | ---------------------------- | ---------------------------------------- |
| items           | ActionMenuConfig[] | null                         | items in the Action menu                 |
| dotsMenuTooltip | string             | ''                           | tooltip shown on 3 dots hover            |
| actionItem      | any                | null                         | object on which action will be performed |
| isVertical      | boolean            | false                        | 3 dots styling - vertical or horizontal  |
| defaultPosition | string             | 'left_bottom' if vertical    | default position of the menu to be       |
|                 |                    | 'right_bottom' if horizontal | opened.                                  |
