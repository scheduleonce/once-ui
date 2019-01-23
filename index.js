const express = require('express');

const app = express();

app.use(express.static('storybook-static'));

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Storybook server listening on port', port);
