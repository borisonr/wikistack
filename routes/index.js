var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.get("/", function(req, res){
	res.redirect("/");
});


router.get("/add", function(req, res){
	res.render("addpage");
});


router.post("/", function(req, res){
	var body = req.body;
	
	console.log(body);
	var page = Page.build({
	    title: 	body.title,
	    content: body.content, 
	    status: body.status,
	    });
	
	page.save().then(function() {
		res.redirect("/");
		//return User.findByName(body.author)
	});

});


module.exports = router;
