/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 * Updates Bundle file paths in dist/lib
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const glob = require('glob');
const jsonFile = require('jsonfile');

// List files
const files = glob.sync('./dist/lib/**/*.json');
const changePaths = (path) => typeof path === 'string' && path.replace('../../', '../');

// List of bundle paths
const bundles = ['main', 'module', 'es2015', 'esm5', 'esm2015', 'fesm5', 'fesm2015', 'typings', 'metadata'];

// Update paths
const updateBundlePaths = (packageJson) => {
    let json = packageJson;
    for (let index = 0; index < bundles.length; index++) {
        if (packageJson[bundles[index]]) {
            json[bundles[index]] = changePaths(packageJson[bundles[index]]);
        }
    }
    return json;
};

// Get module's json
for (let index = 0; index < files.length; index++) {
    const fileLocation = files[index];
    if (fileLocation) {
        jsonFile.readFile(fileLocation, function (err, obj) {
            if (!err)
               jsonFile.writeFile(fileLocation, Object.assign({}, obj, updateBundlePaths(obj)));
        });
    }
}