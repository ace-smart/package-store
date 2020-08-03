const express = require('express')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Load 'config.env'
dotenv.config({path: './config/config.env'})

// Static folder


// Connect to mongodb
connectDB()

// Logger
app.use(morgan('dev'))

// Routes
app.get('/', (req, res) => {
  return res.send('Hello word')
})

// Port
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})