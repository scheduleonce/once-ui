# oncehub-ui


[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

We are building and maintaining UI components and tools that will help you to build up your own custom components with a lot of customizing options..

## How to install?

You can use npm command line tool to install package.

```sh
npm install @oncehub/ui
```

## How to use?

Import the Module:

```ts
import {OuiFormFieldModule, OuiAutocompleteModule} from '@oncehub/ui';

@NgModule({
  ...
  imports: [OuiFormFieldModule, OuiAutocompleteModule]
  ...
})
export class AppModule { }
```

Add Form Field in app.component.html

```html
<oui-form-field>
  <input
    oui-input
    type="text"
    formControlName="name"
    id="name"
    maxlength="100"
    class="form-control"
  />
</oui-form-field>
```

## Storybook

To run storybook locally:

```sh
npm run storybook
```

To deploy storybook (only master branch) to Github pages:

```sh
npm run deploy-storybook
```

The deployed Storybook will be available at

> https://scheduleonce.github.io/once-ui

There's also a version of Storybook for qa branch:

> https://once-ui-qa.azurewebsites.net

It is built automatically when changes are pushed to qa branch using Azure Devops

# Our release process

We are following a branch strategy for releasing the prerelease and final versions.

- `major/minor/patch` : all these versions will be published from the `master` branch.
- `prerelease --preid=beta`: all the prerelease version will be published from the `qa` branch.

#### Patch releases

The patch builds (1.0.1, 1.0.2, etc.) are prepared based on commits in the `master` branch;
it contains only non-breaking changes.

#### Minor releases

The minor builds (1.1.0, 1.2.0, etc.) can contain changes related to HTML, APIs, CSS, and UX.

#### Prerelease releases

The prerelease builds (1.0.1-beta.0, 1.0.1-beta.1, etc.) are prepared based on commits in the `qa` branch;

## Publishing a new package

1. Update the package version in ui folder.
2. Run `npm run package`
3. The above command will generate the versioned tarball file in the dist directory. For example if
   the file name is oncehub-ui-0.2.19.tgz then you can publish this file using command `npm publish ./dist/ui/oncehub-ui-0.2.19.tgz`

# Browser Support

We supports the most recent versions of all the major browsers: Chrome, Firefox, Safari and IE11/edge.
