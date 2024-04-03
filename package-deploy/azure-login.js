let fs = require('fs');
let path = require('path');

let token = '';

process.argv.forEach(function (val, index, array) {
  if (index == 2) token = btoa(val);
});

let registry =
  'https://pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/';

var configPath = '/workspace/source/.npmrc'; // Same as workingDir path in .lighthouse/jenkinsx/release.yaml

content = `
registry=https://registry.npmjs.org
@once:registry=${registry}
always-auth=true

; begin auth token (WRITE & READ permission)
//pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/:username=oncehub
//pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/:_password=${token}
//pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/:email=
//pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/:username=oncehub
//pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/:_password=${token}
//pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/:email=
; end auth token (WRITE & READ permission)
`;

fs.writeFileSync(configPath, content);
