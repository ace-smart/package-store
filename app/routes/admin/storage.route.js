const router = require("express").Router()

const {
    showStorageList,
    showCreateStorageForm,
    getStorageById,
    updateStorageById,
    removeStorageById,
} = require("../../controllers/admin/storage.controller")

// @desc    Show list of storages
// @route   GET /storages
router.get("/", showStorageList)

// @desc    Get an storage by id
// @route   GET /storages/:id
// router.get("/:id", getAccountById)

// @desc    Add a new storage
// @route   get /storages/add
router.get("/add", showCreateStorageForm)

// @desc    Add a new storage
// @route   POST /storages/add
// router.post("/add", createNewAccount)

// @desc    Update an storage by id
// @route   PUT /storages/:id
router.put("/:id", updateStorageById)

// @desc    Delete an storage by id
// @route   DELETE /storages/:id
router.delete("/:id", removeStorageById)

module.exports = router
