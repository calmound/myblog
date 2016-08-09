var express = require('express');
var _ = require('underscore');
var router = express.Router();
var User = require('../controllers/users');
var Post = require('../controllers/post');
var Index = require('../controllers/index');
var Comment = require('../controllers/comment');
var Tag = require('../controllers/tag');

/* GET home page. */
router.get('/', Index.index);

//登录
router.get('/login',function(req,res,next){
	res.render('login',{
		title:'登录',
		user:req.session.user
	});
});

router.post('/login',User.login);
//登出
router.get('/logout',User.logout);
//注册
router.get('/reg',function(req,res,next){
	res.render('reg',{
		title:'注册',
		user:req.session.user
	});
});
router.post('/reg',User.reg);

//转到发表文章
router.get('/post/add',Post.post);
//发表文章
router.post('/post/add',Post.save);
//获取谋篇文章
router.get('/post/:id',Post.getOne);
//获取某个用户的所有文章
router.get('/post/user/:id',Post.getAll);
//编辑文章
router.get('/post/edit/:id',Post.edit);
//删除文章
router.get('/post/delete/:id',Post.delete);



router.post('/comment/add',Comment.save);


router.get('/tag/add',Tag.tag);
router.post('/tag/add',Tag.save);
router.get('/tag/:id',Tag.postList);


module.exports = router;
