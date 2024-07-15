const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const isSignedIn = require('../middleware/is-signed-in')

// Create a new car
router.get('/new', isSignedIn, (req, res) => {
    res.render('cars/new')
})

router.post('/', isSignedIn, async (req, res) => {
    try {
        const car = new Car({
            ...req.body,
            owner: req.session.user._id
        });
        await car.save()
        res.redirect('/cars')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find().populate('owner favouritedByUser')
        res.render('cars/index', { cars })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Get a specific car
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('owner favouritedByUser')
        if (!car) {
            return res.status(404).send('Car not found')
        }
        res.render('cars/show', { car })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Edit a specific car
router.get('/:id/edit', isSignedIn, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).send('Car not found')
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Unauthorized')
        }
        res.render('cars/edit', { car })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Update a specific car
router.put('/:id', isSignedIn, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).send('Car not found')
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Unauthorized')
        }
        await Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.redirect(`/cars/${req.params.id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Delete a specific car
router.delete('/:id', isSignedIn, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).send('Car not found')
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Unauthorized')
        }
        await Car.findByIdAndDelete(req.params.id)
        res.redirect('/cars')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router
