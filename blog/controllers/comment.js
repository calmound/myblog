var Comment = require('../models/comment');

exports.save = function(req,res,next){
	var _comment = req.body.comment;
	var postId = _comment.post;
	var comment = new Comment(_comment);
	
	comment.from = req.session.user;

	if(_comment.cid){//回复某人的评论
		Comment.findById(_comment.cid,function(err,comment){
			if(err) console.log(err);
			
			var reply = {
				from:req.session.user,
				to:_comment.tid,
				content:_comment.content
			};
			
			comment.reply.push(reply);
			
			comment.save(function(err,comment){
				if(err) console.log(err);
				
				res.redirect('/post/' + postId);
			});
		});
	}else{
		comment.save(function(err,comment){
			if(err) console.log(err);
			
			res.redirect('/post/' + postId);
		});
	}
	
}

