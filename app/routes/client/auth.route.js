const router = require("express").Router()
const passport = require("passport")
const {
  showRegisterPage,
  register,
  showLoginPage,
  showResendActivationPage,
  resendActivation,
  activateUser,
  showForgetPwdPage,
  sendForgetPwdEmail,
  showResetPwdPage,
  resetPassword,
  _storeTokensBySession,
} = require("../../controllers/client/auth.controller")
const {_checkUnauthenticatedCustomer} = require('../../helper/auth.helper')

// @desc:   show register page
// @route:  GET /register
router.get("/register", _checkUnauthenticatedCustomer, showRegisterPage)

// @desc:   register
// @route:  POST /register
router.post("/register", _checkUnauthenticatedCustomer, register)

// @desc:   show resend activation page
// @route:  GET /resend-activation
router.get("/resend-activation", _checkUnauthenticatedCustomer, showResendActivationPage)

// @desc:   resend activation
// @route:  POST /resend-activation
router.post("/resend-activation", _checkUnauthenticatedCustomer, resendActivation)

// @desc:   activate
// @route:  GET /activate?email=example.email&confirmString=123456
router.get("/activate", _checkUnauthenticatedCustomer, activateUser)

// @desc:   show forget password page
// @route:  GET /forget-password
router.get("/forget-password", _checkUnauthenticatedCustomer, showForgetPwdPage)

// @desc:   send forget password email
// @route:  POST /forget-password
router.post("/forget-password", _checkUnauthenticatedCustomer, sendForgetPwdEmail)

// @desc:   show reset password page
// @route:  GET /reset-password?email=email@exmaple.com&confirmString=12345qwerty
router.get("/reset-password", _checkUnauthenticatedCustomer, showResetPwdPage)

// @desc:   set new password
// @route:  POST /reset-password
router.post("/reset-password", _checkUnauthenticatedCustomer, resetPassword)

// @desc:   show login page
// @route:  GET /login
router.get("/login", _checkUnauthenticatedCustomer, showLoginPage)

// @desc:   authenticate
// @route:  POST /login
router.post(
  "/login",
  _checkUnauthenticatedCustomer,
  (req, res, next) => {
    req.role = "user"
    return next()
  },
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  _storeTokensBySession,
  (req, res, next) => {
    return res.redirect("/")
  }
)

// @desc:   logout
// @route:  GET /logout
router.get("/logout", (req, res, next) => {
  if (req.cookies["tokens"] != null) {
    res.clearCookie("tokens", {
      path: "/",
    })
  }
  req.logout()
  return res.redirect("/login")
})

module.exports = router
