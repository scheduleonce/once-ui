## Action Menu

`oui-menu` is a floating panel containing list of options.

The `<oui-menu>` doesn't render anything by itself. The menu is attached to and opened via application of the `ouiMenuTriggerFor` directive.

```html 

    <oui-menu #appMenu="yourMenu">
        <button oui-menu-item>Settings</button>
        <button oui-menu-item>Help</button>
    </oui-menu>

    <button oui-icon-button [ouiMenuTriggerFor]="yourMenu">
        <oui-icon>three-dots</oui-icon> <!-- specify any icon -->
    </button>

```

## Toggling the menu programmatically

The menu exposes an API to open/close programmatically. Please note that in this case, an ouiMenuTriggerFor directive is still necessary to attach the menu to a trigger element in the DOM.

```typescript

    class MyComponent {
        @ViewChild(OuiMenuTrigger) trigger: OuiMenuTrigger;

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
            <oui-icon>dialpad</oui-icon>
            <span>Redial</span>
        </button>
        <button oui-menu-item disabled>
            <oui-icon>voicemail</oui-icon>
            <span>Check voicemail</span>
        </button>
        <button oui-menu-item>
            <oui-icon>notifications_off</oui-icon>
            <span>Disable alerts</span>
        </button>
    </oui-menu>

```

## Customizing menu position

By default, the menu will display below (y-axis), after (x-axis), and overlapping its trigger. The position can be changed using the `xPosition (before | after)` and `yPosition (above | below)` attributes. The menu can be be forced to not overlap the trigger using [overlapTrigger]="false" attribute.

```html
    <oui-menu #appMenu="ouiMenu" yPosition="above">
        <button oui-menu-item>Settings</button>
        <button oui-menu-item>Help</button>
    </oui-menu>

    <button oui-icon-button [ouiMenuTriggerFor]="appMenu">
        <oui-icon>more_vert</oui-icon>
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
        <oui-icon>more_vert</oui-icon>
    </button>

```

## Lazy rendering

By default, the menu content will be initialized even when the panel is closed. To defer initialization until the menu is open, the content can be provided as an ng-template with the ouiMenuContent attribute:

```html
    <oui-menu #appMenu="ouiMenu">
        <ng-template ouiMenuContent>
            <button oui-menu-item>Settings</button>
            <button oui-menu-item>Help</button>
        </ng-template>
    </oui-menu>

    <button oui-icon-button [ouiMenuTriggerFor]="appMenu">
        <oui-icon>more_vert</oui-icon>
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

    <button oui-icon-button [ouiMenuTriggerFor]="appMenu" [ouiMenuTriggerData]="{name: 'Sally'}">
        <oui-icon>more_vert</oui-icon>
    </button>

    <button oui-icon-button [ouiMenuTriggerFor]="appMenu" [ouiMenuTriggerData]="{name: 'Bob'}">
        <oui-icon>more_vert</oui-icon>
    </button>

```

## Keyboard Interaction

* DOWN_ARROW: Focuses the next menu item
* UP_ARROW: Focuses previous menu item
* RIGHT_ARROW: Opens the menu item's sub-menu
* LEFT_ARROW: Closes the current menu, if it is a sub-menu.
* ENTER: Activates the focused menu item