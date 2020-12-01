// Load environment variable
require("dotenv").config({ path: "./config/config.env" })
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
const passport = require("passport")
const customPassport = require("./app/passport/custom")
const flash = require("express-flash")
const exphbs = require("express-handlebars")
const MongoStore = require("connect-mongo")(session)

// connect to mongodb
connectDB()
// template engine
app.set("views", path.join(__dirname, "app/views"))
app.engine(
    ".hbs",
    exphbs({ extname: ".hbs", defaultLayout: false, helpers: require("./app/helper/hbs.helper") })
)
app.set("view engine", ".hbs")
// static folders
app.use("/public", express.static(path.join(__dirname, "app/public")))
app.use("/static", express.static(path.join(__dirname, "app/public/client")))
app.use("/admin/static", express.static(path.join(__dirname, "app/public/admin")))
app.use("/admin/plugins", express.static(path.join(__dirname, "app/public/admin/plugins")))
// logger
app.use(morgan("dev"))
// session
app.use(
    session({
        name: "userSession",
        secret: process.env.SESSION_SECRET,
        // cookie: { path: "/", httpOnly: true, secure: false, maxAge: 1000 * 3600 * 24 * 7 },
        resave: true,
        saveUninitialized: false,
        // store: new MongoStore({
        //     mongooseConnection: mongoose.connection,
        // }),
    })
)
//  helmet, cors, csurf
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
)
// multer setup
app.use((req, res, next) => {
    const upload = require("./config/multer").fields([
        { name: "avatar", maxCount: 1 },
        { name: "productImg", maxCount: 1 },
    ])
    
    upload(req, res, (err) => {
        if (err) {
            res.locals.file = {
                error: err,
            }
        }

        return next()
    })
})
// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
// cookieParser
app.use(cookieParser())
// csrfProtection
app.use(csrf({ cookie: true }))
// flash
app.use(flash())
// passport
customPassport(passport)
app.use(passport.initialize())
app.use(passport.session())
// routes
app.use(require("./app/routes/client/client.js"))
app.use("/admin", require("./app/routes/admin/admin.js"))

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})
