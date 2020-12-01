const router = require("express").Router()
const passport = require("passport")
const { showLoginForm, _storeTokensBySession } = require("../../controllers/admin/auth.controller")
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
    (req, res, next) => {
      req.role = "admin"
      return next()
    },
    passport.authenticate("local", {
        failureRedirect: "/admin/login",
        failureFlash: true,
    }),
    _storeTokensBySession,
    (req,res, next) => {
        return res.redirect('/admin')
    }
)

// @desc    Logout
// @route   GET /logout
router.get("/logout", (req, res) => {
    if (req.cookies['adminTokens'] != null) {
        res.clearCookie('adminTokens', {
            path: '/admin'
        })
    }
    req.logout()
    return res.redirect('/admin/login')
})

module.exports = router
