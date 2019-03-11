The Once UI buttons are native `<button>` or `<a>` elements with oncehub styling and other utilities.

Native `<button>` or `<a>` elements are always used in order to provide the most straightforward and accessible experience for users.
A `<button>` element should be used whenever some action is performed. An `<a>` element should be used whenever the user will navigate to another view.

There are several `<button>` variants, each applied as an attribute:

| **Name**               | **Description**                                  |
| ---------------------- | ------------------------------------------------ |
| `oui-button`           | rounded regular solid button                     |
| `oui-ghost-button`     | rounded regular hollow button                    |
| `oui-link-button`      | text link button                                 |
| `oui-icon-text-button` | rounded button meant to contain icon             |
| `oui-icon-button`      | Button which contains the icon with hover effect |
| `color`                | it can be from `primary`,`accent` and `warn`     |
| `disabled`             | to disable the button                            |
| `progress`             | to add button states                             |

## Theming

Buttons can be colored in terms of the current theme using the color property to set the background color to primary, accent, or warn.

## Usage Example

```html
<!-- regular solid button with primary color -->
<button oui-button color="primary"></button>

<!-- ghost button with warn color -->
<button oui-ghost-button color="warn"></button>

<!-- regular disabled button -->
<button oui-button disabled></button>
```

## Steps for making progress button

1. Add `progress` input attribute in your `<button>` along with the type of button

   If you want to add your custom text for stages then you can provide array of strings like below.

   ```html
   <button
     #progressButton
     oui-button
     [progress]="['Discard','Discarding...','Discarded']"
     (click)="buttonClick()"
   ></button>
   ```

   If you want to use default texts for stages you can use below code, the default values
   for progress is ['Save', 'Saving...', 'Saved']

   ```html
   <button #progressButton oui-button progress (click)="buttonClick()"></button>
   ```

2) In your component typescript file you can use ViewChild template-reference variable to call button methods to change states;

   ```typescript
   export class AppComponent {
     @ViewChild('progressButton')
     progressButton: OuiButton;

     buttonClick() {
       this.progressButton.setToProgress();
       this.someService.callApi().subscribe(
         () => {
           this.progressButton.setToDone();
         },
         error => {
           this.progressButton.setToDefault();
         }
       );
     }
   }
   ```

| Method | Description      |
| ------ | ---------------- |
| focus  | Focus the button |

## Stackblitz demo link

This demo link shows how you can work with `oui-icon-button` component:

You can see the [https://stackblitz.com/edit/oui-button-component](https://stackblitz.com/edit/oui-button-component) demo for more details.

_Note-`oui-icon-button` has a hover effect. It is basically box surrounding the `icon`. the general rule for the hover size is +4px from the icon size. `oui-icon-button` is enriched with a `shared-layout` directive called `focusOnIconButton`. `focusOnIconButton` works as a glue for `oui-icon-button` and `oui-menu`. `focusOnIconButton` will keep the border box opened as long as `oui-menu` is opened._

## How to use `focusOnIconButton` with `oui-icon-button`?

```
<button oui-icon-button [ouiMenuTriggerFor]="afterAboveMenu" focusOnIconButton>
    <oui-icon svgIcon="3-dots-horizontal"></oui-icon>
</button>
...menu code
```
