const Campground = require("../models/campground");
const Review = require("../models/review");

const isAuthorCamp = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You Do Not Authorized!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isAuthorReview = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You Do Not Authorized!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports = { isAuthorCamp, isAuthorReview };
