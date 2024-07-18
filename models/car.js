const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    colour: {
        type: String,
        required: true,
    },
    drivetrain: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
    },
    favouritedByUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    photo: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

const Car = mongoose.model('Car', carSchema)

module.exports = Car
