const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const isSignedIn = require('../middleware/is-signed-in')

// Profile route
router.get('/', isSignedIn, async (req, res, next) => {
    try {
        // Find cars owned by the user
        const carsOwned = await Car.find({ owner: req.session.user._id }).populate('owner favouritedByUser')
        // Find cars favorited by the user
        const favoritedCars = await Car.find({ favouritedByUser: req.session.user._id }).populate('owner favouritedByUser')

        res.render('profile', {
            carsOwned: carsOwned,
            favoritedCars: favoritedCars,
            user: req.session.user
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router

