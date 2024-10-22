const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const isSignedIn = require('../middleware/is-signed-in')

router.get('/', isSignedIn, async (req, res, next) => {
    try {
        const userId = req.session.user._id
        
        const [carsOwned, favoritedCars] = await Promise.all([
            Car.find({ owner: userId }).populate('owner favouritedByUser'),
            Car.find({ favouritedByUser: userId }).populate('owner favouritedByUser')
        ])

        res.render('profile', {
            carsOwned,
            favoritedCars,
            user: req.session.user
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
