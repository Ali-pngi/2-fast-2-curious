const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const authController = require('./controllers/auth.js')
const carsController = require('./controllers/cars.js')
const isSignedIn = require('./middleware/is-signed-in.js')

const port = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
)
app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (req, res) => {
    res.render('index.ejs', {
      user: req.session.user
    })
  })

  app.use('/auth', authController)
  app.use('/cars', isSignedIn, carsController)
  app.use('/profile', isSignedIn, profileController)
  
  app.use('*', (req, res) => {
    res.status(404).render('404.ejs')
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })


