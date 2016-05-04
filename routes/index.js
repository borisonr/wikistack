var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.get("/", function(req, res){
	Page.findAll().then(function(pages){
		console.log("here",pages[0]);
		res.render('index', {Pages: pages});
	});
});


router.get("/add", function(req, res){
	res.render("addpage");
});


router.post("/", function(req, res, next){
	var body = req.body;
	
	console.log(body);
	var page = Page.build({
	    title: 	body.title,
	    content: body.content, 
	    status: body.status,
	    });

	page.save().then(function(result) {
		res.redirect(result.route).catch(next);
		// res.redirect("/");
		//return User.findByName(body.author)
	}).catch(console.error);

});

router.get("/:title", function(req, res, next){
	var title = req.params.title;
	Page.find({
		urlTitle: title
	}).then(function(page){
		res.render('wikipage', {page: page});}).catch(next);
	
})


module.exports = router;
