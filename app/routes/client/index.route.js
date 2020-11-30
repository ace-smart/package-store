const router = require("express").Router()
const {
    showIndexPage, showContactPage, showAboutPage, contact
} = require("../../controllers/client/index.controller")

// @desc:   show index page
// @route:  GET ['/','/index','/home']
router.get(['/','/index','/home'], showIndexPage)

// @desc:   show index page
// @route:  GET /about
router.get('/about', showAboutPage)

// @desc:   show contact page
// @route:  GET /contact
router.get('/contact', showContactPage)

// @desc:   leave messages
// @route:  GET /contact
router.post('/contact', contact)

module.exports = router
