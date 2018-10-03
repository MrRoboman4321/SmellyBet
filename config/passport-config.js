const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/user-model');
const fs = require('fs');

google_creds = JSON.parse(fs.readFileSync("./credentials/GOOGLE_AUTH_CREDS.json"));

//----- User Serialization -----
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
//------------------------------

//----- Passport Strategies -----
passport.use(
    new GoogleStrategy({
        clientID: google_creds.clientID,
        clientSecret: google_creds.clientSecret,
        callbackURL: "/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        //Find the user that is authenticating
        User.findOne({googleId: profile.id}).then((currentUser) => {
            //If they exist, then deserialize them
            if(currentUser) {
                done(null, currentUser);
            } else {
                //Otherwise, create them and serialize them.
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    balance: 100,
                    userLevel: 0
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });
    })
);
//-------------------------------
