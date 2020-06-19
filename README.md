# oncehub-ui

> A collection shared ui components to use in Oncehub products

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Publishing a new package

1. Update the package version in ui project folder.
2. Run `npm run package`
3. The above command will generate the versioned tarball file in the dist directory. For example if
   the file name is oncehub-ui-0.2.19.tgz then you can publish this file using command `npm publish ./dist/ui/oncehub-ui-0.2.19.tgz`

## Storybook

To run storybook locally:

```sh
$ npm run storybook
```

To deploy storybook (only master branch) to Github pages:

```sh
$ npm run deploy-storybook
```

The deployed Storybook will be available at

> https://scheduleonce.github.io/once-ui

There's also a version of Storybook for qa branch:

> https://once-ui-qa.azurewebsites.net

It is built automatically when changes are pushed to qa branch using Azure Devops
