var Post = require('../models/post');
var Comment = require('../models/comment');
var _ = require('underscore');

exports.post = function(req,res,next){
	res.render('postadd',{
		title:'发表文章',
		user:req.session.user,
		post:''
	});
}

exports.save = function(req,res,next){
	var _post = req.body.post;

	if(_post._id){//修改
		Post.findById(_post._id,function(err,post){
			if(err) console.log(err);

			post = _.extend(post,_post);
			
			post.save(function(err,post){
				if(err) console.log(err);
				
				res.redirect('/post/' + post._id);
			});
		});
	}else{

		var post = new Post(_post);
		post.author = req.session.user;

		post.save(function(err,post){
			if(err) console.log(err);
			res.redirect('/post/' + post._id);
		});
	}
}

exports.getOne = function(req,res,next){
	// id date title
	var id = req.params.id;

	Post
	.findOne({_id:id})
	.populate('author')
	.exec(function(err,post){
		if(err) console.log(err);
		
		Comment
		.find({post:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			res.render('postdetail',{
				title:'文章详情',
				post:post,
				comments:comments,
				user:req.session.user
			});
		});		
	});
}

exports.getAll = function(req,res,next){
	var id = req.params.id;
	Post.find({'author':id},function(err,posts){  console.log(posts);
		if(err) console.log(err);
		
		res.render('postlist',{
			user:req.session.user,
			title:'文章列表',
			posts:posts
		});
	});
}

exports.edit = function(req,res,next){
	var id = req.params.id;
	Post.findOne({_id:id},function(err,post){
		if(err) console.log(err);
		
		res.render('postadd',{
			title:'编辑文章',
			user:req.session.user,
			post:post
		});
	});
}

exports.delete = function(req,res,next){
	var id = req.params.id;
	
	if(id){
		Post.remove({_id:id},function(err,post){
			if(err) console.log(err);
			
			res.redirect('/');
		})
	}
}

