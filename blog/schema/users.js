var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	name:String,
	password:String,
	age:Number,
	email:String,
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
});

UserSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	
	var that = this;
	bcrypt.genSalt(10,function(err,salt){
		if(err) console.log(err);
			
		bcrypt.hash(that.password,salt,null,function(err,hash){
			that.password = hash;
		
			next();
		});
	});
})

module.exports = UserSchema;
