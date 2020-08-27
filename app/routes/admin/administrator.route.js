const router = require("express").Router()

const {
    showAdminList,
    showCreateAdminForm,
    getAdminById,
    updateAdminById,
    removeAdminById,
} = require("../../controllers/admin/administrator.controller")

// @desc    Show list of administrators
// @route   GET /administrators
router.get("/", showAdminList)

// @desc    Get an admin by id
// @route   GET /administrators/:id
// router.get("/:id", getAccountById)

// @desc    Add a new admin
// @route   get /administrators/add
router.get("/add", showCreateAdminForm)

// @desc    Add a new admin
// @route   POST /administrators/add
// router.post("/add", createNewAccount)

// @desc    Update an admin by id
// @route   PUT /administrators/:id
router.put("/:id", updateAdminById)

// @desc    Delete an admin by id
// @route   DELETE /administrators/:id
router.delete("/:id", removeAdminById)

module.exports = router
