const router = require("express").Router()

const {
    showLoginPage, showRegisterPage, showForgotPasswordPage, showResetPasswordPage, resetPassword
} = require("../../controllers/client/auth.controller")

// @desc:   show register page
// @route:  GET /register
router.get('/register', showRegisterPage)

// @desc:   show login page
// @route:  GET /login
router.get('/login', showLoginPage)

// @desc    Reset password
// @route   GET /reset-password
router.get("/reset-password", resetPassword)

module.exports = router
