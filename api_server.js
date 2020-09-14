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

app.use((req, res, next) => {
    const multer = require("multer")
    const upload = require("./config/multer").fields([
        { name: 'avatar', maxCount: 1 },
    ])
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({
                success: false,
                error: {
                    message: err.message,
                    field: err.field,
                },
            })
        } else if (err) return res.status(500).json({ success: false, error: err })
        
        return next()
    })
})

// Api routes
app.use("/api", require("./api/routes/api"))

// Port
const PORT = process.env.API_SERVER_PORT || 4000
app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`)
})