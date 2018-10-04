const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/users', auth.isLoggedIn, (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

module.exports = router;
