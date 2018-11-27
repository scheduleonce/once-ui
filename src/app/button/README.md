The Once UI buttons are native `<button>` or `<a>` elements with oncehub styling and other utilities.


Native `<button>` or `<a>` elements are always used in order to provide the most straightforward and accessible experience for users.
A `<button>` element should be used whenever some action is performed. An `<a>` element should be used whenever the user will navigate to another view.

There are several `<button>` variants, each applied as an attribute:

| **Name**                        | **Description**                                            |
| -----------------------------   | ---------------------------------------------------------- |
| `oui-button`                    | rounded regular solid button                               |      
| `oui-ghost-button`              | rounded regular hollow button                              |
| `oui-link-button`               | text link button                                           |
| `oui-icon-button`               | rounded button meant to contain icon                       |
| `color`                         | it can be from `primary`,`accent` and `warn`               |
| `disabled`                      | to disable the button                                      |

## Theming

Buttons can be colored in terms of the current theme using the color property to set the background color to primary, accent, or warn.

## Usage Example

```html
    <!-- regular solid button with primary color -->
    <button oui-button color="primary"></button>

    <!-- ghost button with warn color -->
    <button oui-ghost-button color="warn" ></button>

    <!-- regular disabled button -->
    <button oui-button disabled ></button>
```