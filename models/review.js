const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  body: String,
  rating: Number,
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
