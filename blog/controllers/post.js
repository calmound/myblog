var Post = require('../models/post');
var Tag = require('../models/tag');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');
var Promise = require('bluebird');
var markdown = require('markdown').markdown;

exports.post = function(req,res,next){
	res.render('postadd',{
		title:'发表文章',
		user:req.session.user,
		post:'',
		TagToString:TagToString
	});
}

exports.save = function(req,res,next){
	var _post = req.body.post;

	var newTagNames = _post.tag.split(',');//当前保存的文章的标签
	var saveTags = [];//需要保存的以前没有存储过的标签

	if(_post._id){//修改  
		Post.findOne({_id:_post._id}).populate('tags')
		.exec(function(err,post){
			
			if(err) console.log(err);
			
			(function delTag(count){//遍历文章原先的标签,找出删掉的标签，进行删除操作([a,b,c]=>[a,b],c是删掉的)
				var tagName = post.tags[count].name;
				
				//判断旧标签是否存在于新标签
				var index = newTagNames.indexOf(tagName);
				if(index != -1){
					saveTags.push(post.tags[count]._id);
					newTagNames[index] = '';//不能删除，删除导致数组顺序变化造成递归出现错误,所以置空
				}

				return new Promise(function(resolve,reject){
					if(index == -1){//旧标签不存在于新标签，删掉旧标签的文章id
						
						Tag.findOne({name:tagName})
						.exec(function(err,tag){
							if(err) console.log(err);
					
							//删除
							var index = tag.posts.indexOf(post._id);
							tag.posts.splice(index,1);	
						
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
						var addTagNames = [];//新标签和旧标签不同的部分，就是新添加的标签
						newTagNames.forEach(function(tag){
							if(tag != '') addTagNames.push(tag);
						});

						(function addTag(count){//循环新添加部分的标签
							//遇到删除所有标签的情况，并没有特例判断，而是让空也存进数据库中，是为了当没有标签的时候，post是没有tagId的
							//导致前端读name出错，所以将空也插入数据库，这种会给空插入一个name
							
							Tag.findOne({name:addTagNames[count]},function(err,tag){//查询要新建的标签数据库中是否存在
								if(err) console.log(err);	
								
								if(!tag){
									tag = new Tag({name:addTagNames[count]}); 
								}
								//新建的标签已经存储到数据库中了,只用更新文章id
								tag.posts.push(post._id);
								
								tag.save(function(err,tag){
									if(err) console.log(err);
									
									saveTags.push(tag._id);
									
									if(count < addTagNames.length - 1) addTag(count+1);
									else{
										post.tags = saveTags;
										post.save(function(err,post){
											if(err) console.log2(err);
											
											res.redirect('/post/' + post._id);
										});
									}
								});
							});
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
				
				Tag.findOne({name:newTagNames[count]})
				.exec(function(err,tmp_tag){
					
					if(err) console.log(err);
					
					var _tag;
					if(tmp_tag){//该分类数据库中存在
						tmp_tag.posts.push(post._id);
						_tag = tmp_tag;
					}else{
						_tag = new Tag({name:newTagNames[count]}); 
						_tag.posts.push(post._id);
					}
			
					_tag.save(function(err,tag){
						if(err) console.log(err);
						post.tags.push(tag._id);
						
						if(count != newTagNames.length - 1) saveTag(count+1);
						else{
							post.save(function(err,post){//保存tags
								if(err) console.log(err);
			
								Category.findOne({_id:post.category},function(err,category){
									if(err) console.log(err);
									
									category.posts.push(post._id);
									category.save(function(err,category){
										if(err) console.log(err);
										
										res.redirect('/post/' + post._id);
									});
								});
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