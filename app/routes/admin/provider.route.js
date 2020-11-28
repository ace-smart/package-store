const router = require("express").Router()

const {
    showProviderList,
    showCreateProviderForm,
    createProvider,
    viewProviderById,
    showUpdateProviderForm,
    updateProviderById,
    deactivateProviderById,
    activateProviderById,
    removeProviderById
} = require("../../controllers/admin/provider.controller")

// @desc    Show list of providers
// @route   GET /providers
router.get("/", showProviderList)

// @desc    Get an provider by id
// @route   GET /providers/view/:id
router.get("/view/:id", viewProviderById)

// @desc    Show create from
// @route   get /providers/add
router.get("/add", showCreateProviderForm)

// @desc    Add a new provider
// @route   POST /providers/add
router.post("/add", createProvider)

// @desc    Show update form
// @route   get /providers/edit/:id
router.get("/edit/:id", showUpdateProviderForm)

// @desc    Update an provider by id
// @route   PUT /providers/:id
router.post("/edit/:id", updateProviderById)

// @desc    Update an provider by id
// @route   PUT /providers/deactivate/:id
router.put("/deactivate/:id", deactivateProviderById)

// @desc    Activate an provider by id
// @route   PUT /providers/activate/:id
router.put("/activate/:id", activateProviderById)

// @desc    Delete an provider by id
// @route   DELETE /providers/:id
router.delete("/:id", removeProviderById)

module.exports = router
