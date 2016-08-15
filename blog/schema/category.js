var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name:{
		type:String
	},
	_id:{
		type:Number,
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

CategorySchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

CategorySchema.statics = {
	fetch:function(cb){
		return this.find({}).sort('_id').exec(cb);
	}
}

module.exports = CategorySchema;


