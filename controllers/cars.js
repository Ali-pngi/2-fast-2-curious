const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const isSignedIn = require('../middleware/is-signed-in')
const uploadMiddleware = require('../middleware/upload')

router.get('/new', isSignedIn, (req, res) => {
    res.render('cars/new')
})

router.get('/search', isSignedIn, (req, res) => {
    res.render('cars/search')
})

router.get('/results', isSignedIn, async (req, res, next) => {
    try {
        const { q: query } = req.query
        if (!query) {
            return res.status(400).render('cars/search', { error: 'No search query provided' })
        }

        const searchRegex = new RegExp(query, 'i')
        const yearQuery = parseInt(query)

        const cars = await Car.find({
            $or: [
                { name: searchRegex },
                { make: searchRegex },
                { colour: searchRegex },
                { drivetrain: searchRegex },
                { year: !isNaN(yearQuery) ? yearQuery : undefined },
                { location: searchRegex },
            ]
        }).populate('owner favouritedByUser')

        res.render('cars/index', { cars })
    } catch (error) {
        next(error)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const cars = await Car.find().populate('owner favouritedByUser')
        res.render('cars/index', { cars })
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id).populate('owner favouritedByUser')
        if (!car) {
            return res.status(404).render('404', { error: 'Car not found' })
        }
        res.render('cars/show', { car })
    } catch (error) {
        next(error)
    }
})

router.post('/', isSignedIn, uploadMiddleware, async (req, res, next) => {
    try {
        const car = new Car({
            ...req.body,
            owner: req.session.user._id,
            photo: req.file ? req.file.path : undefined,
        })
        await car.save()
        res.redirect('/cars')
    } catch (error) {
        next(error)
    }
})

router.get('/:id/edit', isSignedIn, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).render('404', { error: 'Car not found' })
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).render('404', { error: 'Forbidden' })
        }
        res.render('cars/edit', { car })
    } catch (error) {
        next(error)
    }
})

router.put('/:id', isSignedIn, uploadMiddleware, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).render('404', { error: 'Car not found' })
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).render('404', { error: 'Forbidden' })
        }

        const updates = {
            ...req.body,
            photo: req.file ? req.file.path : car.photo,
        }

        await Car.findByIdAndUpdate(req.params.id, updates, { new: true })
        res.redirect(`/cars/${req.params.id}`)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', isSignedIn, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).render('404', { error: 'Car not found' })
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).render('404', { error: 'Forbidden' })
        }
        await Car.findByIdAndDelete(req.params.id)
        res.redirect('/cars')
    } catch (error) {
        next(error)
    }
})

router.post('/:id/favorite', isSignedIn, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) {
            return res.status(404).json({ error: 'Car not found' })
        }
        const userId = req.session.user._id
        const isFavorited = car.favouritedByUser.includes(userId)
        
        if (isFavorited) {
            car.favouritedByUser = car.favouritedByUser.filter(id => id.toString() !== userId.toString())
        } else {
            car.favouritedByUser.push(userId)
        }
        
        await car.save()
        res.json({ isFavorited: !isFavorited })
    } catch (error) {
        next(error)
    }
})

module.exports = router