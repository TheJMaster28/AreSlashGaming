const express = require('express');
const app = express();
const mongoose = require('mongoose');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = 3000;


/* google OAuth set up */
const googleConfig = require('./OAuth/config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/* mongoose set up */
mongoose.connect('mongodb+srv://Gerg:getrekt@webusers-5lz1h.mongodb.net/GetRekt?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).catch(error => console.log("Connection Error: " + error));
mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: ' + err.message);
    console.error('Make sure a mongoDB server is running and accessible by this application')
  });
var User = require('./models/user');

app.use(express.static('public'));

/* passport set up */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
    User.findById(userId, (err, user) => done(err, user));
});

io.on('connection', function (socket) {
    console.log('a user has connected');
    io.emit('hello_world');

    /* google login */
    socket.on('googleLogin', function () {
        console.log('a user wants to login');
        var googleStrategy = new GoogleStrategy({
            clientID: googleConfig.googleKey,
            clientSecret: googleConfig.googleSecret,
            /* Switch callbackURL to localhost for direct local testing,
            *  after testing, switch callbackURL back to gamergetrekt.com then
            *  push your updated code for Jeff to pull
            */
            callbackURL: "http://localhost:3000/auth/google/callback"
            //callbackURL: "http://gamergetrekt.com:3000" 
        }, function (accessToken, refreshToken, profile, done) {
            // find or create user from the database based on googleId and google display name
            User.findOrCreate({googleId: profile.id}, function(err ,user){
                console.log("finding user...");
                if(!err){
                    //save google profile and access token to the user.js object
                    user.googleProfile = profile;
                    user.googleAccessToken = accessToken;
                    user.save(function(err){
                        done(err, user);
                        console.log("Saved user profile to database" + user);
                    });
                } else {
                   done(err, user); 
                }
            });
        });
        
        passport.use(googleStrategy);

    });

    socket.on('create post', function (data) {
        console.log(data);
        console.log('user wants to create post');
    });

    socket.on('request profile page', function () {
        console.log('a user wants to request their profile');
        socket.emit('sending user profile', { data: 'Profile' });
    });
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + 'public/index.html');
});

//authenticate user through google redirect
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/google'}),
    function(req, res){
        res.redirect('/');
    });

http.listen(port, function () {
    console.log(`listening on port ${port}`);
});
