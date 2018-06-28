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

In @once/ui, a theme is created by composing multiple palettes.


### Using a pre-built theme

Once UI comes prepackaged with two pre-built theme css files. These theme files also include all of the styles for core (styles common to all components), so you only have to include a single css file for Once UI in your app

Available pre-built themes:

* once-ui-theme-blue
* once-ui-theme-green

### Applying a particular theme to your project

In the whole project:

* `@import '~@once/ui/themes/once-ui-theme-<base-theme-color>.css'` in project's style.css 
* You can import the theme file in `.angular-cli.json` file like as follows:-

    `"styles": ["./node_modules/@once/ui/themes/once-ui-theme-blue.css"]`
 
In a particular component:


* `@import '~@once/ui/themes/once-ui-theme-<base-theme-color>.css'` in particular component's style file.
* You can import the theme file in component's .ts file like as show below

    `"styleUrls": ["~@once/ui/themes/once-ui-theme-<base-theme-color>.css"]` 


###  Defining a custom theme

When you want more customization than a pre-built theme offers, you can create your own theme file.

A custom theme file does three things:

* Imports `@import '~@once/ui/themes/once-ui-theme-<base-theme-color>.css'` this includes all common styles that are used by multiple components. This should only be included once in your application. If this mixin is included multiple times, your application will end up with multiple copies of these common styles.

* Defines a theme data structure as the composition of multiple palettes. This object can be created with any valid Sass map variable name, in my case this is `$my-custom-theme`. In this you need to pass the components like buttons, inputs, checkbox etc..

* The output of this map (`$my-custom-theme` or custom theme name) is then passed to the `once-ui-create-theme` mixin, which will output all of the corresponding styles for the theme.

and you are done!

#### Note: 
`base-theme-color` is/are blue and green only.

A typical theme file will look something like this:

```sh
@import '~@once/ui/themes/once-ui-theme-<base-theme-color>.css';

$my-custom-theme: (
  buttons: (
    base: red,
    light: yellow,
    text-color: blue
  )
);

.onceUiDialogContainer .once-ui-theme  {
  @include once-ui-create-theme($my-custom-theme);
}
```

You only need this single Sass file; you do not need to use Sass to style the rest of your app.

### Publishing npm module

To publish your npm module you need to go through the following steps:

##### Login to npm
#
In order to publish your module you need to have an account first. If you don't have an account then you need to first create an account using **npm adduser**.  If you are already registered then you need to login from the terminal by using **npm login**

##### Update npm version
#
Use **npm version <update_version>** to update npm version. This command will change the version number in your package.json.
Here *update_version* is one of the [semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning) release types, patch, minor, or major. You can also edit your package.json file and edit version number like shown below

```js
{
  "name": "@once/ui",
  "version": "1.0.0",
  "license": "MIT",
  "repository": "https://github.com/scheduleonce/ui-components.git",
  "bugs": "https://github.com/scheduleonce/ui-components/issues",
  "author": "author-name <author.name@scheduleonce.com>",
  "typings": "index.d.ts",
  "engines": {
    "node": "8.x"
  }
```

##### Update readme  file (readme.md)
#

If you have updated your README file and you want to update it on npm then you need to update new version of your package. So you need to run **npm version patch** and **npm publish** to update readme file.


##### Run npm build
#
 **npm run build-npm** compiles the application into the output directory. After running this command, the build will be stored in the */dist* directory.


##### Publish npm module
#
Run **npm publish dist** command to publish your package on npm. After your module has been published to npm then you can check it on https://npmjs.com/package/<package> and if you want to use it in your application then you can install it by using the command 
```linux
$ npm i --save @once/ui
```