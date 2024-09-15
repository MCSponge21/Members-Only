const passport = require("passport");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
require('dotenv').config()

async function getIndex(req, res){
    const {rows} = await pool.query("SELECT * FROM messages ORDER BY id DESC");
    console.log(rows);
    res.render("index", { user: req.user, messages: rows });
};

async function getSignUp(req, res){
    res.render("sign-up-form");
};

async function postSignUp(req, res){
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            await pool.query("INSERT INTO users (username, password, ismember, isadmin) VALUES ($1, $2, false, false)", [
                req.body.username,
                hashedPassword,
              ]);
          });
      
      res.redirect("/");
    } catch(err) {
      return next(err);
    }
};

function getJoin(req, res){
    res.render("join");
};

async function postJoin(req, res){
    console.log(req.user);
    if(
        req.body.memberpassword == process.env.MEMBER_PASSWORD){
        await pool.query("UPDATE users SET ismember = true WHERE id = $1", [req.user.id]);
        res.redirect("/");
    }else{
        res.redirect("/");
    };
};

function postLogin(){
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
      });
};

function getLogout(req, res, next){
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
};

async function postPost(req, res){
    let d = new Date().toISOString();
    await pool.query("INSERT INTO messages (message, username, date) VALUES ($1, $2, $3)", [
        req.body.message,
        req.user.username,
        d
    ]);
    res.redirect("/");
};

async function postDelete(req, res){
    await pool.query("DELETE FROM messages WHERE id = $1", [req.params.id]);
    res.redirect("/");
};

function getPost(req, res){
    res.render("post");
}

module.exports = {
    getIndex,
    getSignUp,
    postSignUp,
    getJoin,
    postJoin,
    postLogin,
    getLogout,
    postPost,
    postDelete,
    getPost
};