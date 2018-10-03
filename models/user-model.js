const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//User model. Stores login data, as well as bet data.
const userSchema = new Schema({
    username: String,
    googleId: String,
    balance: Number,
    userLevel: Number
});

const User = mongoose.model('user', userSchema);

module.exports = User;
