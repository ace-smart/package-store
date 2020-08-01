const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// load "config.env"
dotenv.config({path: './config/config.env'})

// connect to mongodb
connectDB()

// routes
app.get('/', (req, res) => {
  return res.send('Hello word')
})

// port
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})