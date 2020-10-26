const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        min: 3,
        max: 30,
        required: true
    },
    lastName: {
        type: String,
        min: 3,
        max: 30,
        required: true
    },
    gender: {
        type: String,
        default: 'female',
        enum: ['male','female','lgbt']
    },
    dateOfBirth: {
        type: Date
    },
    phoneNumber: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'default'
    },
    status: {
      type: String,
      default: 'deactivated',
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Profile', ProfileSchema)