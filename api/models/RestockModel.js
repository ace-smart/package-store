const mongoose = require('mongoose')

const RestockSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // from: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    // to: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    amount: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        enum: ['import','export'],
        required: true
    },
    status: {
        type: String,
        default: 'deactivated'
    }
}, {timestamps: true})

module.exports = mongoose.model('Restock', RestockSchema)