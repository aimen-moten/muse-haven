//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post",postSchema)


const homeStartingContent = "Welcome to my random blog, where I write about whatever comes to mind! Today, I want to talk about the importance of taking risks. We often hear the phrase 'no risk, no reward,' but how many of us actually take that to heart? It's easy to get comfortable in our daily routines and stick to what we know, but by doing so, we're missing out on the opportunities that come with taking risks. Of course, not all risks are created equal. There's a difference between taking a calculated risk and being reckless. But when we weigh the potential rewards against the potential consequences, we may find that taking a risk is worth it. Think about some of the most successful people in the world. Many of them got to where they are today by taking risks. They started their own businesses, pursued unconventional career paths, or made bold investments. They didn't let the fear of failure hold them back. Of course, not every risk will pay off. But even when we fail, we can learn from our mistakes and use those lessons to make better decisions in the future. And who knows? Sometimes failure can lead to unexpected opportunities. So if there is something you have been wanting to try but have been too afraid to take the leap, I encourage you to go for it. You never know what kind of rewards it may bring. And even if it doesn't work out, you'll know that you had the courage to try.";
const aboutContent = "This is a full-stack Blog Web App that allows users to create, track, and store their blog posts locally using MongoDB. The app is built using Embedded Javascript libraries (EJS), Express modules (including EJS Layouts and Bootstrap design styles), and custom-built modular Express modules to enhance functionality and routing parameters.";
const contactContent = "You can contact the creator of this blog on www.linkedin.com/aimen-moten/.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];

app.get("/", function(req, res){
  
  async function findPosts(){
    const resp = await Post.find();
    // console.log(resp);
    res.render("home", {
      startingContent: homeStartingContent,
      posts: resp
      });
  }
  findPosts();
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();
  // posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  async function findPosts(){
    const allPosts = await Post.find();
    allPosts.forEach(function(post){
      const storedTitle = _.lowerCase(post.title);
      if (storedTitle === requestedTitle) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    });
  };

  // async function findPosts(){
  //   const post = await Post.findOne({title: requestedTitle}).exec();
  //   console.log(post);
  //   // res.render("post", {
  //   //   title: post.title,
  //   //   content: post.content
  //   // });
  // }
  findPosts();

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
