var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	content:String,
	from:{type:Schema.Types.ObjectId,ref:'User'},//谁评论的
	reply:[{//回复
		from:{type:Schema.Types.ObjectId,ref:'User'},//给谁评论
		to:{type:Schema.Types.ObjectId,ref:'User'},//给谁评论
		content:String
	}],
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	},
	post:{type:Schema.Types.ObjectId,ref:'Post'}
});

CommentSchema.pre('save',function(next){
	if(this.isNew)
		this.meta.createAt = this.meta.updateAt = Date.now();
	else
		this.meta.updateAt = Date.now();
		
	next();
});

CommentSchema.statics = {
	fetch:function(){
		return this
				.find({})
				.sort('meta.createAt')
				.exec(cb);
	}
}

module.exports = CommentSchema;