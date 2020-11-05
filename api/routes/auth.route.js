const express = require("express")
const router = express.Router()
const {
  auth,
  getUserData,
  renewAccessToken,
  register,
  confirmEmail,
  resendConfirmEmail,
  sendEmailForResetPWd,
  resetPassword,
  updateNewPassword,
  resetToken,
} = require("../controllers/auth.controller")
const { _ensureAccessToken } = require("../helper/auth")

// @desc    Generate tokens
// @route   POST /auth
router.post("/auth", auth)

// @desc    GET User data by tokens
// @route   GET /get-user-data
router.get("/get-user-data", _ensureAccessToken, getUserData)

// @desc    Renew access token
// @route   GET /token
router.get("/token", renewAccessToken)

// @desc    Remove tokens
// @route   POST /token/reset
router.post("/token/reset", _ensureAccessToken, resetToken)

// @desc    Register
// @route   POST /register
router.post("/register", register)

// @desc    Email confirmation
// @route   GET /confirm-email
router.get("/confirm-email", confirmEmail)

// @desc    Email confirmation
// @route   GET /resend-confirm-email
router.post("/resend-confirm-email", resendConfirmEmail)

// @desc    Send email to reset password
// @route   POST /reset-password
router.post("/reset-password", sendEmailForResetPWd)

// @desc    Reset password
// @route   POST /reset-password
router.get("/reset-password", resetPassword)

// @desc    Update new password
// @route   PUT /reset-password
router.put("/reset-password", updateNewPassword)


module.exports = router
