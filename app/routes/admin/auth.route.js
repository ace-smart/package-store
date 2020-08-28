const router = require("express").Router()
const passport = require("passport")
const { rememberMeLogin, showLoginForm } = require("../../controllers/admin/auth.controller")
const { _checkUnauthenticated, _redirectToIndex } = require('../../helper/auth.helper')
// @desc    Show login form
// @route   GET /login
router.get("/login", _checkUnauthenticated, showLoginForm)

// @desc    Authentication
// @route   POST /login
router.post(
    "/login",
    _checkUnauthenticated,
    passport.authenticate("local", {
        // successRedirect: "/admin",
        failureRedirect: "/admin/login",
        failureFlash: true,
    }),
    rememberMeLogin,
    _redirectToIndex
)

// @desc    Logout
// @route   GET /logout
router.get("/logout", (req, res) => {
    res.clearCookie('remember_me', {
        path: '/admin'
      })
    req.logout()
    res.redirect('/admin/login')
})

module.exports = router
