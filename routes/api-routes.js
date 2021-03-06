const express = require('express');
const path = require('path');
const router = express.Router();

const User = require('../models/user-model.js');

router.get('/accounts/users', auth.isAdmin, (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

router.get('/accounts/users/:user', auth.isAdmin, (req, res) => {
    var user = req.param.user;
    User.find({username: user}, (err, users) => {
        res.json(users[0]);
    });
});

//Getting/putting user is by
router.put('/accounts/users/:user', auth.isAdmin, (req, res) => {
    var user = req.param.user;
    //User.find()
});

module.exports = router;
