const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    await new Campground({
      // YOUR USER ID
      author: "6009984abdd864a155c8fa08",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url:
            "https://res.cloudinary.com/cloudinarybob/image/upload/v1611307243/YelpCamp/u9g5z7wktraevghshd4w.jpg",
          filename: "YelpCamp/imqkjo89uykc191f9q0c",
        },
        {
          url:
            "https://res.cloudinary.com/cloudinarybob/image/upload/v1611307237/YelpCamp/b0a7lksiq206oohkjjzg.jpg",
          filename: "YelpCamp/rhacy2z6wzf06tj84ce8",
        },
        {
          url:
            "https://res.cloudinary.com/cloudinarybob/image/upload/v1611307226/YelpCamp/r1tizratqohuznwxhkwv.jpg",
          filename: "YelpCamp/zh3gl3pl8lzklhtq0yfw",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
    }).save();
  }
};

seedDB().then(() => {
  db.close();
});
