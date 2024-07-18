const express = require('express')
const router = express.Router()
const Car = require('../models/car.js')

router.get('/profile', async (req, res, next) => {
    try {
        // Check if user is logged in
        if (!req.session.user) {
            const error = new Error("User not logged in.") 
            error.status = 401           
            return next(error)}

        // Find cars created by the logged-in user
        const carsOwned = await Car.find({
            owner: req.session.user._id
        })

        // Find cars favorited by the logged-in user
        const favoritedCars = await Car.find({
            favouritedByUser: req.session.user._id
        })
        
        
        res.render('profile.ejs', {
            user: req.session.user,
            carsOwned: carsOwned,
            favoritedCars: favoritedCars
        })    } catch (error) {
        next(error); 
    }
})

module.exports = router