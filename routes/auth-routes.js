const User = require('../models/user-model');

const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();

//----- Authorization Routes -----
router.get('/login', (req, res) => {
    res.sendFile(path.resolve("./static/html/login.html"));
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    if(req.session.redirectTo) {
        res.redirect(req.session.redirectTo);
    } else {
        res.redirect("/protected");
    }
});
//--------------------------------

module.exports = router;
