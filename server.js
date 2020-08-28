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
const passport = require('passport')
const adminPassport = require('./app/passport/admin')
const flash = require('express-flash')
const exphbs = require("express-handlebars")
const MongoStore = require("connect-mongo")(session)

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
        cookie: { path: "/", httpOnly: true, secure: false, maxAge: 3600*24*7 },
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
        }),
    })
)
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
// flash
app.use(flash())
// passport
adminPassport(passport)
app.use(passport.initialize())
app.use(passport.session())
// Routes
app.use("/admin", require("./app/routes/admin/admin.js"))

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})
