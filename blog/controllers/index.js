var Post = require('../models/post');
var Tag = require('../models/tag');
var _ = require('underscore');

exports.index = function(req, res, next) {
	Post.fetch(function(err,posts){
		if(err) console.log(err);
		
		Tag.fetch(function(err,tags){
			res.render('index', {
		  	title: '主页',
		  	user:req.session.user,
		  	posts:posts,
		  	tags:tags
		})
	  });
	});
} 