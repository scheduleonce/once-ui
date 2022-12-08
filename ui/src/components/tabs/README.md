This is prototype of an alternate version of the Angular Material tabs built on top of
[MDC Web](https://github.com/material-components/material-components-web). It demonstrates how
Angular Material could use MDC Web under the hood while still exposing the same API Angular users as
the existing `<oui-tab-group>`. This component is experimental and should not be used in production.

## How to use
Assuming your application is already up and running using Angular Material, you can add this
component by following these steps:

1. Install Angular Material & MDC WEB:

   ```bash
   npm i material-components-web @angular/material
   ```

2. In your `angular.json`, make sure `node_modules/` is listed as a Sass include path. This is
   needed for the Sass compiler to be able to find the MDC Web Sass files.

   ```json
   ...
   "styles": [
     "src/styles.scss"
   ],
   "stylePreprocessorOptions": {
     "includePaths": [
       "node_modules/"
     ]
   },
   ...
   ```

3. Import the experimental `MatTabsModule` and add it to the module that declares your
   component:

   ```ts
   import {OuiTabsModule} from '@angular/material/tabs';

   @NgModule({
     declarations: [MyComponent],
     imports: [OuiTabsModule],
   })
   export class MyModule {}
   ```

4. Use `<oui-tab-group>` in your component's template, just like you would the normal
   `<oui-tab-group>`:

   ```html
    <oui-tab-group>
      <oui-tab label="First">Content 1</oui-tab>
      <oui-tab label="Second">Content 2</oui-tab>
      <oui-tab label="Third">Content 3</oui-tab>
    </oui-tab-group>
   ```

5. Add the theme and typography mixins to your Sass. (There is currently no pre-built CSS option for
   the experimental tabs):

   ```scss
   @use '@angular/material' as oui;

   $my-primary: oui.define-palette(oui.$indigo-palette);
   $my-accent: oui.define-palette(oui.$pink-palette, A200, A100, A400);
   $my-theme: oui.define-light-theme((
     color: (
       primary: $my-primary,
       accent: $my-accent
     )
   ));

   @include oui.tabs-theme($my-theme);
   @include oui.tabs-typography($my-theme);
   ```

## API differences
The experimental tabs API closely matches the
[API of the standard tabs](https://material.angular.io/components/tabs/api).
`@angular/material/tabs` exports symbols with the same name and public interface
as all of the symbols found under `@angular/material/legacy-tabs`, except for the following
differences:

* `OuiTabNav` will throw an error in dev mode if a `[tabPanel]` is not provided.
* `OuiTabLink` is defined as a `Component` in the experimental package,
  whereas in the current one it's a `Directive`.

## Replacing the standard tabs in an existing app
Because the experimental API mirrors the API for the standard tabs, it can easily be swapped in
by just changing the import paths. There is currently no schematic for this, but you can run the
following string replace across your TypeScript files:

```bash
grep -lr --include="*.ts" --exclude-dir="node_modules" \
  --exclude="*.d.ts" "['\"]@angular/material/legacy-tabs['\"]" | xargs sed -i \
  "s/['\"]@angular\/material\/legacy-tabs['\"]/'@angular\/material\/tabs'/g"
```

CSS styles and tests that depend on implementation details of the tabs (such as getting elements
from the template by class name) will need to be manually updated.

