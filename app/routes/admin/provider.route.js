const router = require("express").Router()

const {
    showProviderList,
    showCreateProviderForm,
    getProviderById,
    updateProviderById,
    removeProviderById,
} = require("../../controllers/admin/provider.controller")

// @desc    Show list of providers
// @route   GET /providers
router.get("/", showProviderList)

// @desc    Get an provider by id
// @route   GET /providers/:id
// router.get("/:id", getAccountById)

// @desc    Add a new provider
// @route   get /providers/add
router.get("/add", showCreateProviderForm)

// @desc    Add a new provider
// @route   POST /providers/add
// router.post("/add", createNewAccount)

// @desc    Update an provider by id
// @route   PUT /providers/:id
router.put("/:id", updateProviderById)

// @desc    Delete an provider by id
// @route   DELETE /providers/:id
router.delete("/:id", removeProviderById)

module.exports = router
