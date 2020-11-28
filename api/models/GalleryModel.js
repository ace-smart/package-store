const mongoose = require('mongoose')

const GallerySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    size: {
        type: Number
    },
    extension: {
        type: String,
        enum: ['jpg', 'png', 'jpeg']
    },
    mimeType: {
        type: String,
        enum: ['image/jpeg', 'image/png']
    },
    status: {
        type: String,
        default: "deactivated"
    }
}, {timestamps: true})

module.exports = mongoose.model('Gallery', GallerySchema)