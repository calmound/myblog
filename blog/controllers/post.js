var Post = require('../models/post');
var Comment = require('../models/comment');
var _ = require('underscore');
var Promise = require('bluebird');
var Tag = require('../models/tag');
var markdown = require('markdown').markdown;
var async = require('async');	
var Array = require('node-array');

exports.post = function(req,res,next){
	res.render('postadd',{
		title:'发表文章',
		user:req.session.user,
		post:'',
		TagToString:TagToString
	});
}

//判断修改文章的标签是否以前就存在文章里面
//true表明存在
function isExist(tag,tags){
	tags.forEach(function(tmp_tag){
		if(tag.name == tmp_tag.name){
			return false;
		}
	});
	return true;
}

//保存文章标签
function tagsSave(tags,post,res){
	
}

exports.save = function(req,res,next){
	var _post = req.body.post;

	var newTagsName = _post.tag.split(',');//当前保存的文章的标签
	var saveTags = [];
	var postc = new Post(_post);
	var tags = [];
	var oPost ;
	var id;

	if(_post._id){//修改  
		Post.
		findOne({_id:_post._id})
		.populate('tags')
		.exec(function(err,post){
			var postTags = post.tags;//未修改前文章的标签
			
			if(err) console.log(err);
			
			(function delTag(count){//循环post.tags
				var tagName = post.tags[count].name;
				
				var flag = true;
				for(var i = 0;i<newTagsName.length;i++){
					if(tagName == newTagsName[i]) {
						saveTags.push(post.tags[count]._id);//原先存在，修改后还存在的标签的ObjectId
						
						flag = false;
					 	newTagsName[i] = '';
					}
				}
				
				return new Promise(function(resolve,reject){
					if(flag){//表明文章原先的标签被删除了,把该标签集合里面的文章序列删掉
						
						Tag
						.findOne({name:tagName})
						.exec(function(err,tag){
							if(err) console.log(err);
					
							var index2 = tag.posts.indexOf(post._id);
							tag.posts.splice(index2,1);	
							
							tag.save(function(err,tag){
								if(err) console.log(err);
								resolve();
							});
						});
					}else{
						resolve();
					}
				})
				.then(function(){
					if(count < post.tags.length - 1) delTag(count + 1);//进入下一个
					else{	
						var aTags = [];
						newTagsName.forEach(function(tag){
							if(tag != '') aTags.push(tag);
						});
	
						(function addTag(count){
		
							var tag = new Tag({name:aTags[count]}); 
							tag.posts.push(post._id);
		
							tag.save(function(err,tag){
								if(err) console.log(err);
								
								saveTags.push(tag._id);
								
								if(count < aTags.length - 1) addTag(count+1);
								else{
									post.tags = saveTags;
									post.save(function(err,post){
										if(err) console.log2(err);
										
										res.redirect('/post/' + post._id);
									})
								}
							})
						})(0);
					}
				})
			})(0);
		});
	}else{//新建
		var post = new Post(_post);
		post.author = req.session.user; 
				
		post.save(function(err,post){//这次保存是为了得到_id
			if(err) console.log(err);
			
			(function saveTag(count){
				
				Tag.findOne({name:newTagsName[count]})
				.exec(function(err,tmp_tag){ 
					
					if(err) console.log(err);
					
					var _tag;
					if(tmp_tag){//该分类数据库中存在
						tmp_tag.posts.push(post._id);
						_tag = tmp_tag;
					}else{
						_tag = new Tag({name:newTagsName[count]}); 
						_tag.posts.push(post._id);
					}
			
					_tag.save(function(err,tag){
						if(err) console.log(err);
						post.tags.push(tag._id);
						
						if(count != newTagsName.length - 1) saveTag(count+1);
						else{
							post.save(function(err,post){//保存tags
								if(err) console.log(err);
								res.redirect('/post/' + post._id);
							});
						}
					});
				});
			})(0);
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
		console.log(post);	
			res.render('postadd',{
				title:'编辑文章',
				user:req.session.user,
				post:post,
				TagToString:TagToString
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

function TagToString(tags){
	if(!tags) return ;

	var sTags = tags[0].name;
	
	for(var i = 1 ;i < tags.length;i++){
		sTags += ',' + tags[i].name;
	}

	return sTags;
}