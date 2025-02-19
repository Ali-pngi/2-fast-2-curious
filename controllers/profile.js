// controllers/profile.js
const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const isSignedIn = require('../middleware/is-signed-in')

// Profile route
router.get('/', isSignedIn, async (req, res) => {
    try {
       
        const carsOwned = await Car.find({ owner: req.session.user._id }).populate('owner favouritedByUser')
        
        const favoritedCars = await Car.find({ favouritedByUser: req.session.user._id }).populate('owner favouritedByUser')

        res.render('profile', {
            carsOwned: carsOwned,
            favoritedCars: favoritedCars,
            user: req.session.user
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router


