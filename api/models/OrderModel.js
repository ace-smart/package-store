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
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    voucherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher'
    },
    deliveryDay: {
        type: Date,
        required: true,
    },
    stripePaymentIntentId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['processing', 'packing', 'delivering', 'done',  'cancelled'],
        default: 'processing'
    }
}, {timestamps: true})

module.exports = mongoose.model('Order', OrderSchema)