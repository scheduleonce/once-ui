const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const env = app.get('env');
const port = process.env.port || 3000;

// If env is production load static html with auth
if(env === 'production') {
    app.use(basicAuth({
        users: {'app': '#Udaan@SO!23'},
        challenge: true
    }));
    app.use(express.static('storybook-static'));
}
// If env is development load static html without auth
if(env === 'development') {
    app.use(express.static('storybook-static'));
}

app.listen(port, (ee) => console.log('Started listening to port:3000'));