const express = require('express');
const Router = express.Router();
const passport = require("passport");
const {getIndex, postSignUp, getSignUp, getJoin, postJoin, getLogout, getPost, postPost, postDelete} = require("../controllers/controller")
require('dotenv').config()

Router.get("/", getIndex);
  
Router.get("/sign-up", getSignUp);

Router.post("/sign-up", postSignUp);

Router.get("/join", getJoin);

Router.post("/join", postJoin);

Router.post("/log-in", passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);

Router.get("/log-out", getLogout);

Router.get("/post", getPost);

Router.post("/post", postPost);

Router.post("/delete/:id", postDelete);

module.exports = Router;