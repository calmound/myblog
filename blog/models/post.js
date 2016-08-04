var mongoose = require('mongoose');
var PostSchema = require('../schema/post');
var Post = mongoose.model('Post',PostSchema);

module.exports = Post;
