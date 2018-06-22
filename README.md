# Library of UI components

Various UI components that we are using at Oncehub.

### Features:
- No external dependencies (easy to use!),
- Minimal styling (easy to customize!),
- Great performance.

For demos, see the [project page](https://once-ui.azurewebsites.net).

### Available components:

- [Datepicker](lib/datepicker/README.md)
- [Dialog](lib/dialog/README.md)
- [Dropdown](lib/drop-down/README.md)

### Installation

```sh
$ npm i --save @once/ui
```
### How to use?
```sh
import { DropDownModule, DatepickerModule } from '@once/ui';

@NgModule({
  imports: [
    DropDownModule,
    DatepickerModule
  ]
})

```

# Theming your Once UI app

#### What is a theme?

In Angular Material, a theme is created by composing multiple palettes.


### Using a pre-built theme

Once UI comes prepackaged with two pre-built theme css files. These theme files also include all of the styles for core (styles common to all components), so you only have to include a single css file for Once UI in your app

Available pre-built themes:

* once-ui-theme-blue - This is the default theme
* once-ui-theme-green

To use any theme you need to pass the name of the theme in:

```
this.dialog.open(component, {
   theme: 'once-ui-theme-green'
})
```

The above code snippet apply the green theme for dialogbox component.

###  Defining a custom theme

When you want more customization than a pre-built theme offers, you can create your own theme file.

A custom theme file does three things:

* Imports `@import '~@once/ui/themes/base.scss'` this includes all common styles that are used by multiple components. This should only be included once in your application. If this mixin is included multiple times, your application will end up with multiple copies of these common styles.

* Defines a theme data structure as the composition of multiple palettes. This object can be created with any valid Sass map variable name, in my case this is `$my-light-theme`. In this you need to pass the components like buttons, inputs, checkbox etc..

* The output of this map (`$my-light-theme` or custom theme name) is then passed to the `once-ui-create-theme` mixin, which will output all of the corresponding styles for the theme.

* Last thing you need to tell the theme name to `@once/ui` component. 


A typical theme file will look something like this:

```sh
@import '~@once/ui/themes/base.scss';

$my-light-theme: (
  buttons: (
    base: red,
    light: yellow
  )
);

.my-light-theme {
  @include once-ui-create-theme($my-light-theme);
}
```

The most important thing, you need to tell your dialog box component the name of your theme like as follows:-

```
this.dialog.open(component, {
   theme: 'my-light-theme'
})
```
You only need this single Sass file; you do not need to use Sass to style the rest of your app.
