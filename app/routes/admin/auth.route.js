const router = require("express").Router()
const passport = require("passport")
const { rememberMeLogin, showLoginForm } = require("../../controllers/admin/auth.controller")
const { _checkUnauthenticatedAdmin } = require('../../helper/auth.helper')
// @desc    Show login form
// @route   GET /login
router.get("/login",
_checkUnauthenticatedAdmin,
showLoginForm)

// @desc    Authentication
// @route   POST /login
router.post(
    "/login",
    _checkUnauthenticatedAdmin,
    passport.authenticate("local", {
        failureRedirect: "/admin/login",
        failureFlash: true,
    }),
    rememberMeLogin,
    (req,res, next) => {
        return res.redirect('/admin')
    }
)

// @desc    Logout
// @route   GET /logout
router.get("/logout", (req, res) => {
    res.clearCookie('remember_me', {
        path: '/admin'
      })
    req.logout()
    return res.redirect('/admin/login')
})

module.exports = router
