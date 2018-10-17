## Publishing New Package

1. Update the package version in ui project folder.

2. Run `npm run package`

3. The above command will generate the versioned tarball file in the dist directory. For example if 
the file name is once-ui-0.2.19.tgz then you can publish this file using command `npm publish ./dist/ui/once-ui-0.2.19.tgz`

