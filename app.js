const passportConfig = require('./config/passport-config');
const User = require('./models/user-model.js');

const publicRouter = require('./routes/public-routes');
const apiRouter = require('./routes/api-routes');
const authRouter = require('./routes/auth-routes');

const rateLimit = require('express-rate-limit');

const cookieSession = require('cookie-session');
const bParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const fs = require('fs');

var app = express();

const config = require('./config/config');
const port = process.env.PORT || 1983;
const env = config.env
const dbURI = config.dbURI;

app.set('port', port);
app.set('env', env);

const sessionKey = JSON.parse(fs.readFileSync("./credentials/session.json")).cookieKey;
app.use(cookieSession({
    maxAge: 24*60*60*1000, //One day
    keys: [sessionKey]
}));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(dbURI);
const db = mongoose.connection;

//----- DB Event Messages -----
db.on('error', (err) => {
    console.error("DB connection error");
    return console.error(err.message);
});

db.once('connected', () => {
    User.find({}, (err, users) => {
        console.log(users);
    });
    return console.log("Successfully connected to " + dbURI);
});

db.once('disconnected', () => {
    return console.error("Successfully disconnected from " + dbURI);
});;
//-----------------------------

app.use(logger('dev'));
app.use(bParser.json());
app.use(bParser.urlencoded({extended: true}));

app.use(express.static("static"));

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1 // limit each IP to 1 request per windowMs
});

app.use('/api', [apiRouter, limiter]);
app.use('/auth', authRouter);
app.use('/', publicRouter); //KEEP LAST

app.listen(port);

module.exports = app;
