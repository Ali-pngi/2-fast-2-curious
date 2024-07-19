const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const isSignedIn = require('../middleware/is-signed-in');
const upload = require('../middleware/upload');

// Create a new car
router.get('/new', isSignedIn, (req, res) => {
    res.render('cars/new');
});

// Search form route
router.get('/search', isSignedIn, (req, res) => {
    res.render('cars/search');
});

// Search results route
router.get('/results', isSignedIn, async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query) {
            const error = new Error('No search query provided');
            error.status = 400;
            return next(error);
        }

        const searchRegex = new RegExp(query, 'i');
        const yearQuery = parseInt(query);

        const cars = await Car.find({
            $or: [
                { name: searchRegex },
                { make: searchRegex },
                { colour: searchRegex },
                { drivetrain: searchRegex },
                { year: !isNaN(yearQuery) ? yearQuery : undefined },
                { location: searchRegex },
            ]
        }).populate('owner favouritedByUser');

        res.render('cars/index', { cars });
    } catch (error) {
        next(error);
    }
});

// Get all cars
router.get('/', async (req, res, next) => {
    try {
        const cars = await Car.find().populate('owner favouritedByUser');
        res.render('cars/index', { cars });
    } catch (error) {
        next(error);
    }
});

// Get a specific car
router.get('/:id', async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id).populate('owner favouritedByUser');
        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            return next(error);
        }
        res.render('cars/show', { car });
    } catch (error) {
        next(error);
    }
});

router.post('/', isSignedIn, upload, async (req, res, next) => {
    try {
        const car = new Car({
            ...req.body,
            owner: req.session.user._id,
            photo: req.file ? `/uploads/${req.file.filename}` : undefined,
        })
        await car.save()
        res.redirect('/cars')
    } catch (error) {
        next(error)
    }
})

// Edit a specific car
router.get('/:id/edit', isSignedIn, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            return next(error);
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            const error = new Error('Forbidden');
            error.status = 403;
            return next(error);
        }
        res.render('cars/edit', { car });
    } catch (error) {
        next(error);
    }
});

// Update a specific car
router.put('/:id', isSignedIn, upload, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            return next(error);
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            const error = new Error('Forbidden');
            error.status = 403;
            return next(error);
        }

        const updates = {
            ...req.body,
        };
        if (req.file) {
            updates.photo = `/uploads/${req.file.filename}`;
        }

        await Car.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.redirect(`/cars/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

// Delete a specific car
router.delete('/:id', isSignedIn, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            return next(error);
        }
        if (car.owner.toString() !== req.session.user._id.toString()) {
            const error = new Error('Forbidden');
            error.status = 403;
            return next(error);
        }
        await Car.findByIdAndDelete(req.params.id);
        res.redirect('/cars');
    } catch (error) {
        next(error);
    }
});

// Favorite a car
router.post('/:id/favorite', isSignedIn, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            return next(error);
        }
        if (!car.favouritedByUser.includes(req.session.user._id)) {
            car.favouritedByUser.push(req.session.user._id);
        }
        await car.save();
        res.status(200).send('Favorited');
    } catch (error) {
        next(error);
    }
});

router.post('/:id/unfavorite', isSignedIn, async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            return next(error);
        }
        car.favouritedByUser = car.favouritedByUser.filter(userId => userId.toString() !== req.session.user._id.toString());
        await car.save();
        res.status(200).send('Unfavorited');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
