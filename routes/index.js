var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 
var Promise = require('bluebird');


router.get("/", function(req, res){
	Page.findAll().then(function(pages){
		res.render('index', {Pages: pages});
	});
});

router.get ("/tag/:tag", function(req, res){
	Page.findByTag(req.params.tag)
	.then(function(pages){
		console.log("findbypage)", pages);
		res.render('searchByTag', {tag:req.params.tag, Pages: pages});
	});
});

router.get("/users", function(req, res){
	User.findAll().then(function(users){
		res.render('users', {Users: users});
	});

});
router.get("/users/:id", function(req, res, next){
	var userPromise = User.findById(req.params.id);
  	var pagesPromise = Page.findAll({
	    where: {
	      authorId: req.params.id
	    }
  	});
  	
  	Promise.all([
	    userPromise, 
	    pagesPromise
  	])
	.then(function(values){
		var user = values[0];
    	var pages = values[1];
    	console.log("here", pages, user);
    	res.render('user', { user: user, pages: pages});
	})
	.catch(next);
});

router.get("/add", function(req, res){
	res.render("addpage");
});


router.post("/", function(req, res, next){
	var body = req.body;
	User.findOrCreate({
		where: {
		    name: body.author,
		    email: body.email
		  }
		})
		.then(function(values){
			var user = values[0];
			var page = Page.build({
			    title: 	body.title,
			    content: body.content, 
			    status: body.status,
			    tags: body.tags.split(" ")
			});
			return page.save().then(function(result) {
				 return page.setAuthor(user);
			});
		})
		.then(function(page){
			res.redirect(page.route);
		}).catch(next);	

});

router.get("/:title", function(req, res, next){
	var title = req.params.title;
	Page.findOne({
		where: { 
			urlTitle: title 
		},
	    include: [
	        { model: User, as: 'author'}
	    ]
	}).then(function(page){
		res.render('wikipage', {page: page});
	}).catch(next);
});

router.get("/similar/:id/", function(req, res, next){
	//this.tags
	Page.findOne({
		where: {
			id: req.params.id
		}
	}).then(function(page){
		page.findSimilar().then(function(result){
			res.render('searchByTag', {tag:'Similar', Pages: result});
		});
	});
});


module.exports = router;
