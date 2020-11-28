const mongoose = require('mongoose')

const OrderDetailSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    amount: {
        type: Number,
        min: 0,
        default: 1,
    },
    status: {
        type: String,
        default: 'deactivated'
    }
}, {timestamps: true})

module.exports = mongoose.model('OrderDetail', OrderDetailSchema)