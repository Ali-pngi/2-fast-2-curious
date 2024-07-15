const mongoose = require('mongoose')

const carSchema = mongoose.Schema ({
    name: {
      type:  String,
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
    favouritedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // created_at: {
    //     type: timestamp
    // },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

})

const Car = mongoose.model('Car', carSchema)

module.exports = Car