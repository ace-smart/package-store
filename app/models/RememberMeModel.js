const mongoose = require('mongoose')

const RememberMeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    
}, {timestamps: true})

module.exports = mongoose.model('Remember_me', RememberMeSchema)