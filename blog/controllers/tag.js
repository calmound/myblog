var Tag = require('../models/tag');

exports.tag = function(req,res,next){
	res.render('tag',{
		title:'新增标签',
		user:req.session.user
	});
}

exports.save = function(req,res,next){
	var _tag = req.body.tag;
	var tag = new Tag(_tag);

	tag.save(function(err,tag){
		if(err) console.log(err);
		
		res.redirect('/');
	});
}

exports.postList = function(req,res,next){
	var id = req.params.id;
	
	Tag
		.findOne({_id:id})
		.populate('posts')
		.exec(function(err,tag){
			res.render('postlist',{
				title:'文章列表',
				posts:tag.posts,
				user:req.session.user
			})
		})
}
