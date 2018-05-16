const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const port = process.env.PORT || 3000;

// If env is production load static html with auth
if (process.env.NODE_ENV === 'production') {
  app.use(
    basicAuth({
      users: { app: '#Udaan@SO!23' },
      challenge: true
    })
  );
}

app.use(express.static('storybook-static'));

app.get('/test', (req, res) => {
  res.status(200).send('Hello');
});

app.listen(port, () => console.log('Started listening to port', port));
