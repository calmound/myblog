var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	name:{
		type:String,
		unique: true
	},
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
	posts:[{type:Schema.Types.ObjectId,ref:'Post'}]
});

TagSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

TagSchema.statics = {
	fetch:function(cb){
		return this
				.find({})
				.exec(cb);
	}
}

module.exports = TagSchema;


