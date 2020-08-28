const router = require("express").Router()
const passport = require("passport")
const { login, showLoginForm } = require("../../controllers/admin/auth.controller")
const { _checkUnauthenticated } = require('../../helper/auth.helper')
// @desc    Show login form
// @route   GET /login
router.get("/login", _checkUnauthenticated, showLoginForm)

// @desc    Authentication
// @route   POST /login
router.post(
    "/login",
    _checkUnauthenticated,
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/admin/login",
        failureFlash: true,
    })
)

// @desc    Logout
// @route   GET /logout
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect('/admin/login')
})

module.exports = router
