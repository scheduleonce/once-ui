#!/bin/sh
set -e

# for npm registry
node package-deploy/npm-login.js $(cat "/etc/npm-cred/NPM_AUTH_TOKEN")
npm whoami
npm i
chown root:root . && npm run package
filename="$(npm pack --dry-run | tail -n 1)"

#for Azure Artifacts
node package-deploy/azure-login.js $(cat "/etc/azure-artifact-cred/AZURE-ARTIFACT-AUTH-TOKEN")
npm config list

echo "$1"

if [[ "$1" == "qa" ]] || [[ "$1" == "master" ]] || [[ "$1" == "staging" ]] || [[ "$1" == "staging-app2" ]]
then
  npm publish dist/ui/$filename --registry=https://registry.npmjs.org/
  npm publish --registry=https://pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/
else
  npm publish --tag beta dist/ui/$filename --registry=https://registry.npmjs.org/
  npm publish --tag beta --registry=https://pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/
fi

echo "$filename package pushed to NPM & Azure Artifacts successfully"
