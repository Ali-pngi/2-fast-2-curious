const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user.js')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

router.post('/sign-up', async (req, res, next) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      const error = new Error('Username already taken.')
      error.status = 400
      return next(error)
    }

    if (req.body.password !== req.body.confirmPassword) {
      const error = new Error('Password and Confirm Password must match')
      error.status = 400
      return next(error)
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    await User.create(req.body)

    res.redirect('/auth/sign-in')
  } catch (error) {
    next(error)
  }
})

router.post('/sign-in', async (req, res, next) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
      const error = new Error('Login failed. Please try again.')
      error.status = 400
      return next(error)
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      const error = new Error('Login failed. Please try again.')
      error.status = 400
      return next(error)
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }

    req.session.save(() => {
      res.redirect('/')
    })

  } catch (error) {
    next(error)
  }
})

module.exports = router
