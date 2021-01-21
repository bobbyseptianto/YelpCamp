const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res, next) => {
  try {
    try {
      const { username, email, password } = req.body;
      const user = await new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Wellcome to YelpCamp!");
        res.redirect("/campgrounds");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: "Invalid username or password!",
    successFlash: "Welcome Back!",
    failureRedirect: "/login",
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
});

module.exports = router;
