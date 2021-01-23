const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateCampground } = require("../middlewares/validate");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { isAuthorCamp } = require("../middlewares/isAuthor");
const CampgroundController = require("../controllers/CampgroundController");

// Multer Upload File & Cloudinary Storage
const multer = require("multer");
const { storage } = require("../configs/cloudinary");
const upload = multer({ storage });

router.get("/", CampgroundController.index);

router.get("/new", isLoggedIn, CampgroundController.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"), // Sementara Upload before Validate
  validateCampground,
  CampgroundController.createCampground
);

router.get("/:id", CampgroundController.showCampground);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthorCamp,
  CampgroundController.renderEditForm
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthorCamp,
  upload.array("image"), // Sementara Upload before Validate
  validateCampground,
  CampgroundController.editCampground
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthorCamp,
  CampgroundController.deleteCampground
);

module.exports = router;
