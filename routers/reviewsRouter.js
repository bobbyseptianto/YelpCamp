const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middlewares/validate");
const { isAuthorReview } = require("../middlewares/isAuthor");
const isLoggedIn = require("../middlewares/isLoggedIn");
const ReviewController = require("../controllers/ReviewController");

router.post("/", isLoggedIn, validateReview, ReviewController.createReview);

router.delete(
  "/:reviewid",
  isLoggedIn,
  isAuthorReview,
  ReviewController.deleteReview
);

module.exports = router;
