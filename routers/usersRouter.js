const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const UserController = require("../controllers/UserController");

router
  .route("/register")
  .get(UserController.renderRegisterForm)
  .post(UserController.registerUser);

router
  .route("/login")
  .get(UserController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      // failureFlash: "Invalid username or password!",
      successFlash: "Welcome Back!",
      failureRedirect: "/login",
    }),
    UserController.loginUSer
  );

router.get("/logout", UserController.logoutUser);

module.exports = router;
