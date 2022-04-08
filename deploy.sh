#!/bin/sh
set -e

node package-deploy/npm-login.js $(cat "/etc/npm-cred/NPM_AUTH_TOKEN")
npm whoami
npm i
npm run package
filename="$(npm pack --dry-run | tail -n 1)"
npm publish dist/ui/$filename --registry=https://registry.npmjs.org/

echo "$filename package pushed to NPM successfully"