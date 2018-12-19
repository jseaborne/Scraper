var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(process.cwd() + "/public"));

var databaseUri = "mongodb://localhost/mongoosearticles";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI,{useMongoClient:true});
} else {
  mongoose.connect(databaseUri,{useMongoClient:true});
}

var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection sucessful.");
});

//set engine and default for handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var router = express.Router();

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoosearticles",{useMongoClient:true});


// Require routes file pass router object
require("./config/routes")(router);

// Have every request go through router middlewar
app.use(router);

var PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
