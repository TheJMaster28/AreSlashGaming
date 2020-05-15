// greenlock server code to get greenlock working
'use strict';

var app = require('./index.js');

app.get('/hello', function (req, res) {
    res.end('Hello, Encrypted World!');
});

require('greenlock-express')
    .init({
        packageRoot: __dirname,
        configDir: './greenlock.d',

        maintainerEmail: 'autogerg@gmail.com',

        cluster: false
    })

    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve(app);
