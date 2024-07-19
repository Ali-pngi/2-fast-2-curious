require("dotenv").config();
const serverless = require('serverless-http'); // 🚨 New dependency
const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require("path");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authController = require("../../controllers/auth.js"); // 🚨 Adjusted paths
const carsController = require("../../controllers/cars.js"); // 🚨 Adjusted paths
const profileController = require("../../controllers/profile.js"); // 🚨 Adjusted paths
const isSignedIn = require("../../middleware/is-signed-in.js"); // 🚨 Adjusted paths

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
);

app.use(express.static("public")); // 🚨 Adjusted path

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user
  });
});

app.use('/auth', authController);
app.use('/cars', isSignedIn, carsController);
app.use('/profile', isSignedIn, profileController);

app.use('*', (req, res) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  res.status(404).render('404.ejs', { error: error.message });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).render('404.ejs', { error: err.message });
});

// 🚨 Remove code to set the PORT, and remove app.listen
module.exports.handler = serverless(app); // 🚨 Export the serverless function
