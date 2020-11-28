const router = require("express").Router()
const helper = require('../../helper/helper')

const {
    showProfilePage,
    updateProfile,
    showChangePwdPage,
    changePwd,
} = require("../../controllers/admin/profile.controller")

// @desc    Show profile page
// @route   GET /profile
router.get("/profile", showProfilePage)

// @desc    Update profile
// @route   POST /profile
router.post("/profile", updateProfile)

// @desc    Show change password page
// @route   GET /change-password
router.get("/change-password", showChangePwdPage)

// @desc    Change password
// @route   POST /change-password
router.post("/change-password", changePwd)

module.exports = router
