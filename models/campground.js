const mongoose = require("mongoose");
const { cloudinary } = require("../configs/cloudinary");
const Review = require("./review");
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.post("findOneAndDelete", async function (data) {
  if (data) {
    for (let image of data.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
    await Review.deleteMany({
      _id: {
        $in: data.reviews,
      },
    });
  }
});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>
  `;
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
