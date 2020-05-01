const express = require('express');
const app = express();
const mongoose = require('mongoose');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = 3000;

/* google OAuth set up */
const googleConfig = require('./OAuth/config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('./models/user');

app.use(express.static('public'));

/* passport set up */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

io.on('connection', function (socket) {
    console.log('a user has connected');
    io.emit('hello_world');

    socket.on('login', function () {
        console.log('a user wants to login');
        var googleStrategy = new GoogleStrategy(
            {
                clientID: googleConfig.googleKey,
                clientSecret: googleConfig.googleSecret,
                callbackURL: 'http://localhost:3000'
            },
            function (accessToken, refreshToken, profile, done) {
                googleUser.googleId = profile.id;
                googleUser.googleProfile = profile;
                googleUser.googleAccessToken = accessToken;
            }
        );

        passport.use(googleStrategy);

        //authenticate user through google redirect
        app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile'] }));
    });

    socket.on('create post', function () {
        console.log('user wants to create post');
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + 'public/index.html');
});

http.listen(port, function () {
    console.log(`listening on port ${port}`);
});
