set -e

node package-deploy/azure-login.js $(cat "/etc/azure-artifact-cred/AZURE-ARTIFACT-AUTH-TOKEN")

npm i
npm config list

if [[ "$1" == "qa" ]] || [[ "$1" == "master" ]] || [[ "$1" == "staging" ]] || [[ "$1" == "staging-app2" ]]
then
  npm publish --registry=https://pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/
else
  npm publish --tag beta --registry=https://pkgs.dev.azure.com/oncehub/pkg/_packaging/node_package/npm/registry/
fi

echo "Package pushed to Azure successfully"