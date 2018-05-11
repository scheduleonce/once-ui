const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
app.use(express.static('storybook-static'));

if(app.get('env') === 'production') {
    app.use(basicAuth({
        users: {
            'app': '#Udaan@SO!23'
        },
        challenge: true
    }));
}
app.listen(3000, () => console.log('Started listening to port:3000'));