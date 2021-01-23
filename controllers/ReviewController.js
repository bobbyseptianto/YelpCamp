const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = await new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "Successfully add a new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Successfully delete a review!");
    res.redirect(`/campgrounds/${id}`);
  } catch (err) {
    next(err);
  }
};
