const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require("path")
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passUserToView = require('./middleware/pass-user-to-view.js')

const authController = require('./controllers/auth.js')
const carsController = require('./controllers/cars.js')
const profileController = require('./controllers/profile.js')
const isSignedIn = require('./middleware/is-signed-in.js')

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  })
)

app.use(express.static(path.join(__dirname, "public")))
app.use(passUserToView)  

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.use('/auth', authController)
app.use('/cars', isSignedIn, carsController)
app.use('/profile', isSignedIn, profileController)

app.use('*', (req, res) => {
  res.status(404).render('404.ejs', { error: 'Page Not Found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).render('404.ejs', { error: err.message || 'Something went wrong' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app