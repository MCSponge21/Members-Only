const pool = require("./db/pool");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const Router = require("./routes/router");
const app = express();

app.set("view engine", "ejs");
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use("/", Router);
app.use('/public', express.static('public'));

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
  
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (!match) {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    }
});
  

app.listen(5000, () => console.log("app listening on port 5000!"));