const router = require("express").Router()
const {
    showLoginPage, showRegisterPage, showForgotPasswordPage, showResetPasswordPage
} = require("../../controllers/client/auth.controller")

// @desc:   show register page
// @route:  GET /register
router.get('/register', showRegisterPage)

// @desc:   show login page
// @route:  GET /login
router.get('/login', showLoginPage)

module.exports = router
