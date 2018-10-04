const User = require('../models/user-model');
const auth = require('./auth-middleware.js');

const express = require('express');
const path = require('path');
const router = express.Router();



//----- App Routes -----
router.get('/protected', auth.isLoggedIn, (req, res) => {
    res.send("You are " + req.user.username + ".");
});

router.get('/updateEli', auth.isAdmin, (req, res) => {
    User.findOneAndUpdate({username: "Rose Kirby"}, {userLevel: 1}, (err, doc) => {
        if (err) return res.send(500, { error: err });
        return res.send("Elevated Eli.");
    });
});

router.get('/admin', auth.isAdmin, (req, res) => {
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

module.exports = router;
