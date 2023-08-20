//jshint esversion:6
//connection string to put in the command line => mongosh "mongodb+srv://cluster0.wtywmfw.mongodb.net/" --apiVersion 1 --username ayushiarya599

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "We provide a platform for creative minds like you to create beautiful blogs about any topic that you feel people will need and read. So sign-in and create your first blog post now! Or, just explore our collection of articles written by fellow bloggers until you're ready.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const PORT= process.env.PORT || 3000;

mongoose.connect("mongodb+srv://ayushiarya599:Symbol%4010@cluster0.wtywmfw.mongodb.net/blogpostDB?retryWrites=true", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//defining schema for posts that will get stored in collection inside this database
const postsSchema = {
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
};

//defining  collection: posts inside blogpostDB
const Post = mongoose.model("Post", postsSchema);

// let posts = [];

app.get("/", (req, res) => {
  let day = date.getDate();
  Post.find()
    .then(function (foundPosts){
        Post.insertMany(foundPosts)
          .then(function (result) {
            console.log(
              result,
              "Successfully saved posts"
            );
          })
          .catch(function (err) {
            console.log(err);
          });
        res.render("home", {
          startingContent: homeStartingContent,
          posts: foundPosts,
          kindOfDay: day,
        });
    }) .catch(function (err) {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutText: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactText: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const newTitle = req.body.postTitle;
  const newBody = req.body.postBody;
  const newPost = new Post({
    title: newTitle,
    body: newBody,
  });
  newPost.save();
  res.redirect("/");
});

app.get("/posts/:postName", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postName);
  Post.find()
    .then(function (foundPosts){
      foundPosts.forEach((post) => {
        const storedTitle = _.lowerCase(post.title);
        if (requestedTitle === storedTitle) {
          res.render("post", { title: post.title, body: post.body });
        }
    })
  }) .catch(function (err) {
    console.log(err);
  });
});

// This code only runs on the browser

// if (typeof document !== 'undefined') {
//   document.querySelector(".search-button").addEventListener("click", function () {
//     const searchBarValue = _.lowerCase(document.querySelector(".search-bar").value);
//     posts.forEach((post) => {
//       const storedTitle = _.lowerCase(post.title);
//       if (searchBarValue === storedTitle) {
//         res.render("post", { title: post.title, body: post.body });
//       }
//     });
//   });
// }

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
