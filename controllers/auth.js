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
    const { username, email, password, confirmPassword } = req.body
    
    if (password !== confirmPassword) {
      return res.status(400).render('auth/sign-up.ejs', { error: 'Password and Confirm Password must match' })
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).render('auth/sign-up.ejs', { error: 'Username or email already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ username, email, password: hashedPassword })

    res.redirect('/auth/sign-in')
  } catch (error) {
    next(error)
  }
})

router.post('/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render('auth/sign-in.ejs', { error: 'Invalid username or password' })
    }

    req.session.user = {
      _id: user._id,
      username: user.username
    }

    res.redirect('/')
  } catch (error) {
    next(error)
  }
})

module.exports = router