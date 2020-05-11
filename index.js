const express = require('express');
const app = express();
const mongoose = require('mongoose');
var https = require('https').createServer({
    key: require('fs').readFileSync('./privkey.pem'),
    cert: require('fs').readFileSync('./fullchain.pem')
}, app);
var io = require('socket.io')(https);
var port = 443;

/* EJS */
app.set('view engine', 'ejs');

/* google OAuth set up */
const googleConfig = require('./OAuth/config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/* mongoose set up */
mongoose
    .connect('mongodb+srv://Gerg:getrekt@webusers-5lz1h.mongodb.net/GetRekt?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => console.log('Connection Error: ' + error));
mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: ' + err.message);
    console.error('Make sure a mongoDB server is running and accessible by this application');
});

var User = require('./models/user');
var Clip = require('./models/clip');
var UserModel;

app.use(express.static('public'));

/* passport set up */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
    User.findById(userId, (err, user) => done(err, user));
});

io.on('connection', function (socket) {
    console.log('a user has connected');
    io.emit('hello_world');

    /* google login */
    socket.on('googleLogin', function () {
        console.log('a user wants to login');
        var googleStrategy = new GoogleStrategy(
            {
                clientID: googleConfig.googleKey,
                clientSecret: googleConfig.googleSecret,
                /* Switch callbackURL to localhost for direct local testing,
                 *  after testing, switch callbackURL back to gamergetrekt.com then
                 *  push your updated code for Jeff to pull
                 */
                //callbackURL: 'http://localhost:3000/auth/google/callback'
                callbackURL: "https://gamergetrekt.com/auth/google/callback"
            },
            function (accessToken, refreshToken, profile, done) {
                // find or create user from the database based on googleId and google display name
                User.findOrCreate({ googleId: profile.id }, function (err, user) {
                    console.log('finding user...');
                    if (!err) {
                        //save google profile and access token to the user.js object
                        user.googleProfile = profile;
                        user.googleAccessToken = accessToken;
                        user.save(function (err) {
                            done(err, user);
                            console.log('Saved user profile to database' + user);
                            UserModel = user;
                        });
                    } else {
                        done(err, user);
                    }
                });
            }
        );
        passport.use(googleStrategy);
    });

    socket.on('post clip', function (msg) {
        console.log('a user is posting a clip link');
        Clip.findOrCreate({ url: msg }, function (err, clip) {
            console.log('looking for url...');
            if (!err) {
                var date = new Date();
                clip.postTime = date;
<<<<<<< HEAD
=======
                clip.user = UserModel.googleProfile.displayName;
>>>>>>> origin/master
                clip.save(function (err) {
                    console.log('Saved clip link to database' + clip);
                });
            }
        });
<<<<<<< HEAD
    });

    socket.on('create post', function (data) {
        console.log(data);
        console.log('user wants to create post');
    });

    socket.on('request profile page', function () {
        console.log('a user wants to request their profile');
        socket.emit('sending user profile', { data: 'Profile' });
=======
>>>>>>> origin/master
    });

    socket.on('request posts', function () {
        console.log('a user wants to see posts');
<<<<<<< HEAD
        Clip.find().lean().exec(function (err, clips) {
            var query = JSON.stringify(clips);
            console.log(query)
            console.log('sending requested posts');
            socket.emit('receive posts', query);
        });
=======
        Clip.find()
            .lean()
            .exec(function (err, clips) {
                var query = JSON.stringify(clips);
                console.log(query);
                console.log('sending requested posts');
                socket.emit('receive posts', query);
            });
>>>>>>> origin/master
    });
});

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + 'public/index.html');
// });

//authenticate user through google redirect
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google' }), function (req, res) {
    res.redirect('/');
});

<<<<<<< HEAD
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google' }),
    function (req, res) {
        res.redirect('/profile');
    });

app.get("/profile", function (req, res) {
    res.render('profile.ejs', { user: UserModel });
    console.log("REQUEST USER: " + UserModel);
=======
app.get('/profile', function (req, res) {
    res.render('profile.ejs', { user: UserModel });
    console.log('REQUEST USER: ' + UserModel);
});

app.get('/', function (req, res) {
    res.render('index.ejs', { user: UserModel });
    console.log('REQUEST USER: ' + UserModel);
>>>>>>> origin/master
});

https.listen(port, function () {
    console.log(`listening on port ${port}`);
});

module.exports = app;
