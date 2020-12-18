const router = require("express").Router()
const {
  showIndexPage,
  showContactPage,
  showAboutPage,
  contact,
  showFAQsPage,
  trackOrder,
  showTrackOrderForm
} = require("../../controllers/client/index.controller")

// @desc:   show index page
// @route:  GET ['/','/index','/home']
router.get(["/", "/index", "/home"], showIndexPage)

// @desc:   show index page
// @route:  GET /about
router.get("/about", showAboutPage)

// @desc:   show contact page
// @route:  GET /contact
router.get("/contact", showContactPage)

// @desc:   leave messages
// @route:  POST /contact
router.post("/contact", contact)

// @desc:   FAQ
// @route:  GET /faqs
router.get("/faqs", showFAQsPage)

//@desc:    Show track order form
//@route:   GET /track-order
router.get('/track-order', trackOrder)

module.exports = router
