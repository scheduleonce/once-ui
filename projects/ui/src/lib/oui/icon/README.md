# OUI-ICON
`oui-icon`  makes it easier to use  _vector-based_  icons in your app. This directive supports only SVG icons.

# Registering Icons
`OuiIconRegistry`  is an injectable service that allows you to associate icon names with SVG URLs, Its methods are discussed below and listed in the API summary.

## Named icons
To associate a name with an icon URL, use the `addSvgIcon`. The methods of `OuiIconRegistry`. After registering an icon, it can be displayed by setting the `svgIcon` input. For an icon in the default namespace, use the name directly. 

## Theming
By default, icons will use the current font color (`currentColor`). this color can be changed to match the current theme's colors using the  `color`  attribute. This can be changed to  `'primary'`,  `'accent'`, or  `'warn'`.

## API references
OuiIconRegistry
`import { OuiIconModule } from '@once/ui';`

## Services
### `OuiIconRegistry`
Service to register and display icons used by the  `<oui-icon>`  component.

-   Registers icon URLs by namespace and name.
-   Registers icon set URLs by namespace.
-   Loads icons from URLs and extracts individual icons from icon sets.

## Methods
| Name | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `addSvgIcon` | Registers an icon by URL in the default namespace. | **iconName[String]:** Name under which the icon should be registered. <br/>**url:** `SafeResourceUrl` | `this` |
| `addSvgIconSet` | Registers an icon set by URL in the default namespace. |**url:** `SafeResourceUrl`|`this`|


## Directives
###  `OuiIcon`

Component to display an icon. It can be used in the following ways:
- Specify the svgIcon input to load an SVG icon from a URL previously registered with the addSvgIcon, addSvgIconSet.
**Examples:** `<oui-icon svgIcon="[name]"></oui-icon> <oui-icon svgIcon="animals:cat"></oui-icon>`

- Use a font ligature as an icon by putting the ligature text in the content of the `<oui-icon>` component. 
**Example:** `<oui-icon>home</oui-icon> <oui-icon>sun</oui-icon>`

> Selector:  oui-icon
> Exported As: ouiIcon

## Properties

| Name  | Description |
| ------------- | ------------- |
| @Input() <br/>`color: Theme`  | Theme color palette for the component.  |
| @Input() <br/>`svgIcon: String`  | Name of the icon in the SVG icon set.  |
| @Input() <br/>`inline: boolean`  | Whether the icon should be inlined, automatically sizing the icon to match the font size of the element the icon is contained in.  |
