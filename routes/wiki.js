var express = require('express');
var router = express.Router();
var models = require('../models/');

var Page = models.Page;
var User = models.User;
router.get('/search', function (req, res, next) {
	Page.findByTag(req.query.tag)
	.then(function(results) {
		res.render('index', {pages: results});
	})
});


router.get('/add', function(req, res){
  res.render('addpage');
});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({ urlTitle: req.params.urlTitle }).populate("author").exec().then(function(foundPage){
    	console.log(foundPage);
    	console.log("author:", foundPage.author);
    	
    	res.render('wikipage', {
				title: foundPage.title, 
				author: foundPage.author,
				content: foundPage.content,
				tags: foundPage.tags.join(", ")
			})
    //res.json(foundPage);
  }).catch(next); // assuming you replaced mpromise
});


router.get('/', function(req, res){
  res.redirect('/');
});

router.post('/', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var title = req.body.title;
	var content = req.body.content;
	var status = req.body.status;
	var tags = req.body.tags.split(" ");
	var user = new User({name: name, email: email});
	var page = new Page({
		title: title,
		content: content,
		status: status,
		tags: tags,
		author: user
	});
	page.save()
	.then(function() {
		return user.save();
	})
		.then(function(){
			res.redirect('/');
		}, function(err){
			console.log(err);
		})
	//res.json(req.body);
});



module.exports = router;