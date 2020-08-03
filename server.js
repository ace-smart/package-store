const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const apiRoutes = require('./routes/api/api')

// Load environment variable
dotenv.config({path: './config/config.env'})

// Middleware
app.use(express.json())

// Connect to mongodb
connectDB()

// Api routes
app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  return res.send('Hello word')
})

// Port
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})