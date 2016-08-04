var Post = require('../models/post');
var _ = require('underscore');
exports.index = function(req, res, next) {
	Post.fetch(function(err,posts){
		res.render('index', {
	  	title: '主页',
	  	user:req.session.user,
	  	posts:posts
	  });
	});
} 