const DB_URL_PROD = process.env.DB_URL; // MOngo Atlas for Deploying Production
const DB_URL_DEV = "mongodb://localhost:27017/yelp-camp";

// Mongo Connection
const mongoose = require("mongoose");
mongoose.connect(DB_URL_PROD, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const mongooseConnect = () => {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection Error"));
  db.once("open", () => {
    console.log("Database Connected");
  });
};

module.exports = mongooseConnect;
