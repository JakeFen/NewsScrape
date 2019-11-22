var express = require("express");
var mongoose = require("mongoose");

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", {
  useNewUrlParser: true
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

// Html Routes
app.get("/saved", function(req, res) {
  res.sendFile(__dirname + "/public/saved.html");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Data Routes
