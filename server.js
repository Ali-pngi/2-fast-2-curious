// const dotenv = require('dotenv')
// dotenv.config()
// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')
// const methodOverride = require('method-override')
// const morgan = require('morgan')
// const session = require('express-session')
// // const MongoStore = require('connect-mongo')

// const authController = require('./controllers/auth.js')
// const carsController = require('./controllers/cars.js')

// const port = process.env.PORT ? process.env.PORT : '3000'

// mongoose.connect(process.env.MONGODB_URI)

// mongoose.connection.on('connected', () => {
//   console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
// })

// app.use(express.urlencoded({ extended: false }));
// app.use(methodOverride('_method'))
// app.use(morgan('dev'))
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     // store: MongoStore.create({
//     //   mongoUrl: process.env.MONGODB_URI
//     // })
//   })
// )
// app.set('view engine', 'ejs')
// app.set('views', './views')

// app.get('/', (req, res) => {
//     res.render('index.ejs', {
//       user: req.session.user
//     });
//   });

//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });


const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authController = require('./controllers/auth.js');
const carsController = require('./controllers/cars.js');

const port = process.env.PORT || '3000';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in .env file');
}

if (!process.env.SESSION_SECRET) {
  throw new Error('Missing SESSION_SECRET in .env file');
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB ${mongoose.connection.name}.`))
  .catch((err) => console.error(`Failed to connect to MongoDB: ${err.message}`));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days expiration
    })
  })
);

app.set('view engine', 'ejs');
app.set('views', './views');

// Use the auth controller for routes starting with /auth
app.use('/auth', authController);

// Example route for the home page
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
