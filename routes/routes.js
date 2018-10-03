const User = require('../models/user-model');

const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();

router.get('/users', isLoggedIn, (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

//----- Authorization Routes -----
router.get('/login', (req, res) => {
    res.sendFile(path.resolve("./static/html/login.html"));
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    if(req.session.redirectTo) {
        res.redirect(req.session.redirectTo);
    } else {
        res.redirect("/protected");
    }
});
//--------------------------------

//----- App Routes -----
router.get('/protected', isLoggedIn, (req, res) => {
    res.send("You are " + req.user.username + ".");
});

router.get('/updateEli', [isLoggedIn, isAdmin], (req, res) => {
    User.findOneAndUpdate({username: "Eli Benevedes"}, {userLevel: 1}, (err, doc) => {
        if (err) return res.send(500, { error: err });
        return res.send("Elevated Eli.");
    });
});

router.get('/admin', [isLoggedIn, isAdmin], (req, res) => {
    res.sendFile(path.resolve("./static/html/admin.html"));
});
//----------------------

//----- Error Routes -----
//Keep this one LAST, ALWAYS
router.get("*", (req, res) => {
    res.status(404);
    res.send("This is a 404!");
});
//------------------------

//----- Authentication Middleware -----
function isAdmin(req, res, next) {
    if(req.user.userLevel >= 1) {
        next();
    } else {
        res.status(403);
        res.send("Error: You are not an admin.");
    }
}

function isLoggedIn(req, res, next) {
    if(req.user) {
        next();
    } else {
        req.session.redirectTo = req.path;
        res.redirect('/login');
    }
}
//-------------------------------------

module.exports = router;
