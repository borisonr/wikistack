// Logs information about each incoming request.
//
var express = require( 'express' );
var app = express();
var morgan = require("morgan");
var swig = require("swig");
var routes = require("./routes/index.js");
var bodyParser = require("body-parser");
var socketio = require("socket.io");
var conString = 'postgres://localhost:5432/wikistackdb';
var models = require('./models/index.js');

models.User.sync().then(function(result){
	return models.Page.sync();
}).then(function(data){
	console.log(data);
}).catch(console.error);

// //middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan(':method :url :status'));
app.listen(3000);
//swig
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });
//routes
app.use(express.static(__dirname +"/public"));
app.use("/wiki", routes);