var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');



var Page = db.define('Page',{
	title: {type: Sequelize.STRING,
			allowNull: false},
	urlTitle: {type: Sequelize.STRING,
			allowNull: false,
			isUrl: true},
	content: { type: Sequelize.TEXT,
			allowNull: false},
	date: { type: Sequelize.DATE,
			defaultValue: Sequelize.NOW },
	status: { type: Sequelize.ENUM('open', 'closed') }
}, {
	getterMethods: {
    	route: function()  { return '/wiki/' + this.urlTitle;}
  	}, 
  	hooks: { 
		beforeValidate: function (page) {
			console.log("THIS", typeof page.build);
		  if (page.title) {
		    // Removes all non-alphanumeric characters from title
		    // And make whitespace underscore
		    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
		  } else {
		  	
		    // Generates random 5 letter string
		    page.urlTitle = Math.random().toString(36).substring(2, 7);
			console.log("else", page.urlTitle);		  
		  }
		}
	}
});

var User = db.define('User',{
	name: { type: Sequelize.STRING,
			allowNull: false},
	email: { type: Sequelize.STRING,
			allowNull: false,
			isEmail: true}
});

//Page.belongsTo(User);

module.exports = {
	Page: Page,
	User: User
};