var express = require('express');
var _ = require('underscore');
var router = express.Router();
var User = require('../controllers/users');
var Post = require('../controllers/post');
var Index = require('../controllers/index');
var Comment = require('../controllers/comment');
var Tag = require('../controllers/tag');
var Category = require('../controllers/category');

/* GET home page. */
router.get('/', Index.index);


router.get('/login',function(req,res,next){//登录
	res.render('login',{
		title:'登录',
		user:req.session.user
	});
});
router.post('/login',User.login);
router.get('/logout',User.logout);//登出
router.get('/reg',function(req,res,next){//注册
	res.render('reg',{
		title:'注册',
		user:req.session.user
	});
});
router.post('/reg',User.reg);


router.get('/post/add',Post.post);//转到发表文章
router.post('/post/add',Post.save);//发表文章
router.get('/post/:id',Post.getOne);//获取谋篇文章
router.get('/post/user/:id',Post.getAll);//获取某个用户的所有文章
router.get('/post/edit/:id',Post.edit);//编辑文章
router.get('/post/delete/:id',Post.delete);//删除文章


router.post('/comment/add',Comment.save);


router.get('/tag/add',Tag.tag);
router.post('/tag/add',Tag.save);
router.get('/tag/:id',Tag.postList);


router.get('/category/save',Category.save);
router.get('/category/:id',Category.postList);


module.exports = router;
