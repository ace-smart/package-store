// Load environment variable
require('dotenv').config({path: './config/config.env'})

const express = require('express')
const app = express()
const apiRoutes = require('./api/routes/api')
const connectDB = require('./config/db')

// Connect to mongodb
connectDB()

// Middleware
app.use(express.json())

// Api routes
app.use('/api', apiRoutes)

// Port
const PORT = process.env.API_SERVER_PORT || 4000
app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`)
})