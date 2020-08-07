// Load environment variable
require('dotenv').config({path: './config/config.env'})

const express = require('express')
const morgan = require('morgan')
const app = express()
const connectDB = require('./config/db')

// Static folder

// Middleware
// app.use(express.static('views'))

// Connect to mongodb
connectDB()

// Logger
app.use(morgan('dev'))

// Routes
app.get('/', (req, res) => {
  return res.send('Hello word')
})

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})