// Load environment variable
require("dotenv").config({ path: "./config/config.env" })
const mongoose = require("mongoose")
const express = require("express")
const app = express()
const connectDB = require("./config/db")
const path = require("path")
const morgan = require("morgan")
const session = require("express-session")
const helmet = require("helmet")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const csrf = require("csurf")
const exphbs = require("express-handlebars")
const MongoStore = require("connect-mongo")(session)
const crypto = require("crypto")

// Connect to mongodb
connectDB()
// Template engine
app.set("views", path.join(__dirname, "app/views"))
app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: false }))
app.set("view engine", ".hbs")
// Static folder
app.use("/static", express.static(path.join(__dirname, "app/public/client")))
app.use("/admin/static", express.static(path.join(__dirname, "app/public/admin")))
app.use("/admin/plugins", express.static(path.join(__dirname, "app/public/admin/plugins")))
// Logger
app.use(morgan("dev"))
// Session
app.use(
    session({
        name: "userSession",
        secret: process.env.SESSION_SECRET,
        cookie: { path: "/", httpOnly: true, secure: false, maxAge: null },
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
        }),
    })
)
app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString("hex")
    next()
})
//  helmet, cors, csurf
app.use(
    helmet({
        contentSecurityPolicy: false
    })
)
// bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
// cookieParser
app.use(cookieParser())
// csrfProtection
app.use(csrf({ cookie: true }))

// Routes
app.use("/admin", require("./app/routes/admin/admin.js"))

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})
