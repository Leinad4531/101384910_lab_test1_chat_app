const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstname: String,
    lastname: String,
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
