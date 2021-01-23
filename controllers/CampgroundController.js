const Campground = require("../models/campground");

// Cloudinary
const { cloudinary } = require("../configs/cloudinary");

// Mapbox Geocoding
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  try {
    const geodata = await geocoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
    const newCampground = new Campground(req.body);
    newCampground.geometry = geodata.body.features[0].geometry;
    newCampground.images = req.files.map((img) => ({
      url: img.path,
      filename: img.filename,
    }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully add a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.showCampground = async (req, res, next) => {
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
};

module.exports.renderEditForm = async (req, res, next) => {
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
};

module.exports.editCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body,
    });
    const images = req.files.map((img) => ({
      url: img.path,
      filename: img.filename,
    }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
      for (let imgFileName of req.body.deleteImages) {
        await cloudinary.uploader.destroy(imgFileName);
      }
      await campground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Successfully edit a campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(err);
  }
};

module.exports.deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully delete a campground!");
    res.redirect(`/campgrounds`);
  } catch (err) {
    next(err);
  }
};
