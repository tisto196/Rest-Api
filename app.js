const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDb");

const wikiSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", wikiSchema);
/////////////////////// request targeting all articles
app
  .route("/articles")
  .get((req, res) => {
    Article.find().then((foundarticles) => {
      console.log(foundarticles);
    });
  })
  .post((req, res) => {
    //   console.log();
    //   console.log();
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save();
  })
  .delete((req, res) => {
    Article.deleteMany().then(() => {
      console.log("deleetd sucesfully");
    });
  });
// app.get("/articles", );

// app.post("/articles", );

// app.delete("/articles", );
/////////////////////////////  targeting specific article

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }).then((foundarticle) => {
      if (foundarticle) {
        console.log(foundarticle);
      } else {
        console.log("article not found");
      }
    });
  })
  .put((req, res) => {
    Article.update(
      {
        title: req.params.articleTitle,
      },
      { title: req.body.title, content: req.body, content },
      { overwrite: true }
    ).then(() => {
      res.send("sucessfully updated the article");
    });
  })
  .patch((req, res) => {
    Article.update({ title: req.params.articleTitle }, { $set: req.body }).then(
      () => {
        console.log("updated sucessfully");
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }).then(() => {
      console.log("title deleted sucessfully");
    });
  });

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
