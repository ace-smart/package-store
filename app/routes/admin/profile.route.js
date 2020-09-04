const router = require("express").Router()

const {
    showProfilePage,
    updateProfile,
    changePwd,
} = require("../../controllers/admin/profile.controller")

// @desc    Show list of profile
// @route   GET /profile
router.get("/", showProfilePage)

// @desc    Update profile
// @route   POST /profile
router.post("/", updateProfile)

// @desc    Change password
// @route   POST /profile/changePwd
router.post("/changePwd", changePwd)

module.exports = router
