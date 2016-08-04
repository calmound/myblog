var User = require('../models/users');
var bcrypt = require('bcrypt-nodejs');

exports.reg = function(req,res,next){
	var _user = req.body.user;
	if(_user.password !== _user.repassword){ 
		req.flash('error','两次输入的额密码不一致');
		return res.redirect('/reg');
	}
	
	var user = new User(_user);
	
	user.save(function(err,user){
		if(err) console.log(err);
		
		req.session.user = user;
		res.redirect('/');
	})
}

exports.login = function(req,res,next){//这里不要写User
	var _user = req.body.user;
	var password = _user.password;

	User.findOne({name:_user.name},function(err,user){
		if(err) console.log(err);

		if(user){
			bcrypt.compare(password,user.password,function(err,isMatch){
				if(err) console.log(err);
				if(isMatch){
					req.session.user = user;
					res.redirect('/');
				}else{
					console.log('密码不匹配');
				}
			});
		}
	});
}

exports.logout = function(req,res,next){
	delete req.session.user;
	res.redirect('/');
}

exports.post = function(req,res,next){
	var post = req.body.post;
	
}
