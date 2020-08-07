// Load environment variable
require("dotenv").config({ path: "./config/config.env" })

const express = require("express")
const app = express()
const connectDB = require("./config/db")

// Connect to mongodb
connectDB()

// Middleware
app.use(express.json())

// Api routes
app.use("/api", require("./api/routes/api"))

// Port
const PORT = process.env.API_SERVER_PORT || 4000
app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`)
})