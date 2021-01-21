const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./helpers/ExpressError");
const campgroundsRouter = require("./routers/campgroundsRouter");
const reviewsRouter = require("./routers/reviewsRouter");
const usersRouter = require("./routers/usersRouter");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Mongo Connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session for Development
const config = {
  secret: "SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(config));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session()); //after app.use(session(config))
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userLoggedIn = req.user; // req.user --> from Passport
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", usersRouter);
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error" } = err;
  res.status(status).render("error", { status, message });
});

app.listen(PORT, () => {
  console.log(`Server run on PORT: ${PORT}`);
});
