const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/ecommerce-store-test'

module.exports = async function() {
  try {
    return await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch (error) {
    console.error(error)
  }
}