#!/bin/sh
set -e

node package-deploy/npm-login.js $(cat "/etc/npm-cred/NPM_AUTH_TOKEN")
npm whoami
npm i
chown root:root . && npm run package
filename="$(npm pack --dry-run | tail -n 1)"
echo "$1"

if [[ "$1" == "qa" ]] || [[ "$1" == "master" ]] || [[ "$1" == "staging" ]] || [[ "$1" == "staging-app2" ]]
then
  npm publish dist/ui/$filename --registry=https://registry.npmjs.org/
else
  npm publish --tag beta dist/ui/$filename --registry=https://registry.npmjs.org/
fi

echo "$filename package pushed to NPM successfully"
