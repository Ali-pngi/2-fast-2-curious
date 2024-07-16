const express = require('express')
const router = express.Router()

const Car = require('../models/car.js')

router.get('/profile', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user) {
            return res.redirect('/auth/sign-in')
        }

        // Find cars created by the logged-in user
        const carsOwned = await Car.find({
            owner: req.session.user._id
        })

        // Find cars favorited by the logged-in user
        const favoritedCars = await Car.find({
            favouritedByUser: req.session.user._id
        })

        // Render the profile page with the cars data
        res.render('profile.ejs', {
            user: req.session.user,
            carsOwned: carsOwned,
            favoritedCars: favoritedCars
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router
