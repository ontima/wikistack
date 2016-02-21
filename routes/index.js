var express = require('express');
var router = express.Router();
var models = require('../models/');

var Page = models.Page;
var User = models.User;

router.get('/', function(req, res){
	Page.find({}).populate("author").exec()
	.then(function(pages) {
		console.log("title", pages[0].route);
		res.render('index', {pages: pages});
	})
	//res.render('index', {});
})

module.exports = router;



