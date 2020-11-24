const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    totalCost: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    finalCost: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        max: 30,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    voucherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher'
    },
    deliveryDay: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['processing', 'packing', 'delivering', 'done',  'canceled'],
        default: 'processing'
    }
}, {timestamps: true})

module.exports = mongoose.model('Order', OrderSchema)