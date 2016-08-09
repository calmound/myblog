var Post = require('../models/post');
var Comment = require('../models/comment');
var _ = require('underscore');
var Promise = require('bluebird');
var Tag = require('../models/tag');
var markdown = require('markdown').markdown;
	
exports.post = function(req,res,next){
	res.render('postadd',{
		title:'发表文章',
		user:req.session.user,
		post:''
	});
}

exports.save = function(req,res,next){
	var _post = req.body.post;

	var arr = _post.tag.split(',');
	var postc = new Post(_post);
	var tags = [];
	var post;
	
	return new Promise(function(resolve,reject){
		arr.forEach(function(data){
			var tag = new Tag({name:data}); console.log(tag);
			tags.push(tag);
			postc.tags.push(tag);
			resolve(postc);
		});
	})
	.then(function(){
		if(_post._id){//修改
			Post.findById(_post._id,function(err,post){
				if(err) console.log(err);
				post = _.extend(post,_post);
				post = _.extend(post,postc);
			});
		}else{
			post = new Post(_post);
			post.author = req.session.user; 
			
			post.tags = postc.tags; console.log(postc);
		}
	})
	.then(function(){

		post.save(function(err,post){
			if(err) console.log(err);
			var id = post._id; 
			
			tags.forEach(function(tag){
				var _tag;
				var name = tag.name;
				
				Tag
				.findOne({name:name})
				.exec(function(err,tmp_tag){ 
					if(err) console.log(err);
							
					if(tmp_tag){//该分类数据库中存在
						tmp_tag.posts.push(post._id);
						_tag = tmp_tag;
					}else{
						tag.posts.push(post._id);
						_tag = _.extend(tag,tmp_tag);
					}
					
					_tag.save(function(err,data){
						if(err) console.log(err);	
					});
				});
			});
		});
	})
	.then(function(){
		res.redirect('/post/' + post._id);
	})
}

exports.getOne = function(req,res,next){
	// id date title
	var id = req.params.id;

	Post
	.findOne({_id:id})
	.populate('author')
	.exec(function(err,post){
		if(err) console.log(err); 
		post.content = markdown.toHTML(post.content);

		Comment
		.find({post:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			

			
			res.render('postdetail',{
				title:'文章详情',
				post:post,
				comments:comments,
				user:req.session.user,
			});

		});		
	});
}

exports.getAll = function(req,res,next){
	var id = req.params.id;
	Post.find({'author':id},function(err,posts){
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
	Post
		.findOne({_id:id})
		.populate('tags')
		.exec(function(err,post){
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
		});
	}
}

