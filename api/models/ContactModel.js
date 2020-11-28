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
    enum: ['seen', 'unread', 'starred', 'removed'],
    default: "unread"
  }
}, {timestamps: true})

module.exports = mongoose.model('Contact', ContactSchema)