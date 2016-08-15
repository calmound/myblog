var Category = require('../models/category');
var Post = require('../models/post');
var Tag = require('../models/tag');

exports.save = function(req,res,next){
	var categoryNames = ['编程','绘画','随笔','金融','其他'];
	var categories = [];
	
	for(var i = 0;i<5;i++){
		categories[i] = new Category({_id:i,name:categoryNames[i]});
	}

	(function saveCategory(count){
		categories[count].save(function(err,category){
			if(err) console.log(err);
			
			if(count < 4)  saveCategory(count+1);
			else res.redirect('/');
		});
	})(0);
}

exports.postList = function(req,res,next){
	var id = req.params.id;	console.log(1);	
	Post.find({category:id})
	.exec(function(err,posts){
		if(err) console.log(err);
		
		Tag.fetch(function(err,tags){
			if(err) console.log(err);
		
			res.render('index',{
				title: '列表页',
			  	user:req.session.user,
			  	posts:posts,
			  	tags:tags
			});
		});
	});
}
