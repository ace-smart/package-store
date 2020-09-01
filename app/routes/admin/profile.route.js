const router = require("express").Router()

const {
    showProfilePage,
    showCreateProfileForm,
    getProfileById,
    updateProfile,
    removeProfileById,
} = require("../../controllers/admin/profile.controller")

// @desc    Show list of profile
// @route   GET /profile
router.get("/", showProfilePage)

// @desc    Update profile
// @route   PUT /profile
router.put("/", updateProfile)

// @desc    Get an admin by id
// @route   GET /profile/:id
// router.get("/:id", getAccountById)

// @desc    Add a new admin
// @route   get /profile/add
router.get("/add", showCreateProfileForm)


// @desc    Update an admin by id
// @route   PUT /profile/:id
// router.put("/:id", updateProfileById)

// @desc    Delete an admin by id
// @route   DELETE /profile/:id
router.delete("/:id", removeProfileById)

module.exports = router
