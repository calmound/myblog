var mongoose = require('mongoose');
var UserSchema = require('../schema/users');
var User = mongoose.model('User',UserSchema);

module.exports = User;
