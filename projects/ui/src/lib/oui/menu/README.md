## Action Menu

`oui-menu` is a floating panel containing list of options.

The `<oui-menu>` doesn't render anything by itself. The menu is attached to and opened via application of the `ouiMenuTriggerFor` directive.

```html
<oui-menu #appMenu="yourMenu">
  <button oui-menu-item>Settings</button> <button oui-menu-item>Help</button>
</oui-menu>

<button oui-icon-button [ouiMenuTriggerFor]="yourMenu">
  <!-- specify any icon -->
  <oui-icon svgIcon="three-dots"></oui-icon>
</button>
```

## Toggling the menu programmatically

The menu exposes an API to open/close programmatically. Please note that in this case, an ouiMenuTriggerFor directive is still necessary to attach the menu to a trigger element in the DOM.

```typescript
class MyComponent {
  @ViewChild(OuiMenuTrigger)
  trigger: OuiMenuTrigger;

  someMethod() {
    this.trigger.openMenu();
  }
}
```

## Icons

Menus support displaying `oui-icon` before the menu item text.

```html
<oui-menu #menu="ouiMenu">
  <button oui-menu-item>
    <oui-icon svgIcon="dialpad"></oui-icon>
    <span>Redial</span>
  </button>
  <button oui-menu-item disabled>
    <oui-icon svgIcon="voicemail"></oui-icon>
    <span>Check voicemail</span>
  </button>
  <button oui-menu-item>
    <oui-icon svgIcon="notifications-off"></oui-icon>
    <span>Disable alerts</span>
  </button>
</oui-menu>
```

## Customizing menu position

By default, the menu will display below (y-axis), after (x-axis), and overlapping its trigger. The position can be changed using the `xPosition (before | after)` and `yPosition (above | below)` attributes. The menu can be be forced to not overlap the trigger using [overlapTrigger]="false" attribute.

```html
<oui-menu #appMenu="ouiMenu" yPosition="above">
  <button oui-menu-item>Settings</button> <button oui-menu-item>Help</button>
</oui-menu>

<button oui-icon-button [ouiMenuTriggerFor]="appMenu">
  <oui-icon svgIcon="more-vert"></oui-icon>
</button>
```

## Nested Menu

The new `oui` action menu supports the ability for an `oui-menu-item` to open a sub-menu. To do so, you have to define your root menu and sub-menus, in addition to setting the [ouiMenuTriggerFor] on the oui-menu-item that should trigger the sub-menu:

```html
<oui-menu #rootMenu="ouiMenu">
  <button oui-menu-item [ouiMenuTriggerFor]="subMenu">Power</button>
  <button oui-menu-item>System settings</button>
</oui-menu>

<oui-menu #subMenu="ouiMenu">
  <button oui-menu-item>Shut down</button>
  <button oui-menu-item>Restart</button>
  <button oui-menu-item>Hibernate</button>
</oui-menu>

<button oui-icon-button [ouiMenuTriggerFor]="rootMenu">
  <oui-icon svgIcon="more-vert"></oui-icon>
</button>
```

## Lazy rendering

By default, the menu content will be initialized even when the panel is closed. To defer initialization until the menu is open, the content can be provided as an ng-template with the ouiMenuContent attribute:

```html
<oui-menu #appMenu="ouiMenu">
  <ng-template ouiMenuContent>
    <button oui-menu-item>Settings</button> <button oui-menu-item>Help</button>
  </ng-template>
</oui-menu>

<button oui-icon-button [ouiMenuTriggerFor]="appMenu">
  <oui-icon svgIcon="more-vert"></oui-icon>
</button>
```

## Passing in data to a menu

When using lazy rendering, additional context data can be passed to the menu panel via the ouiMenuTriggerData input. This allows for a single menu instance to be rendered with a different set of data, depending on the trigger that opened it:

```html
<oui-menu #appMenu="ouiMenu">
  <ng-template ouiMenuContent let-name="name">
    <button oui-menu-item>Settings</button>
    <button oui-menu-item>Log off {{name}}</button>
  </ng-template>
</oui-menu>

<button
  oui-icon-button
  [ouiMenuTriggerFor]="appMenu"
  [ouiMenuTriggerData]="{name: 'Sally'}"
>
  <oui-icon svgIcon="more-vert"></oui-icon>
</button>

<button
  oui-icon-button
  [ouiMenuTriggerFor]="appMenu"
  [ouiMenuTriggerData]="{name: 'Bob'}"
>
  <oui-icon svgIcon="more-vert"></oui-icon>
</button>
```

## Keyboard Interaction

- DOWN_ARROW: Focuses the next menu item
- UP_ARROW: Focuses previous menu item
- RIGHT_ARROW: Opens the menu item's sub-menu
- LEFT_ARROW: Closes the current menu, if it is a sub-menu.
- ENTER: Activates the focused menu item

## Api Reference for menu

`import {OuiMenuModule} from '@once/ui';`

### Directive

---

### **OuiMenu**

Selector : `oui-menu`
Exported as : `ouiMenu`

**properties**

| Name                                                             | Description                            |
| ---------------------------------------------------------------- | -------------------------------------- |
| @Input() <br> xPosition: MenuPositionX                           | Position of the menu in the X axis     |
| @Input() <br> yPosition: MenuPositionY                           | Position of the menu in the Y axis     |
| @Output()<br> closed: EventEmitter<void 'click' 'keydown' 'tab'> | Event emitted when the menu is closed  |
| parentMenu: OuiMenuPanel undefined                               | Parent menu of the current menu panel. |

**methods**

| Name            | Description                         |
| --------------- | ----------------------------------- |
| focusFirstItem  | Focus the first item in the menu.   |
| resetActiveItem | Resets the active item in the menu. |

### **OuiMenuItem**

This directive is intended to be used inside an oui-menu tag. It exists mostly to set the role attribute.

Selector: `[oui-menu-item]`

Exported as: `ouiMenuItem`

**properties**

| Name                                                              | Description                        |
| ----------------------------------------------------------------- | ---------------------------------- |
| @Input() <br> disabled                                            | Whether the menu-item is disabled. |
| @Input() <br> role: 'menuitem' 'menuitemradio' 'menuitemcheckbox' | Position of the menu in the Y axis |

**methods**

| Name     | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| focus    | Focuses the menu item.                                                           |
| getLabel | Gets the label to be used when determining whether the option should be focused. |

### **OuiMenuTrigger**

This directive is intended to be used in conjunction with an oui-menu tag. It is responsible for toggling the display of the provided menu instance.

Selector: `[oui-menu-trigger-for] [ouiMenuTriggerFor]`

Exported as: `ouiMenuTrigger`

**properties**

| Name                                                    | Description                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| @Input('ouiMenuTriggerFor')<br> menu: OuiMenuPanel<any> | References the menu instance that the trigger is associated with |
| @Input('ouiMenuTriggerData') <br> menuData: any         | Data to be passed along to any lazily-rendered content.          |
| @Output()<br>menuClosed: EventEmitter<void>             | Event emitted when the associated menu is closed.                |
| @Output(): menuOpened: EventEmitter<void>               | Event emitted when the associated menu is opened.                |
| menuOpen: boolean                                       | Whether the menu is open.                                        |

**methods**

| Name                             | Description                                              |
| -------------------------------- | -------------------------------------------------------- |
| closeMenu                        | Closes the menu.                                         |
| focus                            | Focuses the menu trigger.                                |
| openMenu                         | Opens the menu.                                          |
| toggleMenu                       | Toggles the menu between the open and closed states.     |
| triggerSubmenu (returns boolean) | Whether the menu triggers a sub-menu or a top-level one. |

### **OuiMenuContent**

Menu content that will be rendered lazily once the menu is opened.

Selector: ng-template[ouiMenuContent]

### Interfaces

Default oui-menu options that can be overridden.

**properties**

| Name                     | Description                      |
| ------------------------ | -------------------------------- |
| xPosition: MenuPositionX | The x-axis position of the menu. |
| yPosition: MenuPositionY | The y-axis position of the menu. |

## Type Aliases

### MenuPositionX

```typescript
type MenuPositionX = 'before' | 'after';
```

### MenuPositionY

```typescript
type MenuPositionY = 'above' | 'below';
```

## Constants

### OUI_MENU_DEFAULT_OPTIONS

Injection token to be used to override the default options for oui-menu.

```typescript
const OUI_MENU_DEFAULT_OPTIONS: InjectionToken<OUIMenuDefaultOptions>;
```

## Stackblitz link

[https://stackblitz.com/edit/angular-menu-oui-234uuwvads](https://stackblitz.com/edit/angular-menu-oui-234uuwvads)
