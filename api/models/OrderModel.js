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
    currency: {
        type: String,
        max: 6,
        uppercase: true,
        default: 'USD'
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
    voucherCode: {
        type: String,
        ref: 'Voucher.code'
    },
    status: {
        type: String,
        enum: ['processing','received','racking', 'delivering','done', 'refunded', 'canceled'],
        default: 'processing'
    }
}, {timestamps: true})

module.exports = mongoose.model('Order', OrderSchema)