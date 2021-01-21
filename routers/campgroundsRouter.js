const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const { validateCampground } = require("../middlewares/validate");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { isAuthorCamp } = require("../middlewares/isAuthor");

router.get("/", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn, validateCampground, async (req, res, next) => {
  try {
    const newCampground = new Campground(req.body);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully add a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "No Data Found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/edit", isLoggedIn, isAuthorCamp, async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "No Data Found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  isLoggedIn,
  isAuthorCamp,
  validateCampground,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body,
      });
      req.flash("success", "Successfully edit a campground!");
      res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
      next(err);
    }
  }
);

router.delete("/:id", isLoggedIn, isAuthorCamp, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully delete a campground!");
    res.redirect(`/campgrounds`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
