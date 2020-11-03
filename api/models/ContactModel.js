const { text } = require('body-parser')
const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    max: 400,
    required: true
  },
  status: {
    type: String,
    enum: ['deactivated', 'activated'],
    default: "deactivated"
  }
}, {timestamps: true})

module.exports = mongoose.model('Contact', ContactSchema)