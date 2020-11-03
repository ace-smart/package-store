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
    usageLimit: {
        limitType: {
            type: String,
            enum: ['daily', 'weekly', 'seasonal', 'unlimited', 'personal', 'manually'],
            default: 'manually',
        },
        maxOfUse: {
            type: Number,
            default: 0
        },
    },
    validUntil: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        max: 350,
    },
    status: {
        type: String,
        default: 'deactivated'
    }
}, {timestamps: true})

module.exports = mongoose.model('Voucher', VoucherSchema)