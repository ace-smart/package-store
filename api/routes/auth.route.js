const express = require("express")
const router = express.Router()
const {
  auth,
  authWith3rdParty,
  getUserData,
  renewAccessToken,
  register,
  confirmEmail,
  resendConfirmEmail,
  sendEmailForResetPWd,
  resetPassword,
  updateNewPassword,
  resetToken,
  leaveMessage
} = require("../controllers/auth.controller")
const { _ensureAccessToken } = require("../helper/auth")

// @desc    Generate tokens
// @route   POST /auth?role='user'
router.post("/auth", auth)

// @desc    Generate tokens
// @route   POST /oauth?providerName='google'&clientId='1234'
router.post("/oauth", authWith3rdParty)

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

// @desc    Leave a message to admin
// @route   POST /leave-message
router.post("/leave-message", leaveMessage)


module.exports = router
