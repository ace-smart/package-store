const mongoose = require('mongoose')

const VoucherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 200,
    },
    code: {
        type: String,
        required: true,
        max: 30,
        text: true,
        uppercase: true
    },
    rate: {
        type: Number,
        default: 0,
    },
    minValue: {
        type: Number,
        required: true
    },
    maxValue: {
        type: Number,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'deactivated'
    }
}, {timestamps: true})

module.exports = mongoose.model('Voucher', VoucherSchema)