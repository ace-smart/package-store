const mongoose = require('mongoose')

const API_MONGO_URI = (process.env.NODE_ENV === 'production') 
  ? process.env.API_MONGO_URI
  : 'mongodb://localhost/ecommerce-store-test'

module.exports = async function() {
  try {
    return await mongoose.connect(API_MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch (error) {
    console.error(error)
  }
}