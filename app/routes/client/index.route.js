const router = require("express").Router()
const {
    showIndexPage, showContactPage, showAboutPage
} = require("../../controllers/client/index.controller")

// @desc:   show index page
// @route:  GET ['/','/index','/home']
router.get(['/','/index','/home'], showIndexPage)

// @desc:   show index page
// @route:  GET /about
router.get('/about', showAboutPage)

// @desc:   show index page
// @route:  GET /contact
router.get('/contact', showContactPage)

module.exports = router
