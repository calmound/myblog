var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema =new Schema({
	title:String,
	author:{type:Schema.Types.ObjectId,ref:'User'},
	content:String,
	tags:[{type:Schema.Types.ObjectId,ref:'Tag'}],
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		},
		date:{
			type:String,
			default:Date.now()
		}
	}
});

PostSchema.pre('save',function(next){
	if(this.isNew){ 
		this.meta.createAt = this.meta.updateAt = this.date = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})


PostSchema.statics = {
	fetch:function(cb){
		return this.find({})
			   	.populate('author')
				.sort('meta.updateAt')
				.exec(cb);
	}
}

module.exports = PostSchema;