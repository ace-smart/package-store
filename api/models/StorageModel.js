const mongoose = require('mongoose')

const StorageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 250,
        text: true
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    propertyType: {
        type: String,
        enum: ['rental', 'owned'],
        default: 'rental',
        lowercase: true,
    },
    capacity: {
        type: Number, 
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'full'],
        default: 'available'
    }
}, {timestamps: true})

module.exports = mongoose.model('Storage', StorageSchema)