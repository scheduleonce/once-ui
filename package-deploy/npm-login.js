let fs = require('fs');
let path = require('path');

let token = '';

process.argv.forEach(function(val, index, array) {
  if (index == 2) token = val;
});

let registry = '//registry.npmjs.org/';

var configPath = configPath ? configPath : path.join(__dirname, '../', '.npmrc');

fs.writeFile(configPath, `${registry}:_authToken=${token}` + '\n', (err, message) => { if(err){ console.log(err , message)}});