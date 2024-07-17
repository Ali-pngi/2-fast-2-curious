const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const isSignedIn = require('../middleware/is-signed-in')
const upload = require('../middleware/upload')

// Create a new car
router.get('/new', isSignedIn, (req, res) => {
    res.render('cars/new')
})

router.post('/', isSignedIn, upload, async (req, res) => {
    try {
        const car = new Car({
            ...req.body,
            owner: req.session.user._id,
            photo: req.file ? `/uploads/${req.file.filename}` : undefined,
        })
        await car.save()
        res.redirect('/cars')
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
})

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find().populate('owner favouritedByUser')
        res.render('cars/index', { cars })
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
})

// Get a specific car
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('owner favouritedByUser')
        if (!car) {
            return res.status(404).redirect('/404')
        }
        res.render('cars/show', { car })
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
})

// Edit a specific car
router.get('/:id/edit', isSignedIn, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).redirect('/404')
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).redirect('/404')
        }
        res.render('cars/edit', { car })
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
})

// Update a specific car
router.put('/:id', isSignedIn, upload, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).redirect('/404')
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).redirect('/404')
        }

        const updates = {
            ...req.body,
        }
        if (req.file) {
            updates.photo = `/uploads/${req.file.filename}`
        }

        await Car.findByIdAndUpdate(req.params.id, updates, { new: true })
        res.redirect(`/cars/${req.params.id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
})

// Delete a specific car
router.delete('/:id', isSignedIn, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).redirect('/404')
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).redirect('/404')
        }
        await Car.findByIdAndDelete(req.params.id)
        res.redirect('/cars')
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
})

// Search for a specific car
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q
        const cars = await Car.find({ name: new RegExp(query, 'i') }).populate('owner favouritedByUser')
        res.render('cars/index', { cars })
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
})

// Favourite a car
router.post('/:id/favorite', isSignedIn, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.redirect('/404');
        }
        car.favouritedByUser.addToSet(req.session.user._id);
        await car.save();
        res.redirect('/cars');
    } catch (error) {
        console.log(error);
        res.redirect('/404');
    }
})

module.exports = router
