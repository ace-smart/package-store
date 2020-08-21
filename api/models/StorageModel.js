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
        ref: 'Address',
        required: true
    },
    propertyType: {
        type: String,
        default: 'rental',
        lowercase: true,
    },
    capacity: {
        size: {type: Number, required: true},
        unit: {type: String, default: 'kg', max:5,lowercase: true}
    },
    description: {
        type: String,
        max: 350
    },
    status: {
        type: String,
        enum: ['available', 'full'],
        default: 'available'
    }
}, {timestamps: true})

module.exports = mongoose.model('Storage', StorageSchema)