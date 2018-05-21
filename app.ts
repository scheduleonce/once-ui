const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const port = process.env.PORT || 3000;

app.get('/test', (req, res) => {
  res.status(200).send('Hello');
});

app.use(
  basicAuth({
    users: { app: '#Udaan@SO!23' },
    challenge: true
  })
);

app.use(express.static('storybook-static'));

app.listen(port, () => console.log('Started listening to port', port));
