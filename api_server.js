// Load environment variable
require("dotenv").config({ path: "./api/api_config.env" })

const express = require("express")
const app = express()
const connectDB = require("./api/db.js")
const bodyParser = require('body-parser')

// Connect to mongodb
connectDB()

// Middleware
app.use(bodyParser.json({limit: '10mb',  extended: true}))

// Api routes
app.use("/api", require("./api/routes/api"))

// Port
const PORT = process.env.API_SERVER_PORT || 4000
app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`)
})