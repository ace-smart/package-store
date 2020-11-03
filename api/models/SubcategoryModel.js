const mongoose = require('mongoose')

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    text: true,
    min: 3,
    max: 255
  },
  status: {
    type: String,
    default: 'deactivated',
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Subcategory', SubcategorySchema)

