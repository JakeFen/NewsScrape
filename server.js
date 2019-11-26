var express = require("express");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

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

// Scrapes the NYTimes website and saves it to the database
app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("h2.esl82me0").each(function(i, element) {
      var result = {};

      result.title = $(this).text();
      result.link = $(this)
        .parent()
        .parent()
        .attr("href");
      result.message = $(this)
        .parent()
        .parent()
        .parent()
        .children("a")
        .text();

      db.Article.create(result)
        .then(function(dbArticle) {
          res.json(dbArticle);
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
});

// Finds everything in the database
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Deletes everything in the database
app.delete("/api/clear", function(req, res) {
  db.Article.deleteMany({}).then(function(dbArticle) {
    res.json(dbArticle);
  });
});

// Delete one
app.delete("/api/delete/:id", function(req, res) {
  db.Article.deleteOne({ _id: req.params.id }).then(function(result) {
    res.json(result);
  });
});

app.delete("/api/delete/note/:id", function(req, res) {
  console.log(req.params.id)
  db.Note.deleteOne({ _id: req.params.id }).then(function(result) {
    res.json(result);
  });
});

// Changed the saved value to true
app.post("/api/save/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(
    function(result) {
      res.json(result);
    }
  );
});

// Creates a note and saved it to the corresponding article
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log(dbNote._id)
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting a specific Article and populating it with it's notes

app.get("/article/:id", function(req, res) {
  console.log(req + "something something")
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      console.log(dbArticle)
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/notes", function(req, res) {
  db.Note.find({})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
})

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
