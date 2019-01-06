# Theming your projects

### What is theme?

A **theme** is the set of colors that will be applied to the once-ui components. We have three color sets `primary`, `accent` and `warn` which can be used for different functionalities.

### Using a pre-built theme

The once-ui library comes with several prebuilt theme scss files. You can import any theme in your global
**style.scss** file or **angular.json** config.

You can include a theme file directly into your application from
`@once/ui/prebuilt-themes`

Available pre-built themes:

- `scheduleonce.scss`
- `oncehub.scss`
- `chatonce.scss`
- `inviteonce.css`

If you want to import theme in style.scss file than you can include below line:

```scss
@import '~@once/ui/prebuilt-themes/scheduleonce.scss';
```

### Defining a custom theme

When you want a more customization than a prebuilt themes offers, you can create your own theme file.

To generate your customize theme you need to provide some data objects which contains different colors and other properties. You can use some helper function to generate these objects which @once/ui provides.

A typical theme file will look something like this:

```scss
@import '~@once/ui/theming';

/*
    oui-palette(base,lighter,darker,contrast) is a helper function which generate color objects according to given params
    * @param base : base color (required)
    * @param lighter: lighter version of base color (optional) if provided null then it calculates 10% lighter of base color
    * @param darker: darker version of base color (optional) if provided null then it calculates 10% darker of base color
    * @param contrast: color of foreground over base color (optional) default value is set to white.

*/
$custom-primary: oui-palette(#31698a, null, #224960, #ffffff);
$custom-accent: oui-palette(#16623a, #448161, #0d3a22, #ffffff);
$custom-warn: oui-palette(#800000, #a64c4c, #4c0000, #ffffff);

/*
    oui-theme(primary,accent,warn,foreground,background) is a helper function which generates theme objects according to given params.
    * @param primary: primary color object (optional) if not provided then it takes default primary color.
    * @param accent: primary color object (optional) if not provided then it takes default accent color.
    * @param warn: primary color object (optional) if not provided then it takes default warn color.
    * @param foreground: primary color object (optional) if not provided then it takes default foreground color.
    * @param background: primary color object (optional) if not provided then it takes default background color.
*/

$custom-theme: oui-theme($custom-primary, $custom);

/*
    once-ui-theme(theme) is a mixins which generates all css classes according to provided theme object
    @param theme: theme object (required)
*/
@include once-ui-theme($custom-theme);
```
