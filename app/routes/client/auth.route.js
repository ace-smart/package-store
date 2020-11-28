const router = require("express").Router()
const {  resetPassword } = require("../../controllers/client/auth.controller")

// @desc    Reset password
// @route   GET /reset-password
router.get("/reset-password", resetPassword)

module.exports = router
